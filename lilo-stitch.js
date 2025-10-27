// Lilo & Stitch Memory Game JavaScript

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

// Lilo & Stitch characters data with fun facts
const liloStitchCharacters = [
  {
    name: 'Stitch',
    image: 'stitch.jpg',
    category: 'character',
    fact: {
      en: 'Stitch is Experiment 626! He\'s super strong, can lift objects 3,000 times his weight, and loves Elvis Presley music!',
      es: 'Stitch es el Experimento 626! Es súper fuerte, puede levantar objetos 3,000 veces más pesados que él, ¡y le encanta la música de Elvis Presley!'
    }
  },
  {
    name: 'Lilo',
    image: 'lilo.jpg',
    category: 'character',
    fact: {
      en: 'Lilo loves hula dancing and taking care of endangered animals! She teaches Stitch about ohana - family.',
      es: 'A Lilo le encanta bailar hula hula y cuidar animales en peligro de extinción! Le enseña a Stitch sobre ohana - familia.'
    }
  },
  {
    name: 'Angel',
    image: 'angel.jpg',
    category: 'character',
    fact: {
      en: 'Angel is Experiment 624! She can turn good experiments bad with her beautiful singing voice.',
      es: 'Angel es el Experimento 624. Puede volver malvados a los experimentos buenos con su hermosa voz cantante.'
    }
  },
  {
    name: 'Jumba',
    image: 'jumba.jpg',
    category: 'character',
    fact: {
      en: 'Dr. Jumba created Stitch and 628 other experiments! He\'s a genius scientist from outer space.',
      es: 'El Dr. Jumba creó a Stitch y otros 628 experimentos. Es un genial científico del espacio exterior.'
    }
  },
  {
    name: 'Pleakley',
    image: 'pleakley.jpg',
    category: 'character',
    fact: {
      en: 'Pleakley is a one-eyed alien who loves Earth culture, especially mosquitoes and Earth fashion!',
      es: 'Pleakley es un alienígena con un sólo ojo que ama la cultura terrestre, ¡especialmente los mosquitos y la moda terrestre!'
    }
  },
  {
    name: 'Nani',
    image: 'nani.jpg',
    category: 'character',
    fact: {
      en: 'Nani is Lilo\'s big sister who works hard to take care of her family. She\'s brave and loves surfing!',
      es: 'Nani es la hermana mayor de Lilo y trabaja duro para cuidar de su familia. ¡Es valiente y le encanta surfear!'
    }
  },
  {
    name: 'David',
    image: 'david.jpg',
    category: 'character',
    fact: {
      en: 'David is Nani\'s boyfriend and a great surfer! He\'s always there to help the ohana when they need him.',
      es: 'David es el novio de Nani y un gran surfista! Siempre está ahí para ayudar a la ohana-familia cuando lo necesitan.'
    }
  },
  {
    name: 'Cobra',
    image: 'cobra.jpg',
    category: 'character',
    fact: {
      en: 'Cobra is a social worker who helps keep families together. He has a mysterious past as a secret agent!',
      es: 'Cobra es un trabajador social que ayuda a mantener unidas a las familias. ¡Tiene un pasado misterioso como agente secreto!'
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
  
  // Check Firebase connection status
  checkFirebaseStatus();
  
  // Set up Firebase real-time listener for leaderboard changes
  setupFirebaseListener();
  
  // Try to migrate local scores to Firebase
  migrateLocalScoresToFirebase();
}

async function migrateLocalScoresToFirebase() {
  console.log('🔄 Checking for local Lilo & Stitch scores to migrate...');
  
  const localScores = JSON.parse(localStorage.getItem('lilo-stitchScores') || '[]');
  
  if (localScores.length === 0) {
    console.log('No local Lilo & Stitch scores to migrate');
    return;
  }
  
  if (!window.firebaseDB) {
    console.log('Firebase not available - keeping local scores');
    return;
  }
  
  try {
    console.log(`🚀 Migrating ${localScores.length} local Lilo & Stitch scores to Firebase...`);
    
    for (const score of localScores) {
      await window.firebaseAddDoc(
        window.firebaseCollection(window.firebaseDB, 'lilo-stitchScores'), 
        score
      );
    }
    
    console.log('✅ Successfully migrated all Lilo & Stitch scores to Firebase!');
    
    // Clear local scores after successful migration
    localStorage.removeItem('lilo-stitchScores');
    console.log('🧹 Local Lilo & Stitch scores cleared after migration');
    
  } catch (error) {
    console.log('❌ Migration failed:', error.message);
    console.log('Keeping local scores as backup');
  }
}

async function checkFirebaseStatus() {
  console.log('🔍 Checking Lilo & Stitch Smart Cloud Storage connection...');
  
  try {
    if (window.firebaseDB) {
      // Try to read from Smart Cloud Storage to test connection
      const testQuery = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, 'lilo-stitchScores'),
        window.firebaseLimit(1)
      );
      
      const snapshot = await window.firebaseGetDocs(testQuery);
      console.log('✅ Lilo & Stitch Smart Cloud Storage connection successful!');
      console.log(`📊 Current Lilo & Stitch scores in cloud: ${snapshot.docs.length > 0 ? 'Found data' : 'Empty collection'}`);
      
      return true;
    } else {
      console.log('❌ Smart Cloud Storage not initialized for Lilo & Stitch game');
      return false;
    }
  } catch (error) {
    console.log('❌ Lilo & Stitch Smart Cloud Storage connection failed:', error.message);
    return false;
  }
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
        window.firebaseCollection(window.firebaseDB, 'lilo-stitchScores'),
        window.firebaseOrderBy('score', 'desc'),
        window.firebaseLimit(20)
      );
      
      leaderboardListener = window.firebaseOnSnapshot(q, (snapshot) => {
        console.log('Smart Cloud Storage Lilo & Stitch leaderboard changed:', snapshot.docs.length, 'scores');
        
        // If we're currently viewing the leaderboard, refresh it
        const leaderboardSection = document.getElementById('leaderboard-section');
        if (!leaderboardSection.classList.contains('hidden')) {
          console.log('Auto-refreshing Lilo & Stitch leaderboard due to cloud changes');
          showLeaderboard();
        }
        
        // If Firebase is empty, clear local storage on all devices
        if (snapshot.docs.length === 0) {
          const localScores = JSON.parse(localStorage.getItem('lilo-stitchScores') || '[]');
          if (localScores.length > 0) {
            console.log('Firebase Lilo & Stitch scores empty - clearing local scores for consistency');
            localStorage.removeItem('lilo-stitchScores');
            
            // Show notification if leaderboard is visible
            if (!leaderboardSection.classList.contains('hidden')) {
              showLeaderboardResetNotification();
            }
          }
        }
      }, (error) => {
        console.log('Firebase listener error:', error);
      });
      
      console.log('Firebase Lilo & Stitch real-time listener established');
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
  
  // Use all 8 Lilo & Stitch characters for 16 cards (8 pairs)
  const selectedItems = [...liloStitchCharacters];
  
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
        🌺
      </div>
      <div class="card-back">
        <img src="images/lilo-stitch/${card.image}" alt="${card.name}" class="card-image" onerror="this.src='images/icono.png'">
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
  // Pause the timer when showing fact
  pauseTimer();
  
  const factDisplay = document.getElementById('fact-display');
  const factTitle = document.getElementById('fact-title');
  const factText = document.getElementById('fact-text');
  
  // Set the title based on current language
  const funFactText = gameState.currentLanguage === 'en' ? 'Fun Fact!' : '¡Dato Curioso!';
  factTitle.innerHTML = `
    ${card.name} ${funFactText} 🌺
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
  const card = liloStitchCharacters.find(c => c.name === cardName);
  if (card) {
    showFact(card);
  }
}

function closeFact() {
  document.getElementById('fact-display').classList.add('hidden');
  
  // Resume the timer when closing fact
  resumeTimer();
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
      🎉 Aloha, ${gameState.currentPlayer.displayName}! 🎉
    </div>
    <div style="margin-bottom: 0.5rem;">You've brought all the ohana together! 🌺🌊</div>
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
    timestamp: Date.now(),
    game: 'lilo-stitch',
    device: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
  };
  
  console.log(`🎯 Attempting to save score for ${newScore.name}: ${newScore.score} points`);
  
  let cloudSaved = false;
  
  try {
    // Save to Smart Cloud Storage with duplicate checking
    if (window.firebaseDB) {
      // First, check if player already has a score
      const q = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, 'lilo-stitchScores'),
        window.firebaseOrderBy('score', 'desc')
      );
      const querySnapshot = await window.firebaseGetDocs(q);
      
      let existingDocId = null;
      let existingScore = null;
      let shouldUpdate = false;
      
      // Look for existing player record
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.name && data.name.toLowerCase() === newScore.name.toLowerCase()) {
          existingDocId = doc.id;
          existingScore = data.score || 0;
          shouldUpdate = newScore.score > existingScore;
          console.log(`🔍 Found existing score for ${newScore.name}: ${existingScore} vs new: ${newScore.score}`);
        }
      });
      
      if (shouldUpdate && existingDocId) {
        // Update existing document
        await window.firebaseUpdateDoc(window.firebaseDoc(window.firebaseDB, 'lilo-stitchScores', existingDocId), newScore);
        console.log(`🔄 Updated ${newScore.name}'s score from ${existingScore} to ${newScore.score}`);
      } else if (!existingDocId) {
        // Add new document (first time player)
        await window.firebaseAddDoc(window.firebaseCollection(window.firebaseDB, 'lilo-stitchScores'), newScore);
        console.log(`✨ Added new score for ${newScore.name}: ${newScore.score}`);
      } else {
        console.log(`⚠️ Score ${newScore.score} is not better than existing ${existingScore} for ${newScore.name}`);
      }
      
      cloudSaved = true;
      
      // Clear old local scores to prevent duplicates
      localStorage.removeItem('lilo-stitchScores');
      console.log('Old local scores cleared after successful cloud operation');
    } else {
      console.log('⚠️ Smart Cloud Storage not initialized');
    }
  } catch (error) {
    console.log('❌ Smart Cloud Storage save failed:', error.message);
    cloudSaved = false;
  }
  
  // Only save locally if cloud failed
  if (!cloudSaved) {
    console.log('💾 Saving score locally as fallback');
    const localScores = JSON.parse(localStorage.getItem('lilo-stitchScores') || '[]');
    localScores.push(newScore);
    localScores.sort((a, b) => b.score - a.score);
    localScores.splice(20);
    localStorage.setItem('lilo-stitchScores', JSON.stringify(localScores));
  }
  
  // Refresh leaderboard if it's currently visible to show updated scores
  setTimeout(() => {
    const leaderboardSection = document.getElementById('leaderboard-section');
    if (leaderboardSection && !leaderboardSection.classList.contains('hidden')) {
      console.log('🔄 Refreshing leaderboard after score save...');
      showLeaderboard();
    }
  }, 500);
}

