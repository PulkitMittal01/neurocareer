import React, { useState } from 'react';

function QuizForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    neurodivergence: '',
    interests: ['', '', '']
  });

  const [errors, setErrors] = useState({});

  const neurodivergenceOptions = [
    { value: 'autism', label: 'Autism' },
    { value: 'adhd', label: 'ADHD' },
    { value: 'dyslexia', label: 'Dyslexia' },
    { value: 'other', label: 'Other' }
  ];

  const handleNeurodivergenceChange = (e) => {
    setFormData({ ...formData, neurodivergence: e.target.value });
    if (errors.neurodivergence) {
      setErrors({ ...errors, neurodivergence: '' });
    }
  };

  const handleInterestChange = (index, value) => {
    const newInterests = [...formData.interests];
    newInterests[index] = value;
    setFormData({ ...formData, interests: newInterests });
    if (errors[`interest${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`interest${index}`];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.neurodivergence) {
      newErrors.neurodivergence = 'Please select a neurodivergence type';
    }
    formData.interests.forEach((interest, index) => {
      if (!interest.trim()) {
        newErrors[`interest${index}`] = 'Please enter an interest';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit({
      neurodivergence: formData.neurodivergence,
      interests: formData.interests.map(i => i.trim())
    });
  };

  return (
    <div className="form-container">
      <div className="form-header">
  <div style={{ 
    width: '100px', 
    height: '100px', 
    background: 'white',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    border: '1px solid #E8E8E8',
    boxShadow: '0 2px 8px rgba(73, 84, 100, 0.08)'
  }}>
    <img 
      src={`${process.env.PUBLIC_URL}/logo-128.png`} 
      alt="Career Coach Logo"
      style={{ 
        width: '80px', 
        height: '80px'
      }}
    />
  </div>
  <h1>Equal Opportunity<br/>Career Coach</h1>
  <p>Discover careers where your strengths shine</p>
</div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>What's your neurodivergence? *</label>
          <select
            value={formData.neurodivergence}
            onChange={handleNeurodivergenceChange}
            disabled={isLoading}
            style={errors.neurodivergence ? { borderColor: '#495464' } : {}}
          >
            <option value="">Select an option...</option>
            {neurodivergenceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.neurodivergence && (
            <p style={{ color: '#495464', fontSize: '0.8rem', marginTop: '6px' }}>
              {errors.neurodivergence}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>What are you interested in? * (Enter 3 interests)</label>
          {formData.interests.map((interest, index) => (
            <div key={index}>
              <input
                type="text"
                value={interest}
                onChange={(e) => handleInterestChange(index, e.target.value)}
                disabled={isLoading}
                placeholder={`Interest ${index + 1} (e.g., coding, design, gaming)`}
                style={errors[`interest${index}`] ? { borderColor: '#495464' } : {}}
              />
              {errors[`interest${index}`] && (
                <p style={{ color: '#495464', fontSize: '0.8rem', marginTop: '6px' }}>
                  {errors[`interest${index}`]}
                </p>
              )}
            </div>
          ))}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Analyzing...
            </>
          ) : (
            'Get My Recommendations'
          )}
        </button>
      </form>
    </div>
  );
}

export default QuizForm;