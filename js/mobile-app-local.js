/* ═══════════════════════════════════════════════════════════════
   DEAD INTERNET RITUAL - MOBILE APP (LOCAL NETWORK VERSION)
   For use on local WiFi network only
   ═══════════════════════════════════════════════════════════════ */

// Auto-detect server address from current page URL
const API_URL = `http://${window.location.hostname}:3000/api`;

class MobileRitualApp {
  constructor() {
    this.userId = this.getOrCreateUserId();
    this.currentState = 'submit';
    this.pollInterval = null;
    
    console.log('📱 Mobile app initialized (Local Network Version)');
    console.log('User ID:', this.userId);
    
    this.init();
  }
  
  getOrCreateUserId() {
    let userId = localStorage.getItem('ritualUserId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('ritualUserId', userId);
    }
    return userId;
  }
  
  async init() {
    this.setupEventListeners();
    await this.checkState();
    this.startPolling();
  }
  
  setupEventListeners() {
    const questionForm = document.getElementById('question-form-new');
    if (questionForm) {
      questionForm.addEventListener('submit', (e) => this.handleQuestionSubmit(e));
    }
    
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('vote-button')) {
        const questionId = e.target.dataset.questionId;
        this.submitVote(questionId);
      }
    });
  }
  
  async handleQuestionSubmit(e) {
    e.preventDefault();
    
    const input = document.getElementById('question-input-new');
    const question = input.value.trim();
    
    if (!question) return;
    
    try {
      const response = await fetch(`${API_URL}/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: this.userId,
          question: question
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✓ Question submitted');
        input.value = '';
        await this.checkState();
      } else {
        alert(data.error || 'Failed to submit question');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Network error. Please try again.');
    }
  }
  
  async submitVote(questionId) {
    try {
      const response = await fetch(`${API_URL}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: this.userId,
          questionId: questionId
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✓ Vote submitted');
        await this.checkState();
      } else {
        alert(data.error || 'Failed to submit vote');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
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
    document.querySelectorAll('.mobile-state').forEach(el => {
      el.classList.add('hidden');
    });
    
    const userQuestion = data.questions.find(q => q.sender === this.userId);
    const hasVoted = data.votes && data.votes[this.userId];
    
    if (data.state === 'waiting' && !userQuestion) {
      this.showSubmitState(data);
    } else if (data.state === 'waiting' && userQuestion) {
      this.showWaitingState(data);
    } else if (data.state === 'voting' && !hasVoted) {
      this.showVotingState(data);
    } else if (data.state === 'voting' && hasVoted) {
      this.showVotedState(data);
    } else if (data.state === 'countdown') {
      this.showCountdownState(data);
    } else if (data.state === 'ended') {
      this.showEndedState();
    }
  }
  
  showSubmitState(data) {
    const submitState = document.getElementById('submit-state');
    if (submitState) {
      submitState.classList.remove('hidden');
      const countEl = submitState.querySelector('.participant-count');
      if (countEl) countEl.textContent = data.questions.length;
    }
  }
  
  showWaitingState(data) {
    const waitingState = document.getElementById('waiting-state');
    if (waitingState) {
      waitingState.classList.remove('hidden');
      const currentEl = waitingState.querySelector('.current-count');
      const totalEl = waitingState.querySelector('.total-count');
      if (currentEl) currentEl.textContent = data.questions.length;
      if (totalEl) totalEl.textContent = '2-5';
    }
  }
  
  showVotingState(data) {
    const votingState = document.getElementById('voting-state');
    if (votingState) {
      votingState.classList.remove('hidden');
      const container = votingState.querySelector('.questions-list');
      if (container) {
        container.innerHTML = '';
        data.questions.forEach(q => {
          const questionDiv = document.createElement('div');
          questionDiv.className = 'question-item';
          questionDiv.innerHTML = `
            <p class="question-text">${q.question}</p>
            <button class="vote-button" data-question-id="${q.id}">
              Vote for this question
            </button>
          `;
          container.appendChild(questionDiv);
        });
      }
    }
  }
  
  showVotedState(data) {
    const votedState = document.getElementById('voted-state');
    if (votedState) {
      votedState.classList.remove('hidden');
      const voteCountEl = votedState.querySelector('.vote-count');
      if (voteCountEl && data.votes) {
        voteCountEl.textContent = Object.keys(data.votes).length;
      }
    }
  }
  
  showCountdownState(data) {
    const countdownState = document.getElementById('countdown-state');
    if (countdownState) {
      countdownState.classList.remove('hidden');
    }
    document.querySelectorAll('.mobile-state').forEach(el => {
      if (el.id !== 'countdown-state') {
        el.classList.add('hidden');
      }
    });
  }
  
  showEndedState() {
    const endedState = document.getElementById('ended-state');
    if (endedState) {
      endedState.classList.remove('hidden');
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
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new MobileRitualApp();
  window.addEventListener('beforeunload', () => {
    app.cleanup();
  });
});