async function showLeaderboard() {
  // Close any open modal first
  hideModal();
  
  const leaderboardList = document.getElementById('leaderboard-list');
  
  // Show loading message
  leaderboardList.innerHTML = '<div style="text-align: center; color: #666;">🔄 Loading Lilo & Stitch leaderboard...</div>';
  
  let scores = [];
  let firebaseAvailable = false;
  let firebaseHasScores = false;
  let dataSource = '';
  
  try {
    // Always try Smart Cloud Storage first (global scores)
    if (window.firebaseDB) {
      console.log('🌐 Attempting to load Lilo & Stitch scores from Smart Cloud Storage...');
      firebaseAvailable = true;
      
      const q = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, 'lilo-stitchScores'),
        window.firebaseOrderBy('score', 'desc'),
        window.firebaseLimit(20)
      );
      
      const querySnapshot = await window.firebaseGetDocs(q);
      scores = querySnapshot.docs.map(doc => doc.data());
      firebaseHasScores = scores.length > 0;
      
      console.log(`✅ Successfully loaded ${scores.length} Lilo & Stitch scores from Smart Cloud Storage`);
      
      if (firebaseHasScores) {
        dataSource = 'cloud';
        // Clear old local scores when we get cloud data to avoid confusion
        const localScores = JSON.parse(localStorage.getItem('lilo-stitchScores') || '[]');
        if (localScores.length > 0) {
          console.log('🧹 Clearing old local Lilo & Stitch scores - using cloud data');
          localStorage.removeItem('lilo-stitchScores');
        }
      }
    } else {
      console.log('⚠️ Smart Cloud Storage not initialized');
    }
  } catch (error) {
    console.log('❌ Smart Cloud Storage error:', error.message);
    firebaseAvailable = false;
  }
  
  // Use local scores only as absolute fallback
  if (!firebaseAvailable || !firebaseHasScores) {
    const localScores = JSON.parse(localStorage.getItem('lilo-stitchScores') || '[]');
    if (localScores.length > 0) {
      scores = localScores;
      dataSource = 'local';
      console.log(`💾 Using ${scores.length} local Lilo & Stitch scores as fallback`);
    } else {
      scores = [];
      dataSource = 'empty';
      console.log('📭 No Lilo & Stitch scores found anywhere');
    }
  }
  
  // Remove duplicate users - keep only highest score per user
  const userBestScores = new Map();
  
  // First pass: find the highest score for each user
  scores.forEach(score => {
    const userName = score.name.toLowerCase();
    const userScore = parseInt(score.score) || 0;
    
    if (!userBestScores.has(userName) || userScore > parseInt(userBestScores.get(userName).score)) {
      userBestScores.set(userName, score);
    }
  });
  
  // Convert map values back to array
  const uniqueScores = Array.from(userBestScores.values());
  
  // Ensure scores are properly sorted by score (highest to lowest)
  scores = uniqueScores.sort((a, b) => {
    const scoreA = parseInt(a.score) || 0;
    const scoreB = parseInt(b.score) || 0;
    return scoreB - scoreA; // Higher scores first
  });
  
  if (scores.length === 0) {
    leaderboardList.innerHTML = '<div style="text-align: center; color: #666;">No ohana adventures yet! Be the first to explore! 🌺</div>';
  } else {
    leaderboardList.innerHTML = '';
    
    // Add header to show if data is from cloud or local
    const sourceInfo = document.createElement('div');
    sourceInfo.style.textAlign = 'center';
    sourceInfo.style.fontSize = '0.8rem';
    sourceInfo.style.color = '#888';
    sourceInfo.style.marginBottom = '1rem';
    
    if (dataSource === 'cloud') {
      sourceInfo.innerHTML = '☁️ Global Lilo & Stitch Ohana Leaderboard (Synced across all devices)';
      sourceInfo.style.color = '#4ECDC4';
    } else if (dataSource === 'local') {
      sourceInfo.innerHTML = '💾 Local Lilo & Stitch Scores (This Device Only - Cloud sync failed)';
      sourceInfo.style.color = '#FF6B6B';
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

function pauseTimer() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }
}

