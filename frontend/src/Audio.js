import React from 'react';

const music = [
  { name: 'Happy', url: '/audio/happy.mp3' },
  { name: 'Sad', url: '/audio/sad.mp3' },
  { name: 'Upbeat', url: '/audio/upbeat.mp3' },
];

const soundEffects = [
  { name: 'Explosion', url: '/audio/explosion.mp3' },
  { name: 'Laser', url: '/audio/laser.mp3' },
  { name: 'Swoosh', url: '/audio/swoosh.mp3' },
];

function Audio({ onSelectMusic, onSelectSoundEffect }) {
  return (
    <div className="w-full max-w-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Music & Sound Effects</h2>
      <h3 className="text-xl font-bold mb-2">Music</h3>
      <ul>
        {music.map((track) => (
          <li
            key={track.name}
            onClick={() => onSelectMusic(track.url)}
            className="cursor-pointer hover:bg-gray-700 p-2 rounded-lg"
          >
            {track.name}
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-bold mb-2 mt-4">Sound Effects</h3>
      <ul>
        {soundEffects.map((effect) => (
          <li
            key={effect.name}
            onClick={() => onSelectSoundEffect(effect.url)}
            className="cursor-pointer hover:bg-gray-700 p-2 rounded-lg"
          >
            {effect.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Audio;
