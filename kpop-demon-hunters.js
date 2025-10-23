// K-pop Demon Hunters Memory Game JavaScript

// Game state
let gameState = {
  currentPlayer: null,
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  moves: 0,
  score: 0,
  timer: 0,
  timerInterval: null,
  gameStarted: false,
  soundEnabled: true,
  currentLanguage: 'en' // Default language is English
};

// Firebase real-time listener
let leaderboardListener = null;

// K-pop Demon Hunters data with fun facts
const kpopDemonHunters = [
  {
    name: 'Rumi',
    image: 'rumi.jpg',
    category: 'idol',
    fact: {
      en: 'Rumi is the lead vocalist with an amazing voice! She can hit the highest notes and inspire her team with powerful ballads.',
      es: 'Rumi es la vocalista principal con una voz increíble! Puede alcanzar las notas más altas e inspirar a su equipo con baladas poderosas.'
    }
  },
  {
    name: 'Zoey',
    image: 'zoey.jpg',
    category: 'idol',
    fact: {
      en: 'Zoey is the rapper and songwriter! She writes the most amazing lyrics that tell stories of friendship and dreams.',
      es: 'Zoey es la rapera y compositora! Escribe las letras más increíbles que cuentan historias de amistad y sueños.'
    }
  },
  {
    name: 'Mira',
    image: 'mira.jpg',
    category: 'idol',
    fact: {
      en: 'Mira is the main dancer of the group! Her incredible choreography and moves can mesmerize any audience.',
      es: 'Mira es la bailarina principal del grupo! Su increíble coreografía y movimientos pueden hipnotizar a cualquier audiencia.'
    }
  },
  {
    name: 'Baby Saja',
    image: 'baby-saja.jpg',
    category: 'idol',
    fact: {
      en: 'Baby Saja is the youngest member and visual of the group! Her cute charm and innocent smile wins everyone\'s heart.',
      es: 'Baby Saja es la miembro más joven y visual del grupo! Su encanto tierno y sonrisa inocente conquista el corazón de todos.'
    }
  },
  {
    name: 'Jinu',
    image: 'jinu.jpg',
    category: 'idol',
    fact: {
      en: 'Jinu is the leader and all-rounder! He can sing, dance, rap, and always takes care of his group members.',
      es: 'Jinu es el líder y todoterreno! Puede cantar, bailar, rapear, y siempre cuida de los miembros de su grupo.'
    }
  },
  {
    name: 'Abby',
    image: 'abby.jpg',
    category: 'idol',
    fact: {
      en: 'Abby is the sub-vocalist and face of the group! Her sweet voice and beautiful visuals make her a perfect idol.',
      es: 'Abby es la sub-vocalista y cara del grupo! Su voz dulce y hermosos visuales la convierten en la ídol perfecta.'
    }
  },
  {
    name: 'Mistery',
    image: 'mistery.jpg',
    category: 'idol',
    fact: {
      en: 'Mistery is the mysterious member who adds intrigue to the group! She has hidden talents that surprise everyone.',
      es: 'Mistery es la miembro misteriosa que añade intriga al grupo! Tiene talentos ocultos que sorprenden a todos.'
    }
  },
  {
    name: 'Romance',
    image: 'romance.jpg',
    category: 'idol',
    fact: {
      en: 'Romance is the romantic ballad specialist! Her emotional performances can make anyone fall in love with K-pop music.',
      es: 'Romance es la especialista en baladas románticas! Sus actuaciones emocionales pueden hacer que cualquiera se enamore de la música K-pop.'
    }
  }
];

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeGame();
});

// Clean up Firebase listener when page is closed
window.addEventListener('beforeunload', function() {
  if (leaderboardListener) {
    leaderboardListener();
    leaderboardListener = null;
  }
});

function initializeGame() {
  // Get player info from sessionStorage (set by game center)
  const storedPlayer = sessionStorage.getItem('gameCenter_currentPlayer');
  
  if (storedPlayer) {
    gameState.currentPlayer = JSON.parse(storedPlayer);
    setupPlayerInfo();
    startNewGame();
  } else {
    // If no player info, redirect to game center
    window.location.href = 'homegames.html';
  }
  
  // Set up Firebase real-time listener for leaderboard changes
  setupFirebaseListener();
}

