import React, { useContext, useState } from 'react';
import axios from 'axios';
import background from './assets/Foodie.jpg';
import {UserContext} from "./UserContext.jsx";

export default function Chat() {
    // variables for messages, input, recipe and active tab... more can be added
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  //const [recipeHistory, setRecipeHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');
  const {setId, setUsername, recipeHistory, setRecipeHistory} = useContext(UserContext);


  // handle sending messages
  const handleSend = async () => {
    if (!inputMessage.trim()) return; //if empty, don't send

    // add new messages to the list
    const newMessages = [...messages, { sender: 'user', text: inputMessage }]; 
    setMessages(newMessages);
    setInputMessage(''); // when message is sent, clear input box

    try {
        // send ingredients to server
      const response = await axios.post('http://localhost:4000/generate-recipe', {
        ingredients: inputMessage.split(',').map(ingredient => ingredient.trim())
      });

      // formats the message 
      const formattedMessage = formatMessage(response.data.recipe);

      // response added to list and update history
      const updatedMessages = [...newMessages, { sender: 'bot', text: formattedMessage }];
      setMessages(updatedMessages);
      setRecipeHistory([...recipeHistory, { input: inputMessage, output: formattedMessage }]);
    } catch (error) {
      console.error('Error generating recipe:', error);
    }
  };

  // Format messages
  // When pressing 'Send' the message is formatted correctly
  // When pressing 'Enter' on keyboard the format is messed up
  const formatMessage = (message) => {
    return message
      .replace(/Ingredients:/g, '\n\nIngredients:\n')
      .replace(/Steps:/g, '\n\nSteps:\n')
      .replace(/Notes:/g, '\n\nNotes:\n')
      .replace(/(\d+)\.\s/g, '\n$1. '); 
  };

  // When 'Enter' message is sent
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
 
  // logout function
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/logout'); 
      setId(null); // clears ID
      setUsername(null); // clears Username
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex h-screen flex-col relative" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1}}>
     <div className="flex-shrink-0 flex justify-between items-center bg-gray-200 p-4">
        <div>
          <button
            onClick={() => setActiveTab('chat')}
            className={`p-2 ${activeTab === 'chat' ? 'bg-pastel-green text-white p-2 rounded-lg' : 'bg-pastel-green-dark text-black p-2 rounded-lg'}`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`p-2 ${activeTab === 'history' ? 'bg-pastel-orange text-white p-2 rounded-lg' : 'bg-pastel-orange-dark text-black p-2 rounded-lg'}`}
          >
            Recipe History
          </button>
        </div>
        <div>
          <button 
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded-lg">
            Logout
          </button>
        </div>
      </div>
      {activeTab === 'chat' ? (
        <div className="flex-grow overflow-auto p-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 rounded-lg ${msg.sender === 'user' ? 'bg-pastel-orange text-black' : 'bg-pastel-green text-black'}`}>
                {msg.text.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-grow overflow-auto p-4">
          {recipeHistory.map((entry, index) => (
            <div key={index} className="mb-4 p-2 border rounded-lg bg-gray-100">
              <div className="font-bold mb-2">Ingredients: {entry.input}</div>
              <div>{entry.output.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}</div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'chat' && (
        <div className="flex p-4 border-t">
          <input
            type="text"
            placeholder="List the ingredients here separated by a comma (ex. salt, pepper, etc..)"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow border p-2 rounded-l-lg"
          />
          <button onClick={handleSend} className="bg-pastel-green text-black p-2 rounded-r-lg">
            Generate Recipe
          </button>
        </div>
      )}
    </div>
  );
}
