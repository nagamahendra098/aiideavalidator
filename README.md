# Spark — Startup Idea Validator

An AI-powered tool to validate startup ideas. Submit an idea, get a structured report: problem summary, customer persona, market overview, competitors, tech stack, risk level, and profitability score.

---

## Stack

- **Frontend**: React + Vite, React Router
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **AI**: Anthropic Claude (claude-opus-4-5)
- **Deploy**: Vercel (frontend) + Render (backend) + MongoDB Atlas (DB)

---

## Project Structure

```
startup-validator/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── server/          # Express backend
    ├── src/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   └── index.js
    └── package.json
```

---

## Local Development

### 1. Clone & install

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Configure environment

**server/.env**
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/startup-validator
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
CLIENT_URL=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:5000
```

### 3. Run both servers

```bash
# In /server
npm run dev

# In /client
npm run dev
```

Visit: http://localhost:5173

---

## Deployment

### Step 1 — MongoDB Atlas (Database)

1. Go to https://mongodb.com/atlas and create a free account
2. Create a free **M0** cluster
3. Under **Database Access** → Add a new user (username + password)
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all, fine for MVP)
5. Click **Connect** → **Drivers** → copy the connection string
6. Replace `<password>` with your user's password
7. Save this URI — you'll need it for the backend

---

### Step 2 — Backend on Render

1. Push your code to GitHub
2. Go to https://render.com → New → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add Environment Variables:
   - `MONGODB_URI` → your Atlas URI
   - `ANTHROPIC_API_KEY` → your Anthropic key
   - `CLIENT_URL` → your Vercel URL (add after deploying frontend)
6. Deploy → copy the Render URL (e.g. `https://spark-api.onrender.com`)

---

### Step 3 — Frontend on Vercel

1. Go to https://vercel.com → New Project → import your GitHub repo
2. Set **Root Directory** to `client`
3. Add Environment Variable:
   - `VITE_API_URL` → your Render backend URL (e.g. `https://spark-api.onrender.com`)
4. Deploy
5. Copy your Vercel URL and go back to Render → update `CLIENT_URL`

---

### Step 4 — Get API Keys

**Anthropic API Key**
1. Go to https://console.anthropic.com
2. API Keys → Create Key
3. Copy and save it (you only see it once)

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ideas` | Submit idea + trigger AI analysis |
| GET | `/ideas` | List all ideas |
| GET | `/ideas/:id` | Get idea with full report |
| DELETE | `/ideas/:id` | Delete an idea |

### POST /ideas — Request body
```json
{
  "title": "AI meal planner for busy parents",
  "description": "An app that plans weekly meals based on dietary needs..."
}
```

### Report shape
```json
{
  "problemSummary": "...",
  "customerPersona": "...",
  "marketOverview": "...",
  "competitors": ["Mealime", "Yummly", "..."],
  "techStack": ["React Native", "Node.js", "..."],
  "riskLevel": "Medium",
  "profitabilityScore": 68,
  "fullAnalysis": "..."
}
```

---

## Prompts Used

The AI system prompt instructs Claude to act as an experienced startup analyst and return a strict JSON object with all report fields. It emphasizes being honest and specific rather than hype-driven. The prompt is in `server/src/services/ai.js`.
