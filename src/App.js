import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);

  const backendUrl = 'https://visionbuilder-backend-v4-1.onrender.com';

  const sendMessage = async () => {
    if (!input) return;

    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage]);

    const res = await fetch(`${backendUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input })
    });

    const data = await res.json();
    const botReply = { role: 'assistant', content: data.text || 'No response.' };
    setMessages([...messages, newMessage, botReply]);
    setInput('');
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${backendUrl}/api/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setImage(data.imageUrl);
  };

  return (
    <div className="app-container">
      <h1>Vision Builder</h1>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'Vision Builder'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="controls">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your design request..." />
        <button onClick={sendMessage}>Send</button>
      </div>
      <input type="file" onChange={handleUpload} />
      {image && <div><h3>Uploaded Image:</h3><img src={image} alt="Uploaded" width="300" /></div>}
    </div>
  );
}

export default App;
