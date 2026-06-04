# Boomika M — Professional Portfolio Website

## Overview
A modern, responsive, recruiter-focused personal portfolio website for Boomika M — B.Tech AI & Data Science student, aspiring Data Analyst and Python Developer.

---

## Project Structure
```
portfolio-build/
├── index.html          ← Main portfolio page (all sections)
├── css/
│   ├── style.css       ← All styles with dark/light mode
│   └── animations.css  ← Animation effects
├── js/
│   ├── main.js         ← Core interactivity & Firebase integration
│   └── firebase-config.js  ← Firebase configuration (fill in your keys)
├── assets/
│   ├── Boomika_M_Resume.pdf  ← ADD YOUR RESUME FILE HERE
│   └── profile.jpg           ← ADD YOUR PHOTO HERE
└── README.md
```

---

## Do I Need a Database?

**Yes — Firebase Firestore is recommended for:**
| Feature | Firebase Used? |
|---------|---------------|
| Contact form submissions | ✅ Yes |
| Resume download tracking | ✅ Yes |
| Visitor analytics | ✅ Yes |
| Certificate management | ✅ Optional |

**Without Firebase:** The portfolio still works perfectly. Contact form will show an error (no backend), but all design, animations, and content display correctly.

---

## Firebase Setup Guide (Step-by-Step)

### Step 1 — Create a Firebase Project
1. Go to: https://console.firebase.google.com
2. Click **"Add project"**
3. Name it: `boomika-portfolio`
4. Click **Continue** → Disable Google Analytics (optional) → **Create project**

### Step 2 — Enable Firestore Database
1. In your Firebase project, click **"Build"** in the left sidebar
2. Click **"Firestore Database"**
3. Click **"Create database"**
4. Choose **"Start in test mode"** (for development)
5. Select a location → Click **"Done"**

### Step 3 — Register a Web App
1. Click the gear icon ⚙️ → **"Project settings"**
2. Scroll down to **"Your apps"**
3. Click the `</>` (Web) icon
4. App nickname: `Portfolio`
5. Click **"Register app"**
6. **COPY the firebaseConfig object shown** — you need this!

### Step 4 — Add Config to Your Portfolio
Open `index.html` and find this section near the bottom:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",            ← Replace with your values
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Paste your actual values from Step 3.

### Step 5 — Set Firestore Security Rules (before going live)
In Firestore → Rules tab, update to:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contacts/{doc} {
      allow write: if true;       // Anyone can submit contact form
      allow read: if false;       // Only you can read via Firebase console
    }
    match /visitors/{doc} {
      allow write: if true;
      allow read: if false;
    }
    match /analytics/{doc} {
      allow read, write: if true;
    }
  }
}
```

### Step 6 — Deploy to Firebase Hosting (Optional)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## Adding Your Resume
1. Place your resume PDF in `assets/` folder
2. Name it exactly: `Boomika_M_Resume.pdf`
3. That's it! The download button will work automatically.

## Adding Your Profile Photo
1. Place your photo in `assets/` folder
2. Name it: `profile.jpg`
3. In `index.html`, find the `<div class="hero-avatar">` section
4. Replace it with: `<img src="assets/profile.jpg" alt="Boomika M" />`

## Updating Personal Info
Search and replace in `index.html`:
- `boomika@email.com` → your actual email
- `https://linkedin.com/in/boomika-m` → your LinkedIn URL
- `https://github.com/boomika-m` → your GitHub URL
- GitHub project links in the project cards

---

## Features
- Dark/Light mode toggle (saved in localStorage)
- Typing animation for role titles
- Scroll-reveal animations
- Animated skill progress bars
- Animated statistics counter
- Certificate preview modal
- Contact form with Firebase backend
- Resume download tracking
- Particle background effects
- Fully responsive (mobile, tablet, desktop)
- Glassmorphism card design
- SEO-ready meta tags

---

## How to Run Locally
Simply open `index.html` in your browser. No server needed!

For a better local experience:
```bash
# Option 1 - Python
python -m http.server 3000

# Option 2 - VS Code
Install "Live Server" extension → Right-click index.html → "Open with Live Server"
```

---

Built with HTML5, CSS3, JavaScript, and Firebase
