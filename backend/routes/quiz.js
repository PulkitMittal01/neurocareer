// backend/routes/quiz.js
const express = require('express');
const router = express.Router();

// Store in memory (for demo - would use database in production)
let studentProfiles = {};

// POST /api/quiz - Submit quiz answers
router.post('/quiz', (req, res) => {
  try {
    const { neurodivergence, interests } = req.body;

    // Validation
    if (!neurodivergence) {
      return res.status(400).json({
        error: 'neurodivergence is required',
        code: 'MISSING_NEURODIVERGENCE'
      });
    }

    if (!interests || !Array.isArray(interests) || interests.length !== 3) {
      return res.status(400).json({
        error: 'interests must be an array of exactly 3 items',
        code: 'INVALID_INTERESTS'
      });
    }

    // Validate neurodivergence value
    const validOptions = ['autism', 'adhd', 'dyslexia', 'other'];
    if (!validOptions.includes(neurodivergence.toLowerCase())) {
      return res.status(400).json({
        error: `neurodivergence must be one of: ${validOptions.join(', ')}`,
        code: 'INVALID_NEURODIVERGENCE'
      });
    }

    // Validate interests are not empty
    if (interests.some(i => !i || i.trim() === '')) {
      return res.status(400).json({
        error: 'all interests must be non-empty strings',
        code: 'EMPTY_INTERESTS'
      });
    }

    // Generate student ID
    const studentId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store student profile
    studentProfiles[studentId] = {
      neurodivergence: neurodivergence.toLowerCase(),
      interests: interests.map(i => i.trim()),
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Quiz submitted - Student ID: ${studentId}`);

    res.status(201).json({
      success: true,
      studentId,
      message: 'Quiz answers received successfully',
      data: {
        neurodivergence: neurodivergence.toLowerCase(),
        interests
      }
    });

  } catch (error) {
    console.error('Quiz endpoint error:', error);
    res.status(500).json({
      error: 'Failed to submit quiz',
      code: 'QUIZ_SUBMISSION_ERROR'
    });
  }
});

// GET /api/quiz/:studentId - Get quiz answers (optional, for debugging)
router.get('/quiz/:studentId', (req, res) => {
  const { studentId } = req.params;
  const profile = studentProfiles[studentId];

  if (!profile) {
    return res.status(404).json({
      error: 'Student profile not found'
    });
  }

  res.json({
    success: true,
    studentId,
    profile
  });
});

module.exports = router;