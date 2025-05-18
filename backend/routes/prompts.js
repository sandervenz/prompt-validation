import express from 'express';
import pool from '../db/index.js';
import axios from 'axios';

const router = express.Router();

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const SYSTEM_MESSAGE = `
You are a helpful assistant who helps biologist to generate a detailed prompt for a protein sequence generator.
Do not ask for any additional details.
Only generate a detailed prompt.
Output should include only the pure prompt without any additional commentary or explanation
Provide output in json format only with key "response"

#####

json format:

{
  "response": "__YOUR_RESPONSE_HERE__"
}
Do not include any explanation, markdown, or extra text outside the JSON.
The value of 'response' should contain your full answer as a string.
`;

router.get('/next-record', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'Username required' });

  try {
    // 1. Cek apakah user sudah punya prompt yang di-lock tapi belum di-feedback
    const existing = await pool.query(`
      SELECT p.id, p.text
      FROM prompts p
      WHERE p.reserved_by = $1
      AND NOT EXISTS (
        SELECT 1 FROM user_feedbacks uf WHERE uf.prompt_id = p.id AND uf.username = $1
      )
      ORDER BY p.id ASC
      LIMIT 1
    `, [username]);

    let prompt;
    if (existing.rows.length > 0) {
      prompt = existing.rows[0];
    } else {
      // 2. Lock prompt baru untuk user
      const next = await pool.query(`
        UPDATE prompts
        SET reserved_by = $1
        WHERE id = (
          SELECT p.id
          FROM prompts p
          WHERE p.reserved_by IS NULL
          ORDER BY p.id ASC
          LIMIT 1
        )
        RETURNING id, text
      `, [username]);

      if (next.rows.length === 0) {
        return res.status(404).json({ message: 'No more records available' });
      }
      prompt = next.rows[0];
    }

    // 3. Generate improved prompt via Mistral AI
    const apiResponse = await axios.post(MISTRAL_API_URL, {
      model: 'mistral-small', // pakai model gratis
      messages: [
        { role: 'system', content: SYSTEM_MESSAGE },
        { role: 'user', content: prompt.text }
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Parsing response JSON string
    let improvedPrompt = '';
    try {
      const responseContent = apiResponse.data.choices[0].message.content;
      // responseContent diharapkan JSON string {"response": "text here"}
      const parsed = JSON.parse(responseContent);
      improvedPrompt = parsed.response || '';
    } catch (err) {
      console.error('Failed to parse LLM response:', err);
      improvedPrompt = 'Failed to generate improved prompt.';
    }

    res.json({
      id: prompt.id,
      text: prompt.text,
      improved_prompt: improvedPrompt
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching next record or generating improved prompt' });
  }
});

// ✅ POST feedback
router.post('/feedback', async (req, res) => {
  const { prompt_id, username, llm_prompt, prompt_feedback } = req.body;
  const validFeedback = ['good', 'neutral', 'bad'];

  if (!validFeedback.includes(prompt_feedback)) {
    return res.status(400).json({ error: 'Invalid feedback value' });
  }

  try {
    await pool.query(`
      INSERT INTO user_feedbacks (prompt_id, username, llm_prompt, prompt_feedback)
      VALUES ($1, $2, $3, $4)
    `, [prompt_id, username, llm_prompt, prompt_feedback]);

    res.json({ message: 'Feedback saved successfully' });

  } catch (error) {
    console.error(error);

    if (error.code === '23505') {
      return res.status(409).json({
        error: 'This prompt has already been validated by another user.'
      });
    }

    res.status(500).json({ error: 'Error saving feedback' });
  }
});

export default router;
