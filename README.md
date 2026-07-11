# AI Fit — AI Fitness & Nutrition Coach (MERN)

## What's built so far (Phase 1 + Phase 2)
- Full backend: Express + MongoDB (Mongoose), JWT auth (signup/login), User model with all onboarding fields, protected routes
- Frontend: React (Vite) + Tailwind, routing, Auth context, Landing page, Login/Signup
- **All 4 onboarding steps**, fully working and saving to MongoDB after each step:
  1. Gender
  2. Age, height, weight
  3. Experience level + goal
  4. Injuries/conditions, available days, gym vs home (marks onboarding complete → redirects to Dashboard)
- **Sidebar navigation** (Dashboard / My Details / Stats / Profile / Log out) wrapping the logged-in app
- **My Details page** — view and edit every onboarding answer, saves back to MongoDB
- You can now sign up, complete the full onboarding flow, and land on the dashboard shell. Dashboard/Stats/Profile currently show "coming soon" placeholders until their phases are built.

## What's coming next
- **Phase 3:** Dashboard + Gemini AI plan generation (7-day workout & meal plan) + ExerciseDB integration
- **Phase 4:** Stats page (charts) + Profile/settings page

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
│   ├── models/                # User.js, Plan.js (Mongoose schemas)
│   ├── controllers/           # business logic (auth, user)
│   ├── routes/                # API endpoints
│   ├── middleware/auth.js     # JWT verification
│   ├── server.js              # app entry point
│   └── .env                   # your secrets (you create this)
└── frontend/
    ├── src/
    │   ├── pages/              # Landing, Login, Signup, onboarding/*, Dashboard...
    │   ├── components/         # ProtectedRoute, (Navbar/Sidebar in Phase 2)
    │   ├── context/AuthContext.jsx   # global logged-in user state
    │   ├── api/axios.js        # pre-configured API client
    │   └── App.jsx             # all routes
    └── index.html
```

## Explaining this to your teacher (in plain terms)
- **MERN stack**: MongoDB (database) + Express (backend web server) + React (frontend UI) + Node.js (runs the backend JavaScript)
- **JWT authentication**: when a user logs in, the server gives them a signed token; the browser sends that token with every request afterward to prove who they are — no server-side session storage needed
- **Mongoose schemas**: define the shape of the data stored in MongoDB (User, Plan) — like a blueprint
- **Onboarding data model**: each user's gender/age/goals/etc. are just fields on their User document. When the AI generates a plan (Phase 3), it reads those fields, sends them to the Gemini API with a prompt, and stores the structured result in a Plan document.
