/* ═══════════════════════════════════════════════════════════════
   DEAD INTERNET RITUAL - LAPTOP APP (LOCAL NETWORK VERSION)
   For use on local WiFi network only
   ═══════════════════════════════════════════════════════════════ */

// Auto-detect server address from current page URL
const API_URL = `http://${window.location.hostname}:3000/api`;

class LaptopRitualApp {
  constructor() {
    this.currentState = 'waiting';
    this.pollInterval = null;
    this.countdownInterval = null;
    this.winningQuestion = null;
    
    console.log('💻 Laptop app initialized (Local Network Version)');
    this.initMatrixRain();
    this.init();
  }
  
  initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height / fontSize;
    }
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0f0';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    setInterval(draw, 33);
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }
  
  async init() {
    this.setupEventListeners();
    await this.checkState();
    this.startPolling();
  }
  
  setupEventListeners() {
    const summonBtn = document.getElementById('summon-ghost-btn');
    if (summonBtn) {
      summonBtn.addEventListener('click', () => this.handleSummonClick());
    }
    
    const resetBtn = document.getElementById('reset-ritual-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.handleResetClick());
    }
  }
  
  async handleSummonClick() {
    console.log('Summoning ghost...');
    this.showOneQuestionMessage();
    
    setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/start-voting`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          console.log('✓ Voting started');
          // Stop general polling during vote monitoring
          if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
          }
          await this.checkState();
          this.startVoteMonitoring();
        }
      } catch (error) {
        console.error('Error starting voting:', error);
      }
    }, 3000);
  }
  
  startVoteMonitoring() {
    const voteCheckInterval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/state`);
        const data = await response.json();
        
        if (data.state === 'voting' && data.votes) {
          const voteCount = Object.keys(data.votes).length;
          const participantCount = data.questions.length;
          
          console.log(`Votes: ${voteCount}/${participantCount}`);
          
          // Update vote count display
          this.showVotingState(data);
          
          if (voteCount >= participantCount) {
            clearInterval(voteCheckInterval);
            console.log('✓ All votes received! Transitioning to results...');
            // Immediate transition to results - DON'T restart polling yet
            await this.showResults();
          }
        } else if (data.state !== 'voting') {
          clearInterval(voteCheckInterval);
          console.log('Voting ended, clearing interval');
        }
      } catch (error) {
        console.error('Error checking votes:', error);
      }
    }, 500);
  }
  
  async showResults() {
    try {
      const response = await fetch(`${API_URL}/results`);
      const data = await response.json();
      
      if (data.winningQuestion) {
        this.displayWinningQuestion(data.winningQuestion);
        setTimeout(() => this.startCountdown(), 3000);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  }
  
  displayWinningQuestion(question) {
    this.winningQuestion = question;
    
    const resultState = document.getElementById('result-state');
    if (resultState) {
      resultState.classList.remove('hidden');
      const questionEl = resultState.querySelector('.winning-question-display');
      if (questionEl) {
        questionEl.textContent = question.question;
      }
    }
    
    document.querySelectorAll('.laptop-state').forEach(el => {
      if (el.id !== 'result-state') {
        el.classList.add('hidden');
      }
    });
  }
  
  startSacrificeCountdown() {
    const sacrificeState = document.getElementById('sacrifice-state');
    if (sacrificeState) {
      sacrificeState.classList.remove('hidden');
      
      const questionEl = document.getElementById('sacrifice-question-display');
      if (questionEl && this.winningQuestion) {
        questionEl.textContent = this.winningQuestion.question;
      }
    }
    
    document.querySelectorAll('.laptop-state').forEach(el => {
      if (el.id !== 'sacrifice-state') {
        el.classList.add('hidden');
      }
    });
    
    let timeLeft = 10;
    const timerEl = document.getElementById('sacrifice-timer');
    
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    this.countdownInterval = setInterval(() => {
      timeLeft--;
      if (timerEl) {
        timerEl.textContent = timeLeft;
      }
      
      if (timeLeft <= 0) {
        clearInterval(this.countdownInterval);
        this.startPaymentCountdown();
      }
    }, 1000);
  }
  
  startPaymentCountdown() {
    const paymentState = document.getElementById('payment-state');
    if (paymentState) {
      paymentState.classList.remove('hidden');
      
      const questionEl = document.getElementById('payment-question-display');
      if (questionEl && this.winningQuestion) {
        questionEl.textContent = this.winningQuestion.question;
      }
    }
    
    document.querySelectorAll('.laptop-state').forEach(el => {
      if (el.id !== 'payment-state') {
        el.classList.add('hidden');
      }
    });
    
    let timeLeft = 30;
    const timerEl = document.getElementById('payment-timer');
    
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    this.countdownInterval = setInterval(async () => {
      timeLeft--;
      if (timerEl) {
        timerEl.textContent = timeLeft;
      }
      
      if (timeLeft <= 0) {
        clearInterval(this.countdownInterval);
        await this.endRitual();
      }
    }, 1000);
  }
  
  async startCountdown() {
    try {
      // Stop polling during countdown to prevent interference
      if (this.pollInterval) {
        clearInterval(this.pollInterval);
        this.pollInterval = null;
        console.log('✓ Polling stopped for countdown');
      }
      
      // Update server state to countdown
      await fetch(`${API_URL}/start-countdown`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('✓ Server state updated to countdown');
      this.startSacrificeCountdown();
    } catch (error) {
      console.error('Error updating server state:', error);
      // Still proceed with countdown even if server update fails
      this.startSacrificeCountdown();
    }
  }
  
  async endRitual() {
    try {
      await fetch(`${API_URL}/end-ritual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      this.showGhostGone();
      
      // Restart polling after ritual ends
      if (!this.pollInterval) {
        this.startPolling();
        console.log('✓ Polling restarted after ritual end');
      }
      
      setTimeout(() => this.handleResetClick(), 3000);
      
    } catch (error) {
      console.error('Error ending ritual:', error);
    }
  }
  
  showGhostGone() {
    const goneState = document.getElementById('ghost-gone-state');
    if (goneState) {
      goneState.classList.remove('hidden');
    }
    
    document.querySelectorAll('.laptop-state').forEach(el => {
      if (el.id !== 'ghost-gone-state') {
        el.classList.add('hidden');
      }
    });
  }
  
  async handleResetClick() {
    try {
      const response = await fetch(`${API_URL}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log('✓ Ritual reset');
        
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }
        
        await this.checkState();
      }
    } catch (error) {
      console.error('Error resetting ritual:', error);
    }
  }
  
  showOneQuestionMessage() {
    const messageState = document.getElementById('one-question-state');
    if (messageState) {
      messageState.classList.remove('hidden');
    }
    
    document.querySelectorAll('.laptop-state').forEach(el => {
      if (el.id !== 'one-question-state') {
        el.classList.add('hidden');
      }
    });
  }
  
  async checkState() {
    try {
      const response = await fetch(`${API_URL}/state`);
      const data = await response.json();
      this.updateUI(data);
    } catch (error) {
      console.error('Error checking state:', error);
    }
  }
  
  updateUI(data) {
    document.querySelectorAll('.laptop-state').forEach(el => {
      el.classList.add('hidden');
    });
    
    if (data.state === 'waiting') {
      this.showWaitingState(data);
    } else if (data.state === 'voting') {
      this.showVotingState(data);
    } else if (data.state === 'countdown') {
      this.resumeCountdown(data);
    } else if (data.state === 'ended') {
      this.showGhostGone();
    }
  }
  
  resumeCountdown(data) {
    // Only start countdown if not already running
    if (this.countdownInterval) {
      console.log('Countdown already running, skipping restart');
      return;
    }
    
    if (data.winningQuestion) {
      this.winningQuestion = data.winningQuestion;
    }
    
    this.startSacrificeCountdown();
  }
  
  showWaitingState(data) {
    const waitingState = document.getElementById('laptop-waiting-state');
    if (waitingState) {
      waitingState.classList.remove('hidden');
      
      const countEl = waitingState.querySelector('.laptop-participant-count');
      if (countEl) {
        countEl.textContent = data.questions.length;
      }
      
      const summonBtn = document.getElementById('summon-ghost-btn');
      if (summonBtn) {
        if (data.questions.length >= 2) {
          summonBtn.classList.remove('hidden');
        } else {
          summonBtn.classList.add('hidden');
        }
      }
    }
  }
  
  showVotingState(data) {
    const votingState = document.getElementById('laptop-voting-state');
    if (votingState) {
      votingState.classList.remove('hidden');
      
      const voteCountEl = votingState.querySelector('.laptop-vote-count');
      if (voteCountEl && data.votes) {
        voteCountEl.textContent = `${Object.keys(data.votes).length} / ${data.questions.length}`;
      }
    }
  }
  
  startPolling() {
    this.pollInterval = setInterval(() => {
      this.checkState();
    }, 2000);
  }
  
  cleanup() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new LaptopRitualApp();
  window.addEventListener('beforeunload', () => {
    app.cleanup();
  });
});
