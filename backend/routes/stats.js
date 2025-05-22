import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Total feedback
    const totalRes = await pool.query(`
      SELECT COUNT(*) AS total FROM user_feedbacks
    `);

    // Per day
    const perDayRes = await pool.query(`
      SELECT DATE(created_at) AS date, COUNT(*) AS count
      FROM user_feedbacks
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 7
    `);

    // Feedback breakdown
    const feedbackCountRes = await pool.query(`
      SELECT prompt_feedback, COUNT(*) AS count
      FROM user_feedbacks
      GROUP BY prompt_feedback
    `);

    const feedbackCounts = {
      good: 0,
      neutral: 0,
      bad: 0
    };

    feedbackCountRes.rows.forEach(row => {
      feedbackCounts[row.prompt_feedback] = parseInt(row.count, 10);
    });

    res.json({
      total: parseInt(totalRes.rows[0].total, 10),
      perDay: perDayRes.rows.map(row => ({
        date: row.date,
        count: parseInt(row.count, 10)
      })),
      feedbackCounts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
});

export default router;
