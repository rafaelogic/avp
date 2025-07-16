import React, { useState, useEffect } from 'react';

function Templates({ onSelectTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState('');
  const [font, setFont] = useState('');
  const [color, setColor] = useState('');
  const [style, setStyle] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      const response = await fetch('/templates');
      const data = await response.json();
      setTemplates(data);
    };
    fetchTemplates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, font, color, style }),
    });
    const data = await response.json();
    if (data.status === 'success') {
      setTemplates([...templates, { name, font, color, style }]);
      setName('');
      setFont('');
      setColor('');
      setStyle('');
    }
  };

  return (
    <div className="w-full max-w-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Video Templates</h2>
      <form onSubmit={handleSubmit} className="flex flex-col mb-4">
        <input
          type="text"
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-800 text-white p-4 rounded-lg mb-4"
        />
        <input
          type="text"
          placeholder="Font"
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="bg-gray-800 text-white p-4 rounded-lg mb-4"
        />
        <input
          type="text"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="bg-gray-800 text-white p-4 rounded-lg mb-4"
        />
        <input
          type="text"
          placeholder="Style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="bg-gray-800 text-white p-4 rounded-lg mb-4"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Create Template
        </button>
      </form>
      <h3 className="text-xl font-bold mb-2">Existing Templates</h3>
      <ul>
        {templates.map((template) => (
          <li
            key={template.name}
            onClick={() => onSelectTemplate(template.name)}
            className="cursor-pointer hover:bg-gray-700 p-2 rounded-lg"
          >
            {template.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Templates;
