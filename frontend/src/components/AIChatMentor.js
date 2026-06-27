import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const SUGGESTED_QUESTIONS = [
  "Learning Roadmap",
  "Highest Paying Career",
  "College Requirements",
  "Daily Work Life",
  "Companies Hiring"
];

function AIChatMentor({ studentProfile, roles }) {
  // Find highest match career for default
  const defaultCareer = roles && roles.length > 0
    ? roles.reduce((max, role) => max.matchPercentage > role.matchPercentage ? max : role).name
    : '';

  const [selectedCareer, setSelectedCareer] = useState(defaultCareer);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: `## 🎯 ${defaultCareer}\n\nAsk me about:\n\n* Learning Roadmap\n* College Requirements\n* Daily Work Life\n* Companies Hiring\n* Salary Growth\n\nChoose a suggested question below to get started.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

  const sendMessage = async (questionText) => {
    if (!questionText.trim()) return;

    const userMessage = { role: 'user', content: questionText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        question: questionText,
        selectedCareer: selectedCareer,
        analysisData: {
          ...studentProfile,
          roles
        }
      });

      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: response.data.answer }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: 'Sorry, I encountered an error. Please try asking again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="w-full mt-12">
      <h2 className="text-4xl font-bold text-gray-800 mb-6 text-left underline">Select the carreer you want to know about:</h2>
      <div className="chat-container bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-16 py-6 border-b border-gray-100 bg-gray-50 text-center">
          <div style={{ width: '70%', margin: '0 auto' }}>
            <select
              value={selectedCareer}
              onChange={(e) => {
                setSelectedCareer(e.target.value);
                setMessages([{
                  role: 'ai',
                  content: `## 🎯 ${e.target.value}\n\nAsk me about:\n\n* Learning Roadmap\n* College Requirements\n* Daily Work Life\n* Companies Hiring\n* Salary Growth\n\nChoose a suggested question below to get started.`
                }]);
              }}
              className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm font-semibold text-gray-800 select-bold-arrow cursor-pointer bg-white"
              style={{ textAlign: 'center', textAlignLast: 'center' }}
            >
              {roles?.map((role, idx) => (
                <option key={idx} value={role.name}>{role.name} ({role.matchPercentage}% Match)</option>
              ))}
            </select>
          </div>
        </div>

        <div className="chat-messages overflow-y-auto bg-white flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role === 'user' ? 'message-user' : 'message-ai'}`}>
              <div className="message-bubble">
                {msg.role === 'ai' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-message message-ai">
              <div className="message-bubble flex items-center gap-2">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
        </div>

        <div className="chat-suggestions p-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Suggested Questions</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="suggestion-btn text-sm px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="chat-input-form p-4 border-t border-gray-100 flex gap-2 bg-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your results..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="send-btn px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIChatMentor;
