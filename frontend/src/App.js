import React, { useState } from 'react';
import Templates from './Templates';
import Audio from './Audio';
import Schedule from './Schedule';
import Analytics from './Analytics';

function App() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [videoPath, setVideoPath] = useState('');
  const [videoType, setVideoType] = useState('youtube');
  const [template, setTemplate] = useState('');
  const [files, setFiles] = useState([]);
  const [music, setMusic] = useState('');
  const [soundEffect, setSoundEffect] = useState('');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setStatus('Generating video...');
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('video_type', videoType);
      formData.append('template', template);
      formData.append('music', music);
      formData.append('sound_effect', soundEffect);
      formData.append('subtitles_enabled', subtitlesEnabled);
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/generate_video', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setStatus(data.message);
      if (data.output && data.output.path) {
        setVideoPath(data.output.path);
      }
    } catch (error) {
      setStatus('Error generating video.');
    }
  };

  const handleUpload = async (platform) => {
    setStatus(`Uploading to ${platform}...`);
    try {
      const response = await fetch(`/upload_to_${platform}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_path: videoPath, title: 'AI Generated Video', description: text }),
      });
      const data = await response.json();
      setStatus(data.message);
    } catch (error) {
      setStatus(`Error uploading to ${platform}.`);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">AI Video Generator</h1>
      <form onSubmit={handleGenerate} className="w-full max-w-lg">
        <div className="flex flex-col mb-4">
          <label htmlFor="text" className="mb-2 text-lg">Enter your script:</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-gray-800 text-white p-4 rounded-lg h-48 resize-none"
          ></textarea>
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="videoType" className="mb-2 text-lg">Video Type:</label>
          <select
            id="videoType"
            value={videoType}
            onChange={(e) => setVideoType(e.target.value)}
            className="bg-gray-800 text-white p-4 rounded-lg"
          >
            <option value="youtube">YouTube Video</option>
            <option value="short">YouTube Short</option>
          </select>
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="files" className="mb-2 text-lg">Upload Images/Videos:</label>
          <input
            type="file"
            id="files"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
            className="bg-gray-800 text-white p-4 rounded-lg"
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="subtitles"
            checked={subtitlesEnabled}
            onChange={(e) => setSubtitlesEnabled(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="subtitles">Enable Automatic Subtitles</label>
        </div>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Generate Video
        </button>
      </form>
      <Templates onSelectTemplate={setTemplate} />
      <Audio onSelectMusic={setMusic} onSelectSoundEffect={setSoundEffect} />
      {videoPath && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Generated Video</h2>
          <video src={videoPath} controls className="w-full max-w-lg" />
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handleUpload('youtube')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mr-4"
            >
              Upload to YouTube
            </button>
            <button
              onClick={() => handleUpload('facebook')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-4"
            >
              Upload to Facebook
            </button>
            <button
              onClick={() => handleUpload('tiktok')}
              className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Upload to TikTok
            </button>
          </div>
          <Schedule videoPath={videoPath} title="AI Generated Video" description={text} />
        </div>
      )}
      <Analytics />
      {status && <p className="mt-8 text-lg">{status}</p>}
    </div>
  );
}

export default App;
