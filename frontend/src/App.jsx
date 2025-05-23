import React, { useState, useEffect } from 'react';
import { fetchNextPrompt, submitFeedback } from './api';
import UserSelect from './components/UserSelect';
import PromptCard from './components/PromptCard';
import LoadingSpinner from './components/LoadingSpinner';
import Stats from './components/Stats';

function App() {
  const [username, setUsername] = useState('');
  const [prompt, setPrompt] = useState(null);
  const [llmPrompt, setLlmPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (username) {
      loadNext();
    }
  }, [username]);

  const loadNext = async () => {
    setLoading(true);
    try {
      const res = await fetchNextPrompt(username);
      if (res.data) {
        setPrompt(res.data);
        // res.data.improved_prompt atau nama field yang berisi prompt hasil LLM
        setLlmPrompt(res.data.improved_prompt || `This is a generated prompt for: ${res.data.text}`);
      } else {
        setPrompt(null);
        alert('No more prompts.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching prompt.');
      setPrompt(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (choice) => {
    try {
      await submitFeedback({
        prompt_id: prompt.id,
        username,
        llm_prompt: llmPrompt,
        prompt_feedback: choice,
      });
      loadNext(); // lanjut ke prompt berikutnya jika berhasil
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 409) {
        alert('This prompt has already been validated by another user. Loading next prompt...');
        loadNext(); // otomatis ambil prompt berikutnya jika prompt sudah divalidasi
      } else {
        alert('Failed to save feedback.');
      }
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Prompt Validation App</h1>
      <UserSelect username={username} setUsername={setUsername} />

      {loading && <LoadingSpinner />}

      {!loading && prompt && (
        <>
          <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
            Prompt ID: {prompt.id}
          </p>
          <PromptCard
            text={prompt.text}
            llmPrompt={llmPrompt}
            onFeedback={handleFeedback}
          />
        </>
      )}

      {!loading && !prompt && username && (
        <p style={{ marginTop: '1rem' }}>No more prompts available.</p>
      )}

      {/* ✅ Letakkan stats di bawah semua konten */}
      <div style={{ marginTop: '2rem' }}>
        <Stats />
      </div>
    </div>
  );
}

export default App;