function setupFirebaseListener() {
  // Clean up existing listener
  if (leaderboardListener) {
    leaderboardListener();
    leaderboardListener = null;
  }
  
  // Set up new listener if Firebase is available
  if (window.firebaseDB && window.firebaseOnSnapshot) {
    try {
      const q = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, 'kpop-demon-huntersScores'),
        window.firebaseOrderBy('score', 'desc'),
        window.firebaseLimit(20)
      );
      
      leaderboardListener = window.firebaseOnSnapshot(q, (snapshot) => {
        console.log('Firebase K-pop leaderboard changed:', snapshot.docs.length, 'scores');
        
        // If we're currently viewing the leaderboard, refresh it
        const leaderboardSection = document.getElementById('leaderboard-section');
        if (!leaderboardSection.classList.contains('hidden')) {
          console.log('Auto-refreshing K-pop leaderboard due to Firebase changes');
          showLeaderboard();
        }
        
        // If Firebase is empty, clear local storage on all devices
        if (snapshot.docs.length === 0) {
          const localScores = JSON.parse(localStorage.getItem('kpop-demon-huntersScores') || '[]');
          if (localScores.length > 0) {
            console.log('Firebase K-pop scores empty - clearing local scores for consistency');
            localStorage.removeItem('kpop-demon-huntersScores');
            
            // Show notification if leaderboard is visible
            if (!leaderboardSection.classList.contains('hidden')) {
              showLeaderboardResetNotification();
            }
          }
        }
      }, (error) => {
        console.log('Firebase listener error:', error);
      });
      
      console.log('Firebase K-pop real-time listener established');
    } catch (error) {
      console.log('Could not set up Firebase listener:', error);
    }
  }
}

function setupPlayerInfo() {
  const playerInfo = document.querySelector('.player-info');
  const playerAvatar = document.getElementById('player-avatar');
  const playerName = document.getElementById('player-name');
  
  playerAvatar.src = `images/${gameState.currentPlayer.photo}`;
  playerAvatar.alt = gameState.currentPlayer.displayName;
  playerName.textContent = gameState.currentPlayer.displayName;
  
  // Show player info
  playerInfo.classList.add('logged-in');
  
  // Show/hide admin button based on user
  toggleAdminButton();
}

function toggleAdminButton() {
  const adminBtn = document.querySelector('.admin-btn');
  const currentUser = gameState.currentPlayer?.name?.toLowerCase();
  
  if (adminBtn) {
    if (currentUser === 'nemiroff') {
      adminBtn.style.display = 'inline-block';
    } else {
      adminBtn.style.display = 'none';
    }
  }
}

function startNewGame() {
  // Reset game state
  gameState.flippedCards = [];
  gameState.matchedPairs = 0;
  gameState.moves = 0;
  gameState.score = 0;
  gameState.timer = 0;
  gameState.gameStarted = false;
  
  // Clear timer
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }
  
  // Update UI
  updateScore();
  updateMoves();
  updateTimer();
  
  // Create cards
  createCards();
  
  // Hide success modal
  hideModal();
  
  // Show game section
  showSection('game-section');
}

function createCards() {
  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  
  // Use all 8 K-pop demon hunters for 16 cards (8 pairs)
  const selectedItems = [...kpopDemonHunters];
  
  // Create pairs
  const cardData = [...selectedItems, ...selectedItems];
  gameState.cards = shuffleArray(cardData.map((item, index) => ({
    id: index,
    ...item,
    matched: false
  })));
  
  // Create card elements
  gameState.cards.forEach((card, index) => {
    const cardElement = createCardElement(card, index);
    grid.appendChild(cardElement);
  });
}

