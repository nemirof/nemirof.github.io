# 🔥 Firebase Setup Instructions for Cross-Device Game Sync

## Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.googl   e.com/
2. **Click "Add project"**
3. **Project name**: `nemiroff-games` (or any name you prefer)
4. **Disable Google Analytics** (not needed for this project)
5. **Click "Create project"**

## Step 2: Set up Firestore Database

1. **In your Firebase project**, click **"Firestore Database"** in the left sidebar
2. **Click "Create database"**
3. **Choose "Start in production mode"**
4. **Select a location** (choose closest to your users)
5. **Click "Done"**

## Step 3: Configure Web App

1. **In Firebase project**, click the **"Web" icon (</>) to add a web app**
2. **App nickname**: `Game Center` (or any name)
3. **Don't check "Firebase Hosting"**
4. **Click "Register app"**
5. **Copy the configuration object** - it will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

## Step 4: Update Game Files

Replace the **demoConfig** in these files with your **real firebaseConfig**:

### Files to update:
- `kpop-demon-hunters.html` (lines ~135-143)
- `living-things.html` (lines ~135-143)  
- `lilo-stitch.html` (lines ~135-143)

### Change this:
```javascript
// Use demoConfig for now - replace with firebaseConfig when you have a real Firebase project
app = initializeApp(demoConfig);
```

### To this:
```javascript
// Use real Firebase config for cross-device sync
app = initializeApp(firebaseConfig);
```

## Step 5: Set up Firestore Security Rules

1. **In Firebase Console**, go to **"Firestore Database"**
2. **Click "Rules" tab**
3. **Replace the rules** with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to game scores
    match /livingThingsScores/{document} {
      allow read, write: if true;
    }
    match /kpop-demon-huntersScores/{document} {
      allow read, write: if true;
    }
    match /lilo-stitchScores/{document} {
      allow read, write: if true;
    }
  }
}
```

4. **Click "Publish"**

## Step 6: Test Cross-Device Sync

1. **Open any game** on your computer
2. **Play and set a score**
3. **Open the same game** on your mobile device
4. **Check if the score appears** - it should sync automatically!

## ✅ Expected Results

- **Online Mode**: `🔥 Firebase Cross-Device Storage initialized! ONLINE`
- **Offline Mode**: `🔥 Firebase Cross-Device Storage initialized! OFFLINE`
- **Real-time sync**: Scores appear on all devices within seconds
- **Leaderboards show**: `🔥 Global [Game] Leaderboard (Real-time sync across all devices)`

## 🛠️ Troubleshooting

### If Firebase doesn't work:
- Check browser console for errors
- Verify your Firebase config is correct
- Make sure Firestore rules allow read/write
- Games will fallback to local storage automatically

### If scores don't sync:
- Wait up to 30 seconds for real-time updates
- Check internet connection on both devices
- Verify both devices are using the updated game files

## 🎯 Benefits

- **Instant sync**: Scores appear on all devices immediately
- **Real-time updates**: Leaderboards update live across devices
- **Offline support**: Games work without internet, sync when reconnected
- **Automatic fallback**: If Firebase fails, games use local storage

---

**Once configured, Eva's K-pop score will appear on ALL devices automatically!** 🎮✨