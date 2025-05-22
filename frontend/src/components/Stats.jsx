import React, { useEffect, useState } from 'react';
import { fetchStats } from '../api';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await fetchStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

  if (loading) return <div>Loading stats...</div>;
  if (!stats) return <div>Failed to load stats.</div>;

  return (
    <div className="p-4 border rounded-md shadow bg-white max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">📊 Prompt Validation Stats</h2>

      <p className="mb-2"><strong>Total validated prompts:</strong> {stats.total}</p>

      <div className="mb-4">
        <strong>Per day (last 7 days):</strong>
        <ul className="list-disc ml-5 mt-1">
          {stats.perDay.map(day => (
            <li key={day.date}>
              {new Date(day.date).toLocaleDateString()}: {day.count} prompts
            </li>
          ))}
        </ul>
      </div>

      <div>
        <strong>Feedback counts:</strong>
        <ul className="list-disc ml-5 mt-1">
          <li>✅ Good: {stats.feedbackCounts.good}</li>
          <li>😐 Neutral: {stats.feedbackCounts.neutral}</li>
          <li>❌ Bad: {stats.feedbackCounts.bad}</li>
        </ul>
      </div>
    </div>
  );
};

export default Stats;
