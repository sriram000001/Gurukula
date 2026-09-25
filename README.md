# Curriculum Generation Engine

## Backend
```
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in ANTHROPIC_API_KEY
uvicorn app.main:app --reload
```
Runs at http://localhost:8000 — check http://localhost:8000/docs for interactive API docs.

## Frontend
```
cd frontend
npm install
cp .env.example .env
npm run dev
```
Runs at http://localhost:5173

## Team ownership
- **Backend Core**: app/routers, app/main.py
- **Data & Standards**: app/models/standards.json, app/data/quiz_bank.json, app/services/path_builder.py prompt
- **Frontend Core**: src/pages, src/api
- **Polish/Deploy/Demo**: src/components, deploy configs, docs/demo_script.md

## Deploy
- Backend → Render (render.yaml included) or Railway
- Frontend → Vercel (vercel.json included), set VITE_API_BASE_URL to the deployed backend URL
