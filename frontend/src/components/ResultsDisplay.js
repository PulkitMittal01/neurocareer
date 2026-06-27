import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AIChatMentor from './AIChatMentor';
const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

function ResultsDisplay({ roles, studentProfile }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedRole) {
      setLoading(true);
      axios
        .get(`${API_URL}/jobs/${encodeURIComponent(selectedRole)}`)
        .then(res => {
          console.log('API Response payload:', res.data);
          setJobDetails(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching job details:', err);
          setJobDetails(null);
          setLoading(false);
        });
    }
  }, [selectedRole]);

  const renderList = (items) => {
    if (!items) return null;

    // If it's an array, handle its elements
    if (Array.isArray(items)) {
      return items.map((item, i) => {
        if (typeof item === 'string') return <li key={i}>{item}</li>;
        if (typeof item === 'object' && item !== null) {
          // Render object keys as list if array element is an object
          return <li key={i}>{Object.keys(item).join(', ')}</li>;
        }
        return <li key={i}>{String(item)}</li>;
      });
    }

    // If it's an object, render keys/values
    if (typeof items === 'object' && items !== null) {
      return Object.entries(items).map(([key, val], i) => {
        const valStr = typeof val === 'string' ? `: ${val}` : '';
        return <li key={i}>{key}{valStr}</li>;
      });
    }

    // If it's a string, just render one item
    if (typeof items === 'string') {
      return <li>{items}</li>;
    }

    // Fallback
    return <li>{String(items)}</li>;
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <div style={{
          width: '80px',
          height: '80px',
          background: 'white',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          border: '1px solid #E8E8E8',
          boxShadow: '0 2px 8px rgba(73, 84, 100, 0.08)'
        }}>
          <img
            src={`${process.env.PUBLIC_URL}/logo-128.png`}
            alt="Career Coach Logo"
            style={{
              width: '60px',
              height: '60px'
            }}
          />
        </div>
        <h2>Your Recommended Careers</h2>
        <p>
          Based on your {studentProfile?.neurodivergence?.toUpperCase()} neurodivergence and interests
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px', alignItems: 'start' }}>
        {/* Left: Roles */}
        <div>
          <h3 style={{ marginBottom: '20px' }}>Top 5 Career Matches</h3>
          <div className="roles-grid">
            {roles.map((role) => (
              <div
                key={role.name}
                className={`role-card ${selectedRole === role.name ? 'selected' : ''}`}
                onClick={() => setSelectedRole(role.name)}
              >
                <div className="role-name">{role.name}</div>

                <div className="role-meta">
                  <div className="role-meta-item">
                    <div className="role-meta-label">Match</div>
                    <div className="role-meta-value">{role.matchPercentage}%</div>
                  </div>
                  <div className="role-meta-item">
                    <div className="role-meta-label">Salary</div>
                    <div className="role-meta-value">{role.salaryRange}</div>
                  </div>
                  <div className="role-meta-item">
                    <div className="role-meta-label">Industry</div>
                    <div className="role-meta-value">{role.industry}</div>
                  </div>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${role.matchPercentage}%` }} />
                </div>

                <div className="role-quote">"{role.quote}"</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Companies */}
        <div className="side-panel">
          <h3>Companies & Accommodations</h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <span className="spinner"></span>
            </div>
          ) : jobDetails ? (
            <>
              <div className="companies-list">
                <div className="section-title">💼 Hiring Companies</div>
                <ul>
                  {renderList(jobDetails.companies)}
                </ul>
              </div>

              <div className="accommodations-list">
                <div className="section-title">✓ Accommodations</div>
                <ul>
                  {renderList(jobDetails.accommodations)}
                </ul>
              </div>
            </>
          ) : (
            <p style={{ color: '#BBBFCA', fontSize: '0.9rem' }}>
              Click a role to see details
            </p>
          )}
        </div>
      </div>

      {/* AI Chat Mentor Section */}
      <div style={{ marginTop: '40px' }}>
        <AIChatMentor studentProfile={studentProfile} roles={roles} />
      </div>
    </div>
  );
}

export default ResultsDisplay;