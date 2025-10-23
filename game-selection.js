// Game Selection JavaScript

// Game state
let gameState = {
  currentPlayer: null,
  soundEnabled: true
};

// Firebase real-time listener
let leaderboardListener = null;

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
  { name: 'nemiroff', photo: 'logo11.png' },
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
  { name: 'raquel', photo: 'raquelB.jpg' },
  { name: 'mateo', photo: 'mateo.png' }
];

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeGameSelection();
});

// Clean up Firebase listener when page is closed
window.addEventListener('beforeunload', function() {
  if (leaderboardListener) {
    leaderboardListener();
    leaderboardListener = null;
  }
});

function initializeGameSelection() {
  // Get player info from sessionStorage (set by login page)
  const storedPlayer = sessionStorage.getItem('gameCenter_currentPlayer');
  
  if (storedPlayer) {
    gameState.currentPlayer = JSON.parse(storedPlayer);
    setupPlayerInfo();
    showSection('game-selection-section');
  } else {
    // If no player info, redirect to login page
    window.location.href = 'homegames.html';
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

function playGame(gameType) {
  // Store current player in sessionStorage for the individual game
  sessionStorage.setItem('gameCenter_currentPlayer', JSON.stringify(gameState.currentPlayer));
  
  // Navigate to the specific game
  switch(gameType) {
    case 'living-things':
      window.location.href = 'living-things.html';
      break;
    case 'kpop-demon-hunters':
      window.location.href = 'kpop-demon-hunters.html';
      break;
    case 'lilo-stitch':
      window.location.href = 'lilo-stitch.html';
      break;
  }
}

function logout() {
  // Clear stored player data
  sessionStorage.removeItem('gameCenter_currentPlayer');
  
  // Redirect to login page
  window.location.href = 'homegames.html';
}

function backToGameSelection() {
  showSection('game-selection-section');
}

function showSection(sectionId) {
  // Hide all sections
  const sections = ['game-selection-section', 'leaderboard-section'];
  sections.forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  
  // Show target section
  document.getElementById(sectionId).classList.remove('hidden');
}

// Current active leaderboard game
let currentLeaderboardGame = 'living-things';

function showGameLeaderboard(gameType) {
  currentLeaderboardGame = gameType;
  
  // Update tab appearance
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Load leaderboard for specific game
  loadGameLeaderboard(gameType);
}

async function loadGameLeaderboard(gameType) {
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
      const collectionName = `${gameType}Scores`;
      const q = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, collectionName),
        window.firebaseOrderBy('score', 'desc'),
        window.firebaseLimit(20)
      );
      const querySnapshot = await window.firebaseGetDocs(q);
      scores = querySnapshot.docs.map(doc => doc.data());
      firebaseHasScores = scores.length > 0;
      console.log(`Loaded ${gameType} scores from Firebase:`, scores.length);
    }
  } catch (error) {
    console.log('Firebase not available, using local scores:', error.message);
    firebaseAvailable = false;
  }
  
  // Only use local scores if Firebase is not available at all
  if (!firebaseAvailable && scores.length === 0) {
    const localKey = `${gameType}Scores`;
    scores = JSON.parse(localStorage.getItem(localKey) || '[]');
    console.log(`Using local ${gameType} scores (Firebase unavailable):`, scores.length);
  } else if (firebaseAvailable && !firebaseHasScores) {
    // Firebase is available but empty - show empty leaderboard
    scores = [];
    console.log(`Firebase ${gameType} is empty - showing empty leaderboard`);
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
    leaderboardList.innerHTML = '<div style="text-align: center; color: #666;">No scores yet! Be the first to play! 🌟</div>';
  } else {
    leaderboardList.innerHTML = '';
    
    // Add header to show game and data source
    const sourceInfo = document.createElement('div');
    sourceInfo.style.textAlign = 'center';
    sourceInfo.style.fontSize = '0.8rem';
    sourceInfo.style.color = '#888';
    sourceInfo.style.marginBottom = '1rem';
    
    const gameNames = {
      'living-things': '🌿 Living Things',
      'kpop-demon-hunters': '🎵 K-pop Demon Hunters',
      'lilo-stitch': '🌺 Lilo & Stitch'
    };
    
    if (firebaseAvailable) {
      sourceInfo.innerHTML = `${gameNames[gameType]} - ☁️ Global Leaderboard`;
    } else {
      sourceInfo.innerHTML = `${gameNames[gameType]} - 💾 Local Scores`;
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
}

async function showLeaderboard() {
  // Control admin button visibility when showing leaderboard
  toggleAdminButton();
  
  // Show leaderboard section and load current game's leaderboard
  showSection('leaderboard-section');
  loadGameLeaderboard(currentLeaderboardGame);
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
    // Clear local storage for current game
    const localKey = `${currentLeaderboardGame}Scores`;
    localStorage.removeItem(localKey);
    console.log(`Local ${currentLeaderboardGame} scores cleared`);
    
    // Clear Firebase if available
    if (window.firebaseDB) {
      const collectionName = `${currentLeaderboardGame}Scores`;
      const q = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, collectionName)
      );
      const querySnapshot = await window.firebaseGetDocs(q);
      
      // Delete each document
      const deletePromises = [];
      querySnapshot.forEach((doc) => {
        deletePromises.push(window.firebaseDeleteDoc(doc.ref));
      });
      
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
        console.log(`Deleted ${deletePromises.length} ${currentLeaderboardGame} scores from Firebase`);
      }
    }
    
    // Hide modal and refresh leaderboard
    hideResetModal();
    alert(`✅ ${currentLeaderboardGame} leaderboard has been reset successfully!`);
    
    // Refresh leaderboard display
    loadGameLeaderboard(currentLeaderboardGame);
    
  } catch (error) {
    console.error(`Error resetting ${currentLeaderboardGame} leaderboard:`, error);
    alert('❌ Error resetting leaderboard. Check console for details.');
  }
}