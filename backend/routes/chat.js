// backend/routes/chat.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST /api/chat - AI Career Mentor Chat
router.post('/chat', async (req, res) => {
  try {
    const { question, analysisData, selectedCareer } = req.body;

    if (!question || !analysisData || !selectedCareer) {
      return res.status(400).json({
        error: 'question and analysisData are required',
        code: 'INVALID_INPUT'
      });
    }

    console.log(`💬 Chat request received: "${question.substring(0, 50)}..."`);

    // Create system prompt using analysisData
    const systemPrompt = `You are an expert career counselor for neurodivergent students.
You have already analyzed this student.

Student Profile:
Neurodivergence: ${analysisData.neurodivergence}
Interests: ${analysisData.interests?.join(', ')}

The student has selected to explore the following career:
${selectedCareer}

Answer ONLY about this career.
Do not discuss the other recommended careers unless explicitly asked.
Be encouraging, practical, and specific.

CRITICAL FORMATTING RULES:
1. Maximum 100 words.
2. No long paragraphs.
3. Use markdown headings (##, ###).
4. Use standard markdown bullet points (*).
5. Use short sections.
6. Never return large essays.

RESPONSE TEMPLATE:
## 🎯 Best Option

### Why
* Point 1
* Point 2

### Skills Needed
* Skill 1
* Skill 2

### Next Step
* Action item`;

    // Call Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: question
          }
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data.choices[0].message.content;
    console.log('📝 Groq chat response received');

    res.status(200).json({
      success: true,
      answer: aiMessage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error.response?.data || error.message);

    if (error.message.includes('API key') || error.response?.status === 401) {
      return res.status(401).json({
        error: 'Groq API authentication failed',
        code: 'AUTH_ERROR'
      });
    }

    res.status(500).json({
      error: 'Failed to generate chat response',
      code: 'CHAT_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
