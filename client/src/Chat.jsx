import React, { useState } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');

    try {
      const response = await axios.post('http://localhost:4000/generate-recipe', {
        ingredients: inputMessage.split(',').map(ingredient => ingredient.trim())
      });

      setMessages([...newMessages, { sender: 'bot', text: response.data.recipe }]);
    } catch (error) {
      console.error('Error generating recipe:', error);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-grow overflow-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded-lg ${msg.sender === 'user' ? 'bg-pastel-green text-black' : 'bg-pastel-orange text-black'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex p-4 border-t">
        <input
          type="text"
          placeholder="List the ingredients here separated by a comma (ex. salt, pepper, etc..)"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow border p-2 rounded-l-lg"
        />
        <button onClick={handleSend} className="bg-pastel-green text-black p-2 rounded-r-lg">
          Send
        </button>
      </div>
    </div>
  );
}
