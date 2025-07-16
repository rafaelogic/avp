import React, { useState, useEffect } from 'react';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const response = await fetch('/analytics');
      const data = await response.json();
      setAnalytics(data);
    };
    fetchAnalytics();
  }, []);

  if (!analytics) {
    return null;
  }

  return (
    <div className="w-full max-w-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="p-2">Platform</th>
            <th className="p-2">Views</th>
            <th className="p-2">Likes</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(analytics).map(([platform, data]) => (
            <tr key={platform}>
              <td className="p-2">{platform}</td>
              <td className="p-2">{data.views}</td>
              <td className="p-2">{data.likes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Analytics;
