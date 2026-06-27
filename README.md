# Equal Opportunity Career Coach

An AI-powered career advisor for neurodivergent high school students. Uses Groq API to analyze student profiles and recommend careers where their neurodivergence is an **advantage**, not a limitation.

## 🎯 What It Does

1. **Student takes quiz** - Shares their neurodivergence type and interests
2. **AI analyzes** - Groq API analyzes their profile
3. **Gets recommendations** - 5 specific career roles with:
   - Match percentage
   - Salary range
   - Personalized explanation of why it's perfect for them
   - Companies that hire for that role
   - Accommodations those companies provide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (https://nodejs.org)
- Groq API key (https://console.groq.com/keys)
- npm (comes with Node.js)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
GROQ_API_KEY=your_actual_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF

# Start the server
npm start

# Should see: ✅ Server running on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Create .env.local file
cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF

# Start the development server
npm start

# Opens in browser at http://localhost:3000
```

## 🏗️ Project Structure

```
career-coach/
├── backend/
│   ├── server.js           # Main Express app
│   ├── .env               # Environment variables
│   ├── routes/
│   │   ├── quiz.js        # Quiz submission endpoint
│   │   ├── analyze.js     # Groq AI analysis
│   │   └── jobs.js        # Company/accommodation lookup
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── QuizForm.js       # Quiz form
    │   │   └── ResultsDisplay.js # Results display
    │   ├── App.js           # Main app logic
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── tailwind.config.js
    └── package.json
```

## 🔌 API Endpoints

### POST `/api/quiz`
Submit quiz answers

**Request:**
```json
{
  "neurodivergence": "autism|adhd|dyslexia|other",
  "interests": ["interest1", "interest2", "interest3"]
}
```

**Response:**
```json
{
  "success": true,
  "studentId": "student_xxxxx",
  "data": { ... }
}
```

### POST `/api/analyze`
Analyze student profile and get recommendations

**Request:**
```json
{
  "studentId": "student_xxxxx",
  "neurodivergence": "autism",
  "interests": ["coding", "design", "gaming"]
}
```

**Response:**
```json
{
  "success": true,
  "roles": [
    {
      "name": "UX/UI Designer",
      "matchPercentage": 95,
      "salaryRange": "$60,000-$100,000",
      "quote": "Your attention to detail...",
      "industry": "Tech"
    },
    ...5 total roles
  ]
}
```

### GET `/api/jobs/:roleName`
Get companies and accommodations for a role

**Request:**
```
GET /api/jobs/UX%20Designer
```

**Response:**
```json
{
  "success": true,
  "roleName": "UX/UI Designer",
  "companies": ["Google", "Apple", "Microsoft", ...],
  "accommodations": ["Quiet focus spaces", "Flexible hours", ...],
  "industry": "Tech"
}
```

## 🧪 Testing the API

### Test with curl

```bash
# Test quiz endpoint
curl -X POST http://localhost:5000/api/quiz \
  -H "Content-Type: application/json" \
  -d '{"neurodivergence":"autism","interests":["coding","design","gaming"]}'

# Test analyze endpoint
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"neurodivergence":"adhd","interests":["tech","music","sports"]}'

# Test jobs endpoint
curl http://localhost:5000/api/jobs/Software%20Developer
```

## 🎨 Frontend Features

- ✅ Beautiful Tailwind CSS design
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Accessible (WCAG compliant)
- ✅ Smooth animations

## 🤖 How Groq API Works

The app calls Groq API with a detailed prompt:

```
"A high school student with [NEURODIVERGENCE] is interested in [INTERESTS].
Recommend 5 career roles where their neurodivergence is an ADVANTAGE..."
```

Groq analyzes and returns personalized recommendations with:
- Career roles matched to their profile
- Why each role is perfect for them
- How their neurodivergence is an actual strength
- Realistic salary expectations

## 🌍 Deployment

### Deploy Backend (Render)

1. Push to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Select your GitHub repo
5. Set environment variables:
   - `GROQ_API_KEY`: Your API key
   - `NODE_ENV`: production
6. Deploy

Backend will be at: `https://your-app.onrender.com`

### Deploy Frontend (Vercel)

1. Go to https://vercel.com
2. Import GitHub repo
3. Select `frontend` directory
4. Add environment variable:
   - `REACT_APP_API_URL`: Your backend URL
5. Deploy

Frontend will be at: `https://your-app.vercel.app`

## 🔐 Environment Variables

**Backend (.env):**
```
GROQ_API_KEY=gsk_...               # Your Groq API key
PORT=5000                          # Server port
NODE_ENV=development               # development or production
FRONTEND_URL=http://localhost:3000 # Frontend URL for CORS
```

**Frontend (.env.local):**
```
REACT_APP_API_URL=http://localhost:5000/api  # Backend API URL
```

## 📊 Career Data

The app includes 20 pre-loaded careers covering:
- Tech (UX Designer, Developer, Data Analyst, etc.)
- Writing (Content Writer, Technical Writer)
- Design (Graphic Designer)
- Media (Video Editor, Audio Engineer)
- Operations & more

Each career has:
- ✅ Companies that hire for it
- ✅ Accommodations they provide
- ✅ Industry classification

Add more careers in `backend/routes/jobs.js`

## 🐛 Troubleshooting

### "CORS error" or "Failed to fetch"
- Make sure backend is running (`npm start`)
- Check frontend `.env.local` has correct API URL
- Check backend `.env` has correct FRONTEND_URL

### "API key not found"
- Backend `.env` has `GROQ_API_KEY` set
- Key is not expired or invalid
- Check for typos

### "Can't connect to server"
- Backend is running on port 5000
- No firewall blocking the port
- Check `npm start` output for errors

### "Build fails"
- Run `npm install` in frontend directory
- Check for console errors with `npm start`
- Make sure Node.js version is 16+

## 📝 License

MIT

## 👥 Contributing

This is a hackathon project. Improvements welcome!

## 📧 Questions?

Check the deployment guide for more details on getting this live for judges to try!