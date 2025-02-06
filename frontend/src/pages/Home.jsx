import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false); // State to control chat window visibility

  const handleSend = async () => {
    console.log('Sending message:', input);
    if (input.trim() === '') return;

    const response = await axios.post('http://localhost:4000/api/chat/sendMessage', { input: input });

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    console.log(response.data.message);

    const botMessage = { sender: 'bot', text: response.data.message };

    setMessages([...messages, userMessage, botMessage]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center justify-center p-40">
      <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex h-70">
        {/* Left half - Image */}
        <div className="w-1/2">
          <img 
            src={assets.iiith} 
            alt="IIITH Buy/Sell Platform" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Right half - Title */}
        <div className="w-1/2 flex flex-col items-center justify-center p-12">
          <h1 className="text-6xl font-bold text-center text-black leading-tight">
            BUY/SELL
            <br />
            @
            <br />
            IIITH
          </h1>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-10 right-10 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Floating Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-10 w-96 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col max-h-[75vh]">
          {/* Chat Header */}
          <div className="bg-black text-white p-4">
            <h2 className="text-lg font-semibold">Chat Support</h2>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 p-2 rounded ${
                  msg.sender === 'user'
                    ? 'bg-gray-200 text-right ml-auto'
                    : 'bg-gray-300 text-left mr-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex p-4 bg-white border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 p-2 border rounded-l-lg"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSend}
              className="p-2 bg-black text-white rounded-r-lg hover:bg-gray-800 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;