import React, { useState } from 'react';

function Schedule({ videoPath, title, description }) {
  const [platform, setPlatform] = useState('youtube');
  const [postTime, setPostTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/schedule_post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform,
        video_path: videoPath,
        title,
        description,
        post_time: postTime,
      }),
    });
    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="w-full max-w-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Schedule Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col mb-4">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="bg-gray-800 text-white p-4 rounded-lg mb-4"
        >
          <option value="youtube">YouTube</option>
          <option value="facebook">Facebook</option>
          <option value="tiktok">TikTok</option>
        </select>
        <input
          type="datetime-local"
          value={postTime}
          onChange={(e) => setPostTime(e.target.value)}
          className="bg-gray-800 text-white p-4 rounded-lg mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Schedule Post
        </button>
      </form>
    </div>
  );
}

export default Schedule;