function resumeTimer() {
  if (!gameState.timerInterval) {
    startTimer();
  }
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
  const colors = ['#00BCD4', '#4FC3F7', '#81C784', '#FFB74D', '#F8BBD9', '#CE93D8'];
  
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
  const colors = ['#00BCD4', '#4FC3F7', '#81C784', '#FFB74D', '#F8BBD9', '#CE93D8'];
  
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
    localStorage.removeItem('lilo-stitchScores');
    console.log('Local Lilo & Stitch scores cleared');
    
    // Clear Firebase if available
    if (window.firebaseDB) {
      const q = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, 'lilo-stitchScores')
      );
      const querySnapshot = await window.firebaseGetDocs(q);
      
      // Delete each document
      const deletePromises = [];
      querySnapshot.forEach((doc) => {
        deletePromises.push(window.firebaseDeleteDoc(doc.ref));
      });
      
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
        console.log(`Deleted ${deletePromises.length} Lilo & Stitch scores from Firebase`);
      }
    }
    
    // Hide modal and refresh leaderboard
    hideResetModal();
    alert('✅ Lilo & Stitch leaderboard has been reset successfully!');
    
    // Refresh leaderboard display
    showLeaderboard();
    
  } catch (error) {
    console.error('Error resetting Lilo & Stitch leaderboard:', error);
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
  notification.innerHTML = '🔄 Lilo & Stitch leaderboard has been reset by teacher';
  
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