// Living Things Memory Game JavaScript

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
  soundEnabled: true
};

// Class roster - Add students from your class here
const classRoster = [
  { name: 'abiel', photo: 'abiel.jpg' },
  { name: 'adrian', photo: 'adrian.jpg' },
  { name: 'aitana', photo: 'aitana.png' },
  { name: 'aizan', photo: 'aizan.jpg' },
  { name: 'alan', photo: 'alan.jpg' },
  { name: 'alba', photo: 'alba.jpg' },
  { name: 'alejandro', photo: 'alejandro.jpg' },
  { name: 'alex', photo: 'alex.jpg' },
  { name: 'alexandra', photo: 'alexandra.png' },
  { name: 'alicia', photo: 'alicia.jpg' },
  { name: 'alisson', photo: 'alisson.png' },
  { name: 'alma', photo: 'alma.png' },
  { name: 'amalia', photo: 'amalia.png' },
  { name: 'anais', photo: 'anais.jpg' },
  { name: 'antonio', photo: 'antonio.png' },
  { name: 'arabia', photo: 'arabia.jpg' },
  { name: 'ariadna', photo: 'ariadna.png' },
  { name: 'ashley', photo: 'ashley.jpg' },
  { name: 'aslan', photo: 'aslan.png' },
  { name: 'benjamin', photo: 'benjamin.jpg' },
  { name: 'carlos', photo: 'carlos.jpg' },
  { name: 'carolina', photo: 'carolina.png' },
  { name: 'cathaleya', photo: 'cathaleya.jpg' },
  { name: 'chloe', photo: 'chloe.jpg' },
  { name: 'dani', photo: 'dani.jpg' },
  { name: 'daniel', photo: 'danielB.jpg' },
  { name: 'danna', photo: 'danna.jpg' },
  { name: 'david', photo: 'david.png' },
  { name: 'elisa', photo: 'elisa.jpg' },
  { name: 'eva', photo: 'eva.jpg' },
  { name: 'gabriel', photo: 'gabriel.png' },
  { name: 'guadalupe', photo: 'guadalupe.png' },
  { name: 'ian', photo: 'ian.png' },
  { name: 'ines', photo: 'ines.png' },
  { name: 'isabella', photo: 'isabella.png' },
  { name: 'jaime', photo: 'jaime.png' },
  { name: 'jimena', photo: 'jimena.png' },
  { name: 'jon', photo: 'jon.jpg' },
  { name: 'julia', photo: 'julia.png' },
  { name: 'junior', photo: 'junior.png' },
  { name: 'kadidia', photo: 'kadidia.png' },
  { name: 'laura', photo: 'laura.jpg' },
  { name: 'leo', photo: 'leo.jpg' },
  { name: 'luca', photo: 'luca.jpg' },
  { name: 'luna', photo: 'luna.png' },
  { name: 'marco', photo: 'marco.png' },
  { name: 'marcos', photo: 'marcos.jpg' },
  { name: 'mariam', photo: 'mariam.png' },
  { name: 'markel', photo: 'markel.png' },
  { name: 'mateo', photo: 'mateo.png' }
];

// Living things data with fun facts
const livingThings = [
  {
    name: 'Cat',
    image: 'cat.jpg',
    category: 'animal',
    fact: 'Cats can make over 100 different sounds! They purr when happy and can see in the dark much better than humans.'
  },
  {
    name: 'Dog',
    image: 'dog.jpg',
    category: 'animal',
    fact: 'Dogs have an amazing sense of smell - about 40 times better than humans! They can be trained to help people in many ways.'
  },
  {
    name: 'Butterfly',
    image: 'butterfly.jpg',
    category: 'animal',
    fact: 'Butterflies start as caterpillars and transform completely! They taste with their feet and can only see red, green, and yellow colors.'
  },
  {
    name: 'Fish',
    image: 'fish.jpg',
    category: 'animal',
    fact: 'Fish breathe underwater using gills! Some fish can live in both fresh water and salt water.'
  },
  {
    name: 'Bird',
    image: 'bird.jpg',
    category: 'animal',
    fact: 'Birds are the only animals with feathers! They can fly because their bones are hollow and light.'
  },
  {
    name: 'Tree',
    image: 'tree.jpg',
    category: 'plant',
    fact: 'Trees make oxygen for us to breathe! They can live for hundreds or even thousands of years.'
  },
  {
    name: 'Flower',
    image: 'flower.jpg',
    category: 'plant',
    fact: 'Flowers make seeds to grow new plants! Bees and butterflies help flowers by carrying pollen.'
  },
  {
    name: 'Grass',
    image: 'grass.jpg',
    category: 'plant',
    fact: 'Grass grows from the bottom, not the top! That\'s why we can cut it and it keeps growing.'
  }
];

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeGame();
});

function initializeGame() {
  // Show login section
  showSection('login-section');
  
  // Add enter key listener for name input
  document.getElementById('name-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      checkStudent();
    }
  });
}

