import React from 'react';

export default function PromptCard({ text, llmPrompt, onFeedback }) {
  return (
    <div className="prompt-card">
      <h3>Original Text</h3>
      <p>{text}</p>

      <h3>LLM Prompt</h3>
      <p>{llmPrompt}</p>

      <div>
        <button onClick={() => onFeedback('good')}>Good</button>
        <button onClick={() => onFeedback('neutral')}>Neutral</button>
        <button onClick={() => onFeedback('bad')}>Bad</button>
      </div>
    </div>
  );
}
