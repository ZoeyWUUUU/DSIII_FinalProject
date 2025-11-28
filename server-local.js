const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000; // Fixed port for local network

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Data file path
const DATA_FILE = path.join(__dirname, 'ritual-data.json');

// Initialize data structure
function initData() {
  return {
    questions: [],
    votes: {},
    state: 'waiting',
    participantCount: 0,
    submittedCount: 0
  };
}

// Load data from file
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return initData();
}

// Save data to file
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// API Routes
app.get('/api/state', (req, res) => {
  const data = loadData();
  res.json(data);
});

app.post('/api/question', (req, res) => {
  const { sender, question } = req.body;
  
  if (!sender || !question) {
    return res.status(400).json({ error: 'Sender and question are required' });
  }
  
  const data = loadData();
  
  if (data.questions.length >= 5) {
    return res.status(400).json({ error: 'Maximum 5 participants reached' });
  }
  
  if (data.questions.some(q => q.sender === sender)) {
    return res.status(400).json({ error: 'You have already submitted a question' });
  }
  
  const questionId = Date.now().toString();
  data.questions.push({
    id: questionId,
    sender,
    question,
    timestamp: Date.now()
  });
  
  data.submittedCount = data.questions.length;
  data.participantCount = data.questions.length;
  
  saveData(data);
  
  res.json({ success: true, questionId, totalQuestions: data.questions.length });
});

app.post('/api/start-voting', (req, res) => {
  const data = loadData();
  
  if (data.questions.length < 2) {
    return res.status(400).json({ error: 'Need at least 2 questions to start' });
  }
  
  data.state = 'voting';
  saveData(data);
  
  res.json({ success: true, message: 'Voting started' });
});

app.post('/api/vote', (req, res) => {
  const { sender, questionId } = req.body;
  
  if (!sender || !questionId) {
    return res.status(400).json({ error: 'Sender and questionId are required' });
  }
  
  const data = loadData();
  
  if (data.state !== 'voting') {
    return res.status(400).json({ error: 'Voting is not active' });
  }
  
  if (!data.questions.some(q => q.id === questionId)) {
    return res.status(400).json({ error: 'Question not found' });
  }
  
  data.votes[sender] = questionId;
  
  saveData(data);
  
  res.json({ success: true, message: 'Vote recorded' });
});

app.get('/api/results', (req, res) => {
  const data = loadData();
  
  const voteCounts = {};
  data.questions.forEach(q => {
    voteCounts[q.id] = 0;
  });
  
  Object.values(data.votes).forEach(questionId => {
    if (voteCounts[questionId] !== undefined) {
      voteCounts[questionId]++;
    }
  });
  
  let winningQuestion = null;
  let maxVotes = -1;
  
  data.questions.forEach(q => {
    const votes = voteCounts[q.id] || 0;
    if (votes > maxVotes) {
      maxVotes = votes;
      winningQuestion = { ...q, votes };
    }
  });
  
  res.json({
    voteCounts,
    winningQuestion,
    totalVotes: Object.keys(data.votes).length
  });
});

app.post('/api/start-countdown', (req, res) => {
  const data = loadData();
  
  const voteCounts = {};
  data.questions.forEach(q => {
    voteCounts[q.id] = 0;
  });
  
  Object.values(data.votes).forEach(questionId => {
    if (voteCounts[questionId] !== undefined) {
      voteCounts[questionId]++;
    }
  });
  
  let winningQuestion = null;
  let maxVotes = -1;
  
  data.questions.forEach(q => {
    const votes = voteCounts[q.id] || 0;
    if (votes > maxVotes) {
      maxVotes = votes;
      winningQuestion = q;
    }
  });
  
  data.state = 'countdown';
  data.countdownStart = Date.now();
  data.winningQuestion = winningQuestion;
  saveData(data);
  
  res.json({ success: true, message: 'Countdown started' });
});

app.post('/api/end-ritual', (req, res) => {
  const data = loadData();
  data.state = 'ended';
  saveData(data);
  
  res.json({ success: true, message: 'Ritual ended' });
});

app.post('/api/reset', (req, res) => {
  const data = initData();
  saveData(data);
  
  res.json({ success: true, message: 'Ritual reset' });
});

// Get local IP address
function getLocalIPAddress() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIPAddress();
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔥 Dead Internet Ritual - LOCAL NETWORK SERVER');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log(`✓ Server running on port ${PORT}`);
  console.log('');
  console.log('📱 MOBILE ACCESS (share with participants):');
  console.log(`   Local:   http://localhost:${PORT}/mobile-new.html`);
  console.log(`   Network: http://${localIP}:${PORT}/mobile-new.html`);
  console.log('');
  console.log('💻 LAPTOP DISPLAY (open on this computer):');
  console.log(`   http://localhost:${PORT}/laptop-new.html`);
  console.log('');
  console.log('📋 CREATE QR CODE:');
  console.log(`   URL: http://${localIP}:${PORT}/mobile-new.html`);
  console.log(`   Go to: https://www.qr-code-generator.com/`);
  console.log('');
  console.log('⚠️  IMPORTANT: All devices must be on the same WiFi network!');
  console.log('═══════════════════════════════════════════════════════════');
  
  // Always reset data on server startup
  saveData(initData());
  console.log('✓ Data reset on startup');
});
