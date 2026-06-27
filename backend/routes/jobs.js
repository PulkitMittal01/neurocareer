// backend/routes/jobs.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/jobs/:roleName - Get job details
router.get('/jobs/:roleName', async (req, res) => {
  try {
    const { roleName } = req.params;

    if (!roleName) {
      return res.status(400).json({
        error: 'Role name is required',
        code: 'MISSING_ROLE'
      });
    }

    // Normalize role name
    const normalizedName = decodeURIComponent(roleName)
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    console.log(`🤖 Fetching dynamic companies and accommodations for: ${normalizedName}`);

    const prompt = `You are an expert career counselor for neurodivergent individuals.
We are looking for real-world details for the job role: "${normalizedName}".

Please provide:
1. Exactly 5 real-world companies that frequently hire for this role or are known for having this role. (Focus on inclusive or well-known companies if possible).
2. Exactly 5 common accommodations that neurodivergent individuals might request or find helpful in this specific role.

Return ONLY valid JSON in this exact format, no other text:
{
  "companies": ["Company 1", "Company 2", "Company 3", "Company 4", "Company 5"],
  "accommodations": ["Accommodation 1", "Accommodation 2", "Accommodation 3", "Accommodation 4", "Accommodation 5"],
  "industry": "General Industry Name (e.g. Tech, Media, Healthcare)"
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

    const aiMessage = response.data.choices[0].message.content;
    console.log('📝 Groq response received for job details');

    let jobDetails;
    try {
      jobDetails = JSON.parse(aiMessage);
    } catch (parseError) {
      const jsonMatch = aiMessage.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jobDetails = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse Groq response as JSON');
      }
    }

    if (!jobDetails.companies || !jobDetails.accommodations) {
      throw new Error('Invalid response structure from Groq');
    }

    console.log(`✅ Successfully generated details for: ${normalizedName}`);

    res.status(200).json({
      success: true,
      roleName: normalizedName,
      companies: jobDetails.companies,
      accommodations: jobDetails.accommodations,
      industry: jobDetails.industry || 'General'
    });

  } catch (error) {
    console.error('Jobs endpoint error:', error.response?.data || error.message);

    if (error.message.includes('API key') || error.response?.status === 401) {
      return res.status(401).json({
        error: 'Groq API authentication failed',
        code: 'AUTH_ERROR'
      });
    }

    res.status(500).json({
      error: 'Failed to retrieve job details',
      code: 'JOB_LOOKUP_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/jobs - Dummy endpoint (deprecated)
router.get('/jobs', (req, res) => {
  res.status(200).json({
    success: true,
    totalRoles: 0,
    roles: []
  });
});

module.exports = router;