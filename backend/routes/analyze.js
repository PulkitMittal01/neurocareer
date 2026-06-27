// backend/routes/analyze.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST /api/analyze - Analyze student profile with Groq
router.post('/analyze', async (req, res) => {
  try {
    const { neurodivergence, interests, studentId } = req.body;

    // Validation
    if (!neurodivergence || !interests || !Array.isArray(interests)) {
      return res.status(400).json({
        error: 'neurodivergence and interests array are required',
        code: 'INVALID_INPUT'
      });
    }

    console.log(`🤖 Analyzing profile for student: ${studentId || 'unknown'}`);
    console.log(`📊 Neurodivergence: ${neurodivergence}, Interests: ${interests.join(', ')}`);

    // Create Groq prompt
    const prompt = `You are a career counselor for neurodivergent students. Your job is to show them careers where their neurodivergence is an ADVANTAGE, not a limitation.

A high school student with ${neurodivergence} is interested in: ${interests.join(', ')}.

Recommend exactly 5 career roles that:
1. Match their interests
2. Play to their natural neurodivergent strengths
3. Are realistic entry points for high school students
4. Show how their neurodivergence is actually an advantage

For EACH role provide a personalized explanation.

Examples of strengths by neurodivergence:
- ADHD: Hyperfocus, creative problem-solving, high energy, thriving under pressure
- Autism: Attention to detail, pattern recognition, logical thinking, consistency
- Dyslexia: Visual-spatial thinking, creativity, seeing the big picture, intuition

Return ONLY valid JSON in this exact format, no other text:
{
  "roles": [
    {
      "name": "Role Title",
      "matchPercentage": 95,
      "salaryRange": "$60,000-$100,000",
      "quote": "Your [specific strength] makes you perfect for this because [explanation]. Companies like [company names] hire specifically for this.",
      "industry": "Industry Name"
    },
    ...5 total roles
  ]
}`;

    // Call Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract Groq's response
    const aiMessage = response.data.choices[0].message.content;
    console.log('📝 Groq response received');

    // Parse JSON from Groq response
    let rolesData;
    try {
      // Try to parse the response as JSON
      rolesData = JSON.parse(aiMessage);
    } catch (parseError) {
      // If that fails, try to extract JSON from the response
      const jsonMatch = aiMessage.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        rolesData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse Groq response as JSON');
      }
    }

    // Validate response structure
    if (!rolesData.roles || !Array.isArray(rolesData.roles) || rolesData.roles.length === 0) {
      throw new Error('Invalid response structure from Groq');
    }

    console.log(`✅ Successfully generated ${rolesData.roles.length} role recommendations`);

    res.status(200).json({
      success: true,
      studentId,
      neurodivergence,
      interests,
      roles: rolesData.roles,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis error:', error.response?.data || error.message);

    // Specific error messages
    if (error.message.includes('API key') || error.response?.status === 401) {
      return res.status(401).json({
        error: 'Groq API authentication failed',
        code: 'AUTH_ERROR'
      });
    }

    if (error.message.includes('parse')) {
      return res.status(502).json({
        error: 'Failed to parse AI response',
        code: 'PARSE_ERROR',
        details: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to analyze profile',
      code: 'ANALYSIS_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;