function createCardElement(card, index) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'memory-card';
  cardDiv.dataset.index = index;
  
  cardDiv.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        🎵
      </div>
      <div class="card-back">
        <img src="images/kpop-demon-hunters/${card.image}" alt="${card.name}" class="card-image" onerror="this.src='images/icono.png'">
        <div class="card-name">${card.name}</div>
      </div>
    </div>
  `;
  
  cardDiv.addEventListener('click', () => flipCard(index));
  
  return cardDiv;
}

function flipCard(index) {
  // Start timer on first move
  if (!gameState.gameStarted) {
    startTimer();
    gameState.gameStarted = true;
  }
  
  const card = gameState.cards[index];
  const cardElement = document.querySelector(`[data-index="${index}"]`);
  
  // Can't flip if card is already flipped or matched
  if (card.matched || gameState.flippedCards.includes(index) || gameState.flippedCards.length >= 2) {
    return;
  }
  
  // Flip the card
  cardElement.classList.add('flipped');
  gameState.flippedCards.push(index);
  
  // Play flip sound
  playSound('flip');
  
  // Check for match if two cards are flipped
  if (gameState.flippedCards.length === 2) {
    gameState.moves++;
    updateMoves();
    
    setTimeout(() => {
      checkMatch();
    }, 1000);
  }
}

function checkMatch() {
  const [index1, index2] = gameState.flippedCards;
  const card1 = gameState.cards[index1];
  const card2 = gameState.cards[index2];
  
  if (card1.name === card2.name) {
    // Match found!
    card1.matched = true;
    card2.matched = true;
    gameState.matchedPairs++;
    
    // Update card appearance
    const cardElement1 = document.querySelector(`[data-index="${index1}"]`);
    const cardElement2 = document.querySelector(`[data-index="${index2}"]`);
    cardElement1.classList.add('matched');
    cardElement2.classList.add('matched');
    
    // Calculate score
    const timeBonus = Math.max(100 - gameState.timer, 10);
    const moveBonus = Math.max(50 - gameState.moves, 10);
    gameState.score += 100 + timeBonus + moveBonus;
    updateScore();
    
    // Play success sound
    playSound('success');
    
    // Create confetti for each match! 🎉
    createMatchConfetti();
    
    // Show fun fact
    showFact(card1);
    
    // Check if game is complete
    if (gameState.matchedPairs === 8) {
      setTimeout(() => {
        completeGame();
      }, 2000);
    }
    
  } else {
    // No match - flip cards back
    setTimeout(() => {
      const cardElement1 = document.querySelector(`[data-index="${index1}"]`);
      const cardElement2 = document.querySelector(`[data-index="${index2}"]`);
      cardElement1.classList.remove('flipped');
      cardElement2.classList.remove('flipped');
      
      // Play error sound
      playSound('error');
    }, 500);
  }
  
  // Reset flipped cards
  gameState.flippedCards = [];
}

function showFact(card) {
  const factDisplay = document.getElementById('fact-display');
  const factTitle = document.getElementById('fact-title');
  const factText = document.getElementById('fact-text');
  
  // Set the title based on current language
  const profileText = gameState.currentLanguage === 'en' ? 'Profile!' : 'Perfil!';
  factTitle.innerHTML = `
    ${card.name} ${profileText} 🌟
    <button onclick="toggleLanguage('${card.name}')" class="language-btn" title="Change language">
      <img src="icon/${gameState.currentLanguage === 'en' ? 'iconES.png' : 'iconEN.png'}" alt="${gameState.currentLanguage === 'en' ? 'ES' : 'EN'}" style="width: 24px; height: 24px;">
    </button>
  `;
  
  // Set the fact text based on current language
  factText.textContent = card.fact[gameState.currentLanguage];
  
  factDisplay.classList.remove('hidden');
}

function toggleLanguage(cardName) {
  // Toggle between English and Spanish
  gameState.currentLanguage = gameState.currentLanguage === 'en' ? 'es' : 'en';
  
  // Find the card and refresh the fact display
  const card = kpopDemonHunters.find(c => c.name === cardName);
  if (card) {
    showFact(card);
  }
}

function closeFact() {
  document.getElementById('fact-display').classList.add('hidden');
}

function completeGame() {
  // Stop timer
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }
  
  // Save score to leaderboard
  saveScore();
  
  // Show success modal
  const finalStats = document.getElementById('final-stats');
  finalStats.innerHTML = `
    <div style="font-size: 1.2rem; margin-bottom: 1rem;">
      🎉 Amazing Performance, ${gameState.currentPlayer.displayName}! 🎉
    </div>
    <div style="margin-bottom: 0.5rem;">You've matched all the K-pop idols perfectly! 🌟🎵</div>
    <div><strong>Final Score:</strong> ${gameState.score} points</div>
    <div><strong>Time:</strong> ${formatTime(gameState.timer)}</div>
    <div><strong>Moves:</strong> ${gameState.moves}</div>
  `;
  
  document.getElementById('success-modal').classList.remove('hidden');
  
  // Play celebration sound
  playSound('celebration');
  
  // Add confetti effect
  createConfetti();
}

async function saveScore() {
  const newScore = {
    name: gameState.currentPlayer.displayName,
    photo: gameState.currentPlayer.photo,
    score: gameState.score,
    time: gameState.timer,
    moves: gameState.moves,
    date: new Date().toISOString(),
    timestamp: Date.now()
  };
  
  try {
    // Save to Firebase if available
    if (window.firebaseDB) {
      await window.firebaseAddDoc(window.firebaseCollection(window.firebaseDB, 'kpop-demon-huntersScores'), newScore);
      console.log('K-pop score saved to Firebase successfully!');
    }
  } catch (error) {
    console.log('Firebase not available, saving locally:', error.message);
  }
  
  // Always save locally as backup
  const localScores = JSON.parse(localStorage.getItem('kpop-demon-huntersScores') || '[]');
  localScores.push(newScore);
  localScores.sort((a, b) => b.score - a.score);
  localScores.splice(20);
  localStorage.setItem('kpop-demon-huntersScores', JSON.stringify(localScores));
}

async function showLeaderboard() {
  // Close any open modal first
  hideModal();
  
  const leaderboardList = document.getElementById('leaderboard-list');
  
  // Show loading message
  leaderboardList.innerHTML = '<div style="text-align: center; color: #666;">🔄 Loading leaderboard...</div>';
  
  let scores = [];
  let firebaseAvailable = false;
  let firebaseHasScores = false;
  
  try {
    // Try to get scores from Firebase first
    if (window.firebaseDB) {
      firebaseAvailable = true;
      const q = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, 'kpop-demon-huntersScores'),
        window.firebaseOrderBy('score', 'desc'),
        window.firebaseLimit(20)
      );
      const querySnapshot = await window.firebaseGetDocs(q);
      scores = querySnapshot.docs.map(doc => doc.data());
      firebaseHasScores = scores.length > 0;
      console.log('Loaded K-pop scores from Firebase:', scores.length);
    }
  } catch (error) {
    console.log('Firebase not available, using local scores:', error.message);
    firebaseAvailable = false;
  }
  
  // Only use local scores if Firebase is not available at all
  if (!firebaseAvailable && scores.length === 0) {
    scores = JSON.parse(localStorage.getItem('kpop-demon-huntersScores') || '[]');
    console.log('Using local K-pop scores (Firebase unavailable):', scores.length);
  } else if (firebaseAvailable && !firebaseHasScores) {
    scores = [];
    console.log('Firebase K-pop scores empty - showing empty leaderboard');
  }
  
  // Remove duplicate users - keep only highest score per user
  const uniqueScores = [];
  const seenUsers = new Set();
  
  scores.forEach(score => {
    if (!seenUsers.has(score.name.toLowerCase())) {
      seenUsers.add(score.name.toLowerCase());
      uniqueScores.push(score);
    }
  });
  
  scores = uniqueScores;
  
  if (scores.length === 0) {
    leaderboardList.innerHTML = '<div style="text-align: center; color: #666;">No demon hunters yet! Be the first to save the world! 🌟</div>';
  } else {
    leaderboardList.innerHTML = '';
    
    // Add header to show if data is from cloud or local
    const sourceInfo = document.createElement('div');
    sourceInfo.style.textAlign = 'center';
    sourceInfo.style.fontSize = '0.8rem';
    sourceInfo.style.color = '#888';
    sourceInfo.style.marginBottom = '1rem';
    
    if (firebaseAvailable) {
      sourceInfo.innerHTML = '☁️ Global Demon Hunters Leaderboard';
    } else {
      sourceInfo.innerHTML = '💾 Local Demon Hunters (This Device Only)';
    }
    
    leaderboardList.appendChild(sourceInfo);
    
    scores.forEach((score, index) => {
      const item = document.createElement('div');
      item.className = 'leaderboard-item';
      
      const rankClass = index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : '';
      const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      
      item.innerHTML = `
        <div class="leaderboard-rank ${rankClass}">${rankEmoji}</div>
        <img src="images/${score.photo}" alt="${score.name}" class="leaderboard-avatar" onerror="this.src='images/icono.png'">
        <div class="leaderboard-info">
          <div class="leaderboard-name">${score.name}</div>
          <div class="leaderboard-stats">${formatTime(score.time)} • ${score.moves} moves</div>
        </div>
        <div class="leaderboard-score">${score.score}</div>
      `;
      
      leaderboardList.appendChild(item);
    });
  }
  
  // Control admin button visibility when showing leaderboard
  toggleAdminButton();
  
  showSection('leaderboard-section');
}

function backToGame() {
  showSection('game-section');
}

function backToHome() {
  window.location.href = 'game-selection.html';
}

function startTimer() {
  gameState.timerInterval = setInterval(() => {
    gameState.timer++;
    updateTimer();
  }, 1000);
}

function updateScore() {
  document.getElementById('score').textContent = gameState.score;
}

function updateMoves() {
  document.getElementById('moves').textContent = gameState.moves;
}

function updateTimer() {
  document.getElementById('timer').textContent = formatTime(gameState.timer);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function toggleMute() {
  gameState.soundEnabled = !gameState.soundEnabled;
  const soundIcon = document.getElementById('sound-icon');
  soundIcon.textContent = gameState.soundEnabled ? '🔊' : '🔇';
}

function logout() {
  // Confirm logout
  if (confirm('¿Estás seguro de que quieres cerrar sesión? Otro usuario podrá iniciar sesión.')) {
    // Clear session storage
    sessionStorage.removeItem('gameCenter_currentPlayer');
    
    // Redirect to login page
    window.location.href = 'homegames.html';
  }
}

function playSound(type) {
  if (!gameState.soundEnabled) return;
  
  // Create audio context for sound effects
  if (window.AudioContext || window.webkitAudioContext) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const frequencies = {
      flip: 440,
      success: 523,
      error: 294,
      celebration: [523, 659, 784, 1047]
    };
    
    if (type === 'celebration') {
      // Play a sequence of notes
      frequencies.celebration.forEach((freq, index) => {
        setTimeout(() => {
          playTone(audioContext, freq, 0.2);
        }, index * 100);
      });
    } else {
      playTone(audioContext, frequencies[type], 0.1);
    }
  }
}

function playTone(audioContext, frequency, duration) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function createMatchConfetti() {
  const colors = ['#FF6B35', '#C2185B', '#E91E63', '#F8BBD9', '#FFE8F5', '#E1BEE7'];
  
  // Smaller confetti burst for each match
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.width = '8px';
      confetti.style.height = '8px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '9999';
      confetti.style.borderRadius = '50%';
      
      document.body.appendChild(confetti);
      
      const animation = confetti.animate([
        { transform: 'translateY(-10px) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 20}px) rotate(360deg)`, opacity: 0 }
      ], {
        duration: 2000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });
      
      animation.onfinish = () => {
        if (document.body.contains(confetti)) {
          document.body.removeChild(confetti);
        }
      };
    }, Math.random() * 500);
  }
}

function createConfetti() {
  const colors = ['#FF6B35', '#C2185B', '#E91E63', '#F8BBD9', '#FFE8F5', '#E1BEE7'];
  
  // Big celebration confetti for game completion
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '9999';
      confetti.style.borderRadius = '50%';
      
      document.body.appendChild(confetti);
      
      const animation = confetti.animate([
        { transform: 'translateY(-10px) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 20}px) rotate(720deg)`, opacity: 0 }
      ], {
        duration: 3000 + Math.random() * 2000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });
      
      animation.onfinish = () => {
        if (document.body.contains(confetti)) {
          document.body.removeChild(confetti);
        }
      };
    }, Math.random() * 3000);
  }
}

function hideModal() {
  document.getElementById('success-modal').classList.add('hidden');
  document.getElementById('fact-display').classList.add('hidden');
}

function showResetModal() {
  const modal = document.getElementById('reset-modal');
  const passwordInput = document.getElementById('reset-password');
  const errorDiv = document.getElementById('password-error');
  
  modal.classList.remove('hidden');
  passwordInput.value = '';
  errorDiv.style.display = 'none';
  
  // Focus on password input and add enter key listener
  setTimeout(() => {
    passwordInput.focus();
  }, 100);
  
  // Allow Enter key to submit
  passwordInput.onkeypress = function(e) {
    if (e.key === 'Enter') {
      checkPasswordAndReset();
    }
  };
}

