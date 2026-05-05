# FinCore — AI Contract Intelligence Platform

Upload any contract and get an instant AI-powered breakdown of risks, clauses, and financial terms — powered by **OpenAI GPT-4o**. FinCore is a complete platform for contract analysis, comparison, and lifecycle tracking.

---

## ✨ What It Does

| Step | What happens |
|------|-------------|
| ① **Sign Up / Sign In** | Create an account to access the platform. |
| ② **Paste or Upload** | Paste contract text, or upload a `.txt`, `.pdf`, `.docx`, `.png`, `.jpg`, or `.webp` file. |
| ③ **Choose Focus Areas** | Select which aspects to prioritize: Risk Flags, Financial Terms, Obligations, Exit Clauses, Penalties, or IP & Ownership. |
| ④ **Analyze** | GPT-4o reads the contract and returns a structured analysis. |
| ⑤ **Chat & Translate** | Ask follow-up questions about the contract or translate the summary into Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, or Simple English. |
| ⑥ **Compare Contracts** | Upload two contracts side-by-side. The AI evaluates them against custom criteria and picks a recommended "Winner". |
| ⑦ **Track Lifecycles** | Manage active contracts, renewal dates, and deadlines in the Contract Tracker dashboard. |
| ⑧ **Download Report** | Export the full analysis as a formatted Word document (`.docx`). |

---

## 🔍 What the AI Analyzes (Risk & Clauses)

When a contract is analyzed, GPT-4o scans the document and provides a highly structured output:

*   **Overall Risk Score:** A score from 0 to 100 categorized as *Low*, *Medium*, or *High* risk.
*   **⚠ Risk Flags:** Highlights unusual clauses, heavily one-sided terms, and vague language.
*   **◈ Financial Terms:** Extracts all payment amounts, hidden fees, revenue shares, and cost structures.
*   **≡ Obligations:** Clearly lists exactly what each party is legally required to do.
*   **⊘ Exit Clauses:** Explains termination conditions, notice periods, and cancellation difficulty.
*   **▲ Penalties:** Identifies late fees, breach of contract consequences, and financial damages.
*   **◉ IP & Ownership:** Clarifies who owns the intellectual property, work products, and data.
*   **💡 Actionable Recommendation:** A final plain-English summary advising you on whether to sign, renegotiate, or walk away.

---

## 💳 Plans & Limits

| Plan | Analyses | Price |
|------|----------|-------|
| **Free** | 3 total | ₹0 |
| **Pro** | 50 / month | ₹499 / month |
| **Enterprise** | Unlimited | ₹1,999 / month |

Upgrades are processed securely via **Razorpay**. Users must complete payment before their plan is updated.

---

## 📁 Project Structure

```plaintext
FinCore/
│
├── backend/                   # Express.js API
│   ├── server.js              # Auth, JWT, usage limits, AI proxy, Razorpay
│   ├── db.json                # Auto-generated database (users + plans)
│   ├── package.json           
│   └── .env.example           # Environment variable template
│
├── frontend/                  # React Application
│   ├── public/
│   │   └── index.html         
│   ├── src/
│   │   ├── components/        
│   │   │   ├── Navbar.jsx        # Navigation & Theme Toggle
│   │   │   ├── InputPanel.jsx    # Upload + text input
│   │   │   ├── Results.jsx       # Risk, clauses, financials
│   │   │   ├── ComparePanel.jsx  # AI Contract comparison UI
│   │   │   ├── TrackerPanel.jsx  # Lifecycle tracking dashboard
│   │   │   ├── Chatbot.jsx       # Contract Q&A chatbot
│   │   │   ├── Translator.jsx    # Multilingual panel
│   │   │   ├── Login.jsx         # Authentication page
│   │   │   └── Pricing.jsx       # Pricing + Razorpay
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state
│   │   ├── utils/
│   │   │   ├── api.js            # API calls + PDF extraction
│   │   │   ├── auth.js           # Auth utilities
│   │   │   └── downloadReport.js # DOCX generation
│   │   └── styles/
│   │       └── global.css        # CSS variables, layout, light/dark mode
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup & Running Locally

Because FinCore is a full-stack app, you need **two terminals** running at the same time.

### Prerequisites
- [Node.js](https://nodejs.org/) v16 or higher
- An [OpenAI API key](https://platform.openai.com/api-keys) (GPT-4o access required)
- A [Razorpay account](https://razorpay.com) for payment processing (free test mode available)

---

### Backend Setup (Terminal 1)

**1. Go to the backend folder**
```bash
cd backend
npm install
```

**2. Create your `.env` file**
```bash
cp .env.example .env
```
Open `.env` and fill in your values:
```env
JWT_SECRET=any_long_random_string_you_make_up
PORT=4001
FRONTEND_ORIGIN=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

**3. Start the backend**
```bash
node server.js
```
*You should see: `FinCore backend running on port 4001`*

---

### Frontend Setup (Terminal 2)

**1. Go to the frontend folder**
```bash
cd frontend
npm install
```

**2. Start the frontend**
```bash
npm start
```
*Opens at **http://localhost:3000***

> **Note on PDFs:** PDFs are extracted in-browser using `pdfjs-dist`. Scanned or image-based PDFs cannot be extracted — upload them as an image (`.png`, `.jpg`) instead.

---

## 📝 Editing Guide

| What you want to change | File to edit |
|---|---|
| Contract Comparison Logic | `frontend/src/components/ComparePanel.jsx` |
| Contract Tracker UI | `frontend/src/components/TrackerPanel.jsx` |
| AI system prompt / model | `backend/server.js` & `frontend/src/utils/api.js` |
| Risk meter, clauses, financials UI | `frontend/src/components/Results.jsx` |
| Download report formatting | `frontend/src/utils/downloadReport.js` |
| Pricing plans and amounts | `frontend/src/components/Pricing.jsx` |
| Auth pages | `frontend/src/components/Login.jsx` |
| Light/Dark Theme & Colors | `frontend/src/styles/global.css` |
| User database & API routes | `backend/server.js` |

---

## 🛠️ Troubleshooting

**"Failed to fetch" on login or register**
→ The backend is not running. Open a second terminal, go to `backend/`, and run `node server.js`.

**AI returns Mock Data / "API key not configured"**
→ The app now proxies OpenAI through the backend. Ensure your `OPENAI_API_KEY` is set in the **`backend/.env`** file.

**"Setting up fake worker failed" on PDF upload**
→ Run `npm install pdfjs-dist@3.11.174` inside the `frontend/` folder. The version must be exactly `3.11.174`.

**PDF shows no text extracted**
→ The PDF is likely scanned or image-based. Convert it to a `.png` or `.jpg` and upload as an image instead.

**"receipt: the length must be no more than 40" on payment**
→ Update the receipt line in `backend/server.js` to: `receipt: uuid().slice(0, 40)`

**Analysis returns null / "Failed to parse"**
→ The model response wasn't valid JSON. This can happen if the contract text is very short or garbled. Try a longer, cleaner input.

**Port already in use error on backend**
→ Change `PORT=4001` in `backend/.env` and update `REACT_APP_API_BASE=http://localhost:4001/api` in `frontend/.env`.