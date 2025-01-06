import React, { useState } from 'react';
import './App.css';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Navbar from './comonents/navbar/Navbar.jsx';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const apiUrl = 'https://ai-server-3x02.onrender.com/api/chat';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', content: input },
    ]);
    setInput('');

    try {
      const result = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const data = await result.json();
      if (data.response && data.response[0].content.length > 0) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'bot', content: data.response[0].content },
        ]);
      } else {
        throw new Error('No choices available');
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', content: 'Failed to load data' },
      ]);
    }
  };

  const renderMessageContent = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('### ')) {
        return <h3 key={index}>{line.replace('### ', '')}</h3>;
      } else if (line.includes('<code>')) {
        return (
          <SyntaxHighlighter key={index} language='html' style={docco}>
            {line.replace(/<.*?>/g, '')}
          </SyntaxHighlighter>
        );
      }

      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div className='App'>
      <div className='navbar'>
        <Navbar />
      </div>
      <div className='chat-container'>
        <div className='messages'>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.type === 'bot' ? (
                <div>{renderMessageContent(message.content)}</div>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className='input-area'>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows='4'
            placeholder='Type your message...'
            className='text-input'
          />
          <div className='btn-container'>
            <button type='submit'>
              <i className='fa-solid fa-arrow-up'></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
