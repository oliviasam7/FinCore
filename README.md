# Contract Analyzer — Use & Throw Prototype

A full-stack AI-powered contract analysis app built with **React + Vite** (frontend) and **FastAPI** (backend), using the **Anthropic Claude API**.

---

## Features

| Tab | What it does |
|-----|-------------|
| ① Upload | Upload `.txt` / `.pdf` or paste contract text |
| ② Explanation | Plain-language breakdown of every key clause |
| ③ Risk Detection | Risk score (0–100), severity-ranked issues |
| ④ Financial Impact | Extracted fees + computed penalty scenarios |
| ⑤ AI Chat | Ask anything about the contract in natural language |

---

## Project Structure

```
contract-analyzer/
├── backend/
│   ├── main.py              # FastAPI app — all AI endpoints
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx / App.module.css
        ├── api.js               # Axios calls to backend
        ├── index.css
        └── components/
            ├── UploadTab.jsx / .module.css
            ├── ExplainTab.jsx
            ├── RiskTab.jsx
            ├── FinancialTab.jsx
            ├── ChatTab.jsx / .module.css
            └── ResultTab.module.css
```

---

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- An Anthropic API key → https://console.anthropic.com

---

### 1. Backend Setup

```bash
# Open a terminal and go to the backend folder
cd contract-analyzer/backend

# Create a virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set your API key
# On Windows (PowerShell):
$env:ANTHROPIC_API_KEY="sk-ant-..."
# On Mac/Linux:
export ANTHROPIC_API_KEY="sk-ant-..."

# Start the backend server
uvicorn main:app --reload --port 8000
```

Backend will be running at: http://localhost:8000
API docs available at: http://localhost:8000/docs

---

### 2. Frontend Setup

```bash
# Open a SECOND terminal and go to the frontend folder
cd contract-analyzer/frontend

# Install Node dependencies
npm install

# Start the frontend dev server
npm run dev
```

Frontend will be running at: http://localhost:5173

---

### 3. Open in Browser

Go to **http://localhost:5173** — the app is ready!

---

## How to Use

1. Click **"Load sample contract"** to use the built-in demo, or paste/upload your own
2. Click **"Analyze Contract"** and wait ~10–15 seconds for AI analysis
3. Browse the tabs: Explanation → Risk → Financial → Chat
4. In the Chat tab, type questions or click the hint buttons

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/upload` | Upload .txt or .pdf file |
| POST | `/analyze/explain` | Extract clause explanations |
| POST | `/analyze/risk` | Risk score + issue detection |
| POST | `/analyze/financial` | Financial figures + penalty scenarios |
| POST | `/chat` | Multi-turn contract Q&A |

---

## Troubleshooting

**"ANTHROPIC_API_KEY not set" error**
→ Make sure you exported the key in the same terminal session running uvicorn.

**PDF upload returns empty text**
→ pdfplumber works on text-based PDFs. Scanned PDFs need OCR (pytesseract).

**CORS error in browser**
→ Make sure both servers are running (port 8000 and 5173).

**Module not found errors**
→ Run `pip install -r requirements.txt` again inside your virtual environment.
