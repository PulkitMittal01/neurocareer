// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import QuizForm from './components/QuizForm';
import ResultsDisplay from './components/ResultsDisplay';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('quiz'); // 'quiz' or 'results'
  const [studentProfile, setStudentProfile] = useState(null);
  const [roles, setRoles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

  const handleQuizSubmit = async (answers) => {
    try {
      setLoading(true);
      setError(null);

      console.log('📤 Submitting quiz answers...');

      // Step 1: Submit quiz answers
      const quizResponse = await axios.post(`${API_URL}/quiz`, {
        neurodivergence: answers.neurodivergence,
        interests: answers.interests
      });

      const studentId = quizResponse.data.studentId;
      console.log(`✅ Quiz submitted. Student ID: ${studentId}`);

      // Step 2: Analyze profile with Groq
      console.log('🤖 Analyzing profile with Groq...');
      const analyzeResponse = await axios.post(`${API_URL}/analyze`, {
        studentId,
        neurodivergence: answers.neurodivergence,
        interests: answers.interests
      });

      console.log(`✅ Analysis complete. Found ${analyzeResponse.data.roles.length} roles`);

      // Update state with results
      setStudentProfile({
        studentId,
        neurodivergence: answers.neurodivergence,
        interests: answers.interests
      });

      setRoles(analyzeResponse.data.roles);
      setCurrentPage('results');

    } catch (err) {
      console.error('❌ Error:', err);

      // Provide helpful error messages
      if (err.response?.status === 401) {
        setError('API authentication failed. Please check your Groq API key.');
      } else if (err.response?.status === 502) {
        setError('Failed to process your profile. Please try again.');
      } else if (err.message === 'Network Error') {
        setError('Could not connect to the server. Is it running?');
      } else {
        setError(err.response?.data?.error || 'An error occurred. Please try again.');
      }

      setLoading(false);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentPage('quiz');
    setStudentProfile(null);
    setRoles(null);
    setError(null);
  };

  return (
    <div className="App">
      {error && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 z-50">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-white font-bold text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {currentPage === 'quiz' ? (
        <div className="landing-layout fade-in">
          <div className="landing-quote-container slide-in-left">
            <blockquote className="landing-quote">
              "Know me for my abilities, not my disability."
              <footer>– Robert M. Hensel</footer>
            </blockquote>
          </div>
          <div className="landing-form-container slide-in-right">
            <QuizForm onSubmit={handleQuizSubmit} isLoading={loading} />
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <ResultsDisplay roles={roles} studentProfile={studentProfile} />

          {/* Retake Button */}
          <div className="flex justify-center py-8">
            <button
              onClick={handleRetakeQuiz}
              className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition retake-button"
            >
              ← Take Quiz Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;