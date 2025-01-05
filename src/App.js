import React, { useState } from 'react';
import './App.css';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', content: input },
      ]);
      const result = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });
      const data = await result.json();
      if (data.response && data.response[0].content.length > 0) {
        setResponse(data.response[0].content);

        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'bot', content: data.response[0].content },
        ]);

        setInput('');
      } else {
        throw new Error('No choices available');
      }
    } catch (error) {
      setResponse('Failed to load data');
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', content: 'Failed to load data' },
      ]);
      setInput('');
    }
  };

  // Function to safely parse and render HTML content with custom headers
  const renderMessageContent = (content) => {
    // Split the content into lines and check for headings
    return content.split('\n').map((line, index) => {
      if (line.startsWith('### ')) {
        // If the line starts with '###', render it as an <h3> header
        return <h3 key={index}>{line.replace('### ', '')}</h3>;
      } else if (line.includes('<code>')) {
        // Render code blocks with syntax highlighting
        return (
          <SyntaxHighlighter key={index} language='html' style={docco}>
            {line.replace(/<.*?>/g, '')}
          </SyntaxHighlighter>
        );
      }
      // For other lines, render as paragraphs
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div className='App'>
      <div className='chat-container'>
        <div className='messages'>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.type === 'bot' ? (
                // Render safe HTML content using the renderMessageContent function
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
