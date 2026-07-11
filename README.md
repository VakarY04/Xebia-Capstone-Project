# AI Fit — AI Fitness & Nutrition Coach (MERN)

## What's built (Phases 1-5 — feature complete + polished)
- **Backend**: Express + MongoDB (Mongoose), JWT auth, User/Plan/Log models, protected routes, Gemini AI integration for plan generation, Nodemailer for password reset emails
- **Landing page**: fixed nav (Home / Features / About Us, smooth-scroll), animated hero using your own gym photos as section backgrounds, workout + nutrition motivation banners, feature cards with photo thumbnails
- **Auth**: Login, Signup, Forgot Password (emails a reset link), Reset Password
- **All 4 onboarding steps** — gender, body stats, experience/goal, injuries/days/location
- **Sidebar navigation** with your avatar shown next to your name
- **My Details** — edit any onboarding answer
- **Dashboard** — AI-generated 7-day workout + meal plan, day tabs, each exercise shown with a representative photo based on its muscle group
- **Stats** — adherence logging, weight trend / muscle-group / calories-protein charts with descriptive subtitles and richer tooltips
- **Profile** — profile picture upload (resized client-side before upload, so it stays small), account info, **Delete Account** (type-to-confirm, permanently removes your user, plans, and logs)
- **Dark fitness theme**: lime-green primary / amber accent palette, hover-and-lift effects on cards, glowing buttons, custom scrollbar, smooth animations on the landing page

## New setup steps for this version

### 1. Install the one new backend package
```bash
cd backend
npm install
```
(`nodemailer` was added to `package.json` — this pulls it in.)

### 2. Set up email sending (for Forgot Password)
Add to `backend/.env`:
```
EMAIL_USER=youraddress@gmail.com
EMAIL_PASS=your16charapppassword
CLIENT_URL=http://localhost:5173
```
To get an app password:
1. Turn on 2-Step Verification on your Google account if it isn't already
2. Go to https://myaccount.google.com/apppasswords
3. Create one named "AI Fit" → copy the 16-character password (not your normal Gmail password)

### 3. Frontend images
The images you provided are already placed in `frontend/public/images/` and wired into the Landing page and Dashboard exercise cards — nothing to configure, they just work once you `npm install` and run the frontend.

Everything else (MongoDB, Gemini key) is the same as before.

---

## How to run this (step by step)

### 1. Install prerequisites
- Install **Node.js** (v18 or later) from https://nodejs.org — this gives you `node` and `npm`.
- You'll need a code editor (VS Code recommended).

### 2. Set up MongoDB Atlas (free, ~5 minutes)
1. Go to https://www.mongodb.com/cloud/atlas/register and make a free account.
2. Create a **free M0 cluster**.
3. Under "Database Access," create a database user (username + password) — save these.
4. Under "Network Access," click "Add IP Address" → "Allow Access from Anywhere" (fine for a student project).
5. Click "Connect" → "Drivers" → copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`
6. Replace `<username>` and `<password>` with your real values, and add `ai-fit` as the database name before the `?`, e.g.:
   `mongodb+srv://john:mypassword@cluster0.xxxxx.mongodb.net/ai-fit?retryWrites=true&w=majority`

### 3. Configure the backend
```bash
cd backend
npm install
cp .env.example .env
```
Open `.env` and paste in:
- `MONGO_URI` — the connection string from step 2
- `JWT_SECRET` — any random long string (or run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` to generate one)
- Leave `GEMINI_API_KEY` and `EXERCISEDB_API_KEY` blank for now — we'll fill those in Phase 3

Then start the backend:
```bash
npm run dev
```
You should see `✅ MongoDB connected` and `🚀 Server running on port 5000`.

### 4. Configure the frontend
Open a **second terminal**:
```bash
cd frontend
npm install
npm run dev
```
It will start at **http://localhost:5173** — open that in your browser.

### 5. Try it out
- Go to the landing page → click Login → Sign Up → create an account
- You'll be taken to onboarding step 1 (choose gender) → it saves to MongoDB automatically
- Log into your MongoDB Atlas dashboard → Browse Collections → you'll see your user document with `gender` saved

---

## Project structure
```
ai-fit/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/                # User.js, Plan.js, Log.js (Mongoose schemas)
│   ├── controllers/           # business logic (auth, user, plan, log)
│   ├── routes/                # API endpoints
│   ├── middleware/auth.js     # JWT verification
│   ├── server.js              # app entry point
│   └── .env                   # your secrets (you create this)
└── frontend/
    ├── src/
    │   ├── pages/              # Landing, Login, Signup, onboarding/*, Dashboard, MyDetails, Stats, Profile
    │   ├── components/         # Sidebar, DashboardLayout, ProtectedRoute, OnboardingProgress
    │   ├── context/AuthContext.jsx   # global logged-in user state
    │   ├── api/axios.js        # pre-configured API client
    │   └── App.jsx             # all routes
    └── index.html
```

## Explaining this to your teacher (in plain terms)
- **MERN stack**: MongoDB (database) + Express (backend web server) + React (frontend UI) + Node.js (runs the backend JavaScript)
- **JWT authentication**: when a user logs in, the server gives them a signed token; the browser sends that token with every request afterward to prove who they are — no server-side session storage needed
- **Mongoose schemas**: define the shape of the data stored in MongoDB (User, Plan, Log) — like a blueprint
- **AI plan generation flow**: when you click "Generate My Plan," the backend reads your saved onboarding fields (age, goal, injuries, etc.), builds a detailed text prompt, sends it to Google's Gemini API asking for a strict JSON schema back, parses that JSON, and saves it as a `Plan` document in MongoDB — the frontend then just renders that JSON as day tabs
- **Stats page**: combines two data sources — your `Log` entries (did you actually do the workout, what did you weigh) and your `Plan` (planned calories/protein/muscle groups) — and charts them with the `recharts` library
- **Regeneration**: editing "My Details" doesn't auto-regenerate the plan (to avoid burning API calls on every keystroke) — you click "Regenerate Plan" on the Dashboard when you want a fresh one based on the new details
- **Password reset flow**: forgot-password generates a random token, stores only its SHA-256 hash in MongoDB (never the raw token) with a 30-minute expiry, emails the raw token in a link via Nodemailer, and the reset endpoint re-hashes whatever token comes back in the URL to check it matches — this is the same pattern real production apps use
- **Profile picture**: resized to a small square directly in the browser using the Canvas API before it's ever sent to the server, then stored as a base64 string on the User document — no third-party file storage service needed
- **Delete account**: requires typing "DELETE" to confirm, then removes the User plus all their Plan and Log documents so no orphaned data is left behind

