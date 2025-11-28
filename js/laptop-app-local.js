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
    this.init();
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
          
          if (voteCount >= participantCount) {
            clearInterval(voteCheckInterval);
            console.log('✓ All votes received!');
            setTimeout(() => this.showResults(), 1000);
          }
        }
      } catch (error) {
        console.error('Error checking votes:', error);
      }
    }, 1000);
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
  
  async startCountdown() {
    try {
      await fetch(`${API_URL}/start-countdown`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const countdownState = document.getElementById('laptop-countdown-state');
      if (countdownState) {
        countdownState.classList.remove('hidden');
        
        const questionEl = countdownState.querySelector('#countdown-question-display');
        if (questionEl && this.winningQuestion) {
          questionEl.textContent = this.winningQuestion.question;
        }
      }
      
      document.querySelectorAll('.laptop-state').forEach(el => {
        if (el.id !== 'laptop-countdown-state') {
          el.classList.add('hidden');
        }
      });
      
      let timeLeft = 60;
      const timerEl = document.getElementById('countdown-timer-laptop');
      
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
      
    } catch (error) {
      console.error('Error starting countdown:', error);
    }
  }
  
  async endRitual() {
    try {
      await fetch(`${API_URL}/end-ritual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      this.showGhostGone();
      setTimeout(() => this.handleResetClick(), 5000);
      
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
    const countdownState = document.getElementById('laptop-countdown-state');
    if (countdownState) {
      countdownState.classList.remove('hidden');
      
      const questionEl = countdownState.querySelector('#countdown-question-display');
      if (questionEl && data.winningQuestion) {
        questionEl.textContent = data.winningQuestion.question;
        this.winningQuestion = data.winningQuestion;
      }
    }
    
    if (data.countdownStart) {
      const elapsed = Math.floor((Date.now() - data.countdownStart) / 1000);
      let timeLeft = Math.max(0, 60 - elapsed);
      
      const timerEl = document.getElementById('countdown-timer-laptop');
      if (timerEl) {
        timerEl.textContent = timeLeft;
      }
      
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