function hideResetModal() {
  document.getElementById('reset-modal').classList.add('hidden');
  document.getElementById('reset-password').value = '';
  document.getElementById('password-error').style.display = 'none';
}

function checkPasswordAndReset() {
  const passwordInput = document.getElementById('reset-password');
  const errorDiv = document.getElementById('password-error');
  const enteredPassword = passwordInput.value;
  const correctPassword = 'Simeone2';
  
  if (enteredPassword === correctPassword) {
    // Password correct, proceed with reset
    errorDiv.style.display = 'none';
    confirmResetLeaderboard();
  } else {
    // Wrong password
    errorDiv.style.display = 'block';
    passwordInput.value = '';
    passwordInput.focus();
    
    // Shake effect for wrong password
    passwordInput.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      passwordInput.style.animation = '';
    }, 500);
  }
}

async function confirmResetLeaderboard() {
  
  try {
    // Clear local storage
    localStorage.removeItem('kpop-demon-huntersScores');
    console.log('Local K-pop scores cleared');
    
    // Clear Firebase if available
    if (window.firebaseDB) {
      const q = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, 'kpop-demon-huntersScores')
      );
      const querySnapshot = await window.firebaseGetDocs(q);
      
      // Delete each document
      const deletePromises = [];
      querySnapshot.forEach((doc) => {
        deletePromises.push(window.firebaseDeleteDoc(doc.ref));
      });
      
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
        console.log(`Deleted ${deletePromises.length} K-pop scores from Firebase`);
      }
    }
    
    // Hide modal and refresh leaderboard
    hideResetModal();
    alert('✅ K-pop Demon Hunters leaderboard has been reset successfully!');
    
    // Refresh leaderboard display
    showLeaderboard();
    
  } catch (error) {
    console.error('Error resetting K-pop leaderboard:', error);
    alert('❌ Error resetting leaderboard. Check console for details.');
  }
}

function showSection(sectionId) {
  // Hide all sections
  const sections = ['game-section', 'leaderboard-section'];
  sections.forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  
  // Show target section
  document.getElementById(sectionId).classList.remove('hidden');
}

function showLeaderboardResetNotification() {
  // Create a temporary notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #FF6B6B;
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    font-weight: bold;
    text-align: center;
    animation: slideDown 0.3s ease-out;
  `;
  notification.innerHTML = '🔄 K-pop leaderboard has been reset by teacher';
  
  // Add animation keyframes if not already added
  if (!document.querySelector('#reset-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'reset-notification-styles';
    style.textContent = `
      @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideDown 0.3s ease-out reverse';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}