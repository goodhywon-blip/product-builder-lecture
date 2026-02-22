# Hangul Name Studio

Community-driven English name to Hangul converter with admin review.

## 1) Create a Firebase project
1. Go to Firebase Console and create a new project.
2. Enable **Firestore Database** (production mode).
3. Enable **Authentication**.

## 2) Enable Auth providers
1. In **Authentication > Sign-in method**, enable:
   - **Anonymous** (for visitors)
   - **Google** (for the admin)

## 3) Get your Firebase config
1. In **Project settings > General**, register a Web App.
2. Copy the Firebase config values and paste them into:
   - `index.html` (firebaseConfig object)
   - `admin.html` (firebaseConfig object)

## 4) Find your Admin UID
1. Sign in on `/admin.html` with Google.
2. Open Firebase Console → **Authentication** → **Users**.
3. Copy the UID for your Google account.

## 5) Set ADMIN_UID in rules
1. Open `firestore.rules`.
2. Replace `PASTE_ADMIN_UID_HERE` with your UID.
3. Deploy rules:
   - `firebase deploy --only firestore:rules`

## 6) Deploy Firestore indexes
1. Deploy indexes:
   - `firebase deploy --only firestore:indexes`

## 7) Deploy Hosting
1. Initialize hosting if needed:
   - `firebase init hosting`
2. Deploy:
   - `firebase deploy --only hosting`

## Files
- `index.html`: public site
- `admin.html`: admin dashboard
- `firestore.rules`: security rules
- `firestore.indexes.json`: composite indexes
- `style.css`: shared UI styles