function checkStudent() {
  const nameInput = document.getElementById('name-input');
  const name = nameInput.value.trim().toLowerCase();
  const messageDiv = document.getElementById('login-message');
  
  if (!name) {
    showMessage(messageDiv, 'Please enter your name! 📝', 'error');
    return;
  }
  
  // Find student in roster
  const student = classRoster.find(s => s.name.toLowerCase() === name);
  
  if (student) {
    // Student found - set up player
    gameState.currentPlayer = {
      name: student.name,
      photo: student.photo,
      displayName: capitalizeFirst(student.name)
    };
    
    showMessage(messageDiv, `Welcome ${gameState.currentPlayer.displayName}! 🌟`, 'success');
    
    setTimeout(() => {
      setupPlayerInfo();
      showSection('game-section');
      startNewGame();
    }, 1500);
    
  } else {
    showMessage(messageDiv, 'Hmm, I don\'t see that name in our class. Please check your spelling! 🤔', 'error');
    nameInput.value = '';
    nameInput.focus();
  }
}

function setupPlayerInfo() {
  const playerInfo = document.querySelector('.player-info');
  const playerAvatar = document.getElementById('player-avatar');
  const playerName = document.getElementById('player-name');
  
  playerAvatar.src = `images/${gameState.currentPlayer.photo}`;
  playerAvatar.alt = gameState.currentPlayer.displayName;
  playerName.textContent = gameState.currentPlayer.displayName;
  
  // Show player info now that user is logged in
  playerInfo.classList.add('logged-in');
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
}

function createCards() {
  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  
  // Use all 8 living things for 16 cards (8 pairs)
  const selectedThings = [...livingThings];
  
  // Create pairs
  const cardData = [...selectedThings, ...selectedThings];
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
        🌿
      </div>
      <div class="card-back">
        <img src="images/living-things/${card.image}" alt="${card.name}" class="card-image" onerror="this.src='images/icono.png'">
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
  
  factTitle.textContent = `Amazing ${card.name} Fact! 🌟`;
  factText.textContent = card.fact;
  
  factDisplay.classList.remove('hidden');
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
      🎉 Congratulations ${gameState.currentPlayer.displayName}! 🎉
    </div>
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
      await window.firebaseAddDoc(window.firebaseCollection(window.firebaseDB, 'livingThingsScores'), newScore);
      console.log('Score saved to Firebase successfully!');
    }
  } catch (error) {
    console.log('Firebase not available, saving locally:', error.message);
  }
  
  // Always save locally as backup
  const localScores = JSON.parse(localStorage.getItem('livingThingsScores') || '[]');
  localScores.push(newScore);
  localScores.sort((a, b) => b.score - a.score);
  localScores.splice(20);
  localStorage.setItem('livingThingsScores', JSON.stringify(localScores));
}

async function showLeaderboard() {
  // Close any open modal first
  hideModal();
  
  const leaderboardList = document.getElementById('leaderboard-list');
  
  // Show loading message
  leaderboardList.innerHTML = '<div style="text-align: center; color: #666;">🔄 Loading leaderboard...</div>';
  
  let scores = [];
  
  try {
    // Try to get scores from Firebase first
    if (window.firebaseDB) {
      const q = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, 'livingThingsScores'),
        window.firebaseOrderBy('score', 'desc'),
        window.firebaseLimit(20)
      );
      const querySnapshot = await window.firebaseGetDocs(q);
      scores = querySnapshot.docs.map(doc => doc.data());
      console.log('Loaded scores from Firebase:', scores.length);
    }
  } catch (error) {
    console.log('Firebase not available, using local scores:', error.message);
  }
  
  // Fallback to local scores if Firebase fails or has no scores
  if (scores.length === 0) {
    scores = JSON.parse(localStorage.getItem('livingThingsScores') || '[]');
    console.log('Using local scores:', scores.length);
  }
  
  if (scores.length === 0) {
    leaderboardList.innerHTML = '<div style="text-align: center; color: #666;">No scores yet! Be the first to play! 🌟</div>';
  } else {
    leaderboardList.innerHTML = '';
    
    // Add header to show if data is from cloud or local
    const sourceInfo = document.createElement('div');
    sourceInfo.style.textAlign = 'center';
    sourceInfo.style.fontSize = '0.8rem';
    sourceInfo.style.color = '#888';
    sourceInfo.style.marginBottom = '1rem';
    sourceInfo.innerHTML = window.firebaseDB && scores.length > 0 ? 
      '☁️ Global Leaderboard (All Players)' : 
      '💾 Local Scores (This Device Only)';
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
  
  showSection('leaderboard-section');
}

function backToGame() {
  showSection('game-section');
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
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  
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
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  
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
  // Also hide fact display if it's open
  document.getElementById('fact-display').classList.add('hidden');
}

function showSection(sectionId) {
  // Hide all sections
  const sections = ['login-section', 'game-section', 'leaderboard-section'];
  sections.forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  
  // Show target section
  document.getElementById(sectionId).classList.remove('hidden');
}

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `login-message ${type}`;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}