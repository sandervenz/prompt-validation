import React from 'react';

export default function UserSelect({ username, setUsername }) {
  return (
    <div className="user-select-container">
      <label>Select Username:</label>
      <select value={username} onChange={(e) => setUsername(e.target.value)}>
        <option value="">--Select--</option>
        <option value="Azizah">Azizah</option>
        <option value="Aisyah">Aisyah</option>
        <option value="other">other</option>
      </select>
    </div>
  );
}
