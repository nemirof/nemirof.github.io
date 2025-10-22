# Firebase Setup Instructions for Living Things Memory Game

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `living-things-memory` (or any name you prefer)
4. Disable Google Analytics (not needed for this project)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (allows read/write for 30 days)
4. Select a location close to your students (e.g., europe-west1 for Europe)
5. Click "Done"

## Step 3: Get Firebase Configuration

1. Click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon `</>`
4. Register app name: "Living Things Memory"
5. Don't check "Firebase Hosting" (we're using GitHub Pages)
6. Click "Register app"
7. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};
```

## Step 4: Update the Game

1. Open `living-things.html`
2. Find the Firebase configuration section (around line 95)
3. Replace the placeholder values with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_PROJECT.firebaseapp.com",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_PROJECT.appspot.com",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

## Step 5: Update Firestore Rules (Optional - for better security)

1. Go to Firestore Database → Rules
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to livingThingsScores collection
    match /livingThingsScores/{document} {
      allow read, write: if true;
    }
  }
}
```

## Step 6: Test the Game

1. Open your game and play a round
2. Check if the leaderboard shows "☁️ Global Leaderboard (All Players)"
3. Scores should now be shared across all devices!

## Features After Setup:

✅ **Global Leaderboard**: All students see the same scores
✅ **Real-time Updates**: New scores appear for everyone
✅ **Cross-device**: Play at home, see school scores
✅ **Automatic Backup**: Still works offline with local storage
✅ **Free Tier**: Firebase provides 50,000 reads/day free

## Troubleshooting:

- **"Firebase not available"**: Check your config values
- **No scores showing**: Check Firestore rules
- **Local scores only**: Firebase config might be incorrect

## Resetting the Leaderboard:

### Method 1: Using the Game Interface (Recommended)
1. Open the game and go to the leaderboard
2. Click the red "🗑️ Reset Leaderboard" button
3. Enter the teacher password: **Simeone2**
4. Click "Reset Leaderboard"
5. All scores (local and Firebase) will be cleared

**Teacher Password:** `Simeone2` (case-sensitive)

### Method 2: Firebase Console
1. Go to Firebase Console → Firestore Database
2. Find the "livingThingsScores" collection
3. Delete individual documents or the entire collection
4. Students' local scores will remain until they play again

### Method 3: Browser Console (Local only)
1. Open the game page
2. Press F12 → Console tab
3. Type: `localStorage.removeItem('livingThingsScores')`
4. Press Enter (only clears local scores)

### Method 4: Private/Incognito Mode
- Open the game in incognito mode for a clean slate
- No scores will be saved in this mode

## Security Note:

The current setup allows anyone to read/write scores. For a production classroom environment, consider implementing Firebase Authentication to restrict access to your students only.

✅ **Security**: The reset button only appears when user "nemiroff" is logged in. It's also protected with a password (`Simeone2`) for double security.

**Access Control:**
- Only visible to: `nemiroff` user
- Password protected: `Simeone2`
- Other students: Cannot see or access the button

**To change the authorized user:**
1. Open `living-things-game.js`
2. Find the line: `if (currentUser === 'nemiroff') {`
3. Change `'nemiroff'` to your desired username
4. Save the file

**To change the password:**
1. Open `living-things-game.js`
2. Find the line: `const correctPassword = 'Simeone2';`
3. Change `'Simeone2'` to your desired password
4. Save the file

---

Need help? Check the browser console (F12) for error messages!