# FinCore — AI Contract Intelligence Platform

> Upload any contract and get an instant AI-powered breakdown of risks, clauses, and financial terms — powered by GPT-4o (OpenAI API).

---

## What It Does

FinCore is a React web app that lets you drop in a contract — as text, PDF, DOCX, or an image — and get back a structured plain-language analysis in seconds. It also lets you chat with the AI about the contract and translate the summary into Indian regional languages or simplified English.

| Step | What happens |
|------|--------------|
| ① Paste or Upload | Paste contract text, or upload a `.txt`, `.pdf`, `.docx`, `.png`, `.jpg`, or `.webp` file |
| ② Choose Focus Areas | Select which aspects to prioritize: Risk Flags, Financial Terms, Obligations, Exit Clauses, Penalties, or IP & Ownership |
| ③ Analyze | GPT-4o reads the contract and returns a structured JSON analysis |
| ④ View Results | Risk score (0–100), plain-language clause breakdown, financial figures, and an actionable recommendation |
| ⑤ Chat | Ask follow-up questions about the contract via the built-in chatbot |
| ⑥ Translate | Translate the summary into Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, or Simple English |

---

## Project Structure

```
FinCore-main/
├── documents/                        # Project planning docs
│   ├── AI PROJECT.pptx
│   ├── Customer Interview Document.docx
│   ├── Problem Definition Document.docx
│   └── PRS GL.docx
└── fincore/                          # React application
    ├── public/
    │   └── index.html                # HTML shell
    ├── src/
    │   ├── App.jsx                   # Root component — state & orchestration
    │   ├── index.js                  # React entry point
    │   ├── styles/
    │   │   └── global.css            # CSS variables, grid background, responsive rules
    │   ├── components/
    │   │   ├── Navbar.jsx            # Top navigation bar
    │   │   ├── Hero.jsx              # Hero headline section
    │   │   ├── InputPanel.jsx        # Left panel: input tabs, textarea, dropzone, focus toggles, analyze button
    │   │   ├── ResultsPanel.jsx      # Right panel: idle / loading / results states
    │   │   ├── Results.jsx           # Risk meter, clause cards, financials grid, recommendation block
    │   │   ├── Chatbot.jsx           # Chat interface for follow-up Q&A on the contract
    │   │   ├── Translator.jsx        # Translate contract summary into regional languages
    │   │   └── Footer.jsx            # Footer with disclaimer
    │   └── utils/
    │       ├── api.js                # Anthropic API calls, JSON parsing, file reading helpers
    │       └── constants.js          # Focus area options, model name
    └── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| Bundler | Create React App (react-scripts 5) |
| AI Backend | OpenAI API — GPT-4o (direct browser calls) |
| Styling | Custom CSS with variables (no UI library) |
| File Parsing | Native browser `FileReader` API |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- An [OpenAI API key](https://platform.openai.com/api-keys) (paid tier required for GPT-4o)

---

## Setup & Running Locally

**1. Clone or unzip the project and navigate into the app folder**
```bash
cd fincore
```

**2. Install dependencies**
```bash
npm install
```

**3. Add your OpenAI API key**

Create a `.env` file in the `fincore/` directory:
```
REACT_APP_OPENAI_KEY=your_api_key_here
```

Then open `src/utils/api.js` and make sure the `fetch` call targets the OpenAI endpoint with these headers:
```js
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
  },
  body: JSON.stringify({
    model: "gpt-4o",
    messages: [ /* your messages array */ ],
  }),
});
```

**4. Start the development server**
```bash
npm start
```

Opens at **http://localhost:3000**

**5. Build for production**
```bash
npm run build
```

Output goes to the `build/` folder and can be deployed to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

---

## How to Use

1. **Input your contract** — paste text directly into the textarea, or switch to the *Upload File* tab and drop in a file (`.txt`, `.pdf`, `.docx`, `.png`, `.jpg`, `.webp`)
2. **Select focus areas** — check at least one: Risk Flags, Financial Terms, Obligations, Exit Clauses, Penalties, or IP & Ownership
3. **Click Analyze Contract →** — wait ~10–15 seconds for Claude to process
4. **Browse the results** — risk score (0–100), clause-by-clause breakdown, key financial figures, and a final recommendation
5. **Chat** — use the chatbot panel to ask follow-up questions about the contract
6. **Translate** — click a language button to get the summary in Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, or Simple English

> **Note on file types:** Image files (`.png`, `.jpg`, `.webp`) are sent to Claude as base64 vision inputs. Text-based files (`.txt`, `.pdf`, `.docx`) are read as plain text. Scanned PDFs that are image-only should be converted to an image format first.

---

## Focus Areas

| Option | What it looks for |
|--------|------------------|
| ⚠ Risk Flags | Unusual clauses, one-sided terms, vague language |
| ◈ Financial Terms | Payment amounts, fees, penalties, revenue shares |
| ≡ Obligations | What each party is required to do |
| ⊘ Exit Clauses | Termination conditions and notice periods |
| ▲ Penalties | Late fees, breach consequences, damages |
| ◉ IP & Ownership | Who owns the work, data, and intellectual property |

---

## Pushing to GitHub

**First time:**
```bash
git init
git add .
git commit -m "Initial commit — FinCore contract analyzer"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fincore.git
git push -u origin main
```

**Subsequent updates:**
```bash
git add .
git commit -m "describe your change"
git push
```

> Replace `YOUR_USERNAME` with your actual GitHub username. Do **not** commit your `.env` file — add it to `.gitignore`.

---

## Editing Guide

| What you want to change | File to edit |
|-------------------------|-------------|
| Logo, nav links | `src/components/Navbar.jsx` |
| Hero headline / subtitle | `src/components/Hero.jsx` |
| Input tabs, textarea, dropzone | `src/components/InputPanel.jsx` |
| Focus area options | `src/utils/constants.js` |
| AI system prompt / model | `src/utils/api.js` |
| Risk meter, clauses, financials UI | `src/components/Results.jsx` |
| Loading / idle / done states | `src/components/ResultsPanel.jsx` |
| Chatbot interface | `src/components/Chatbot.jsx` |
| Translation feature | `src/components/Translator.jsx` |
| Footer text | `src/components/Footer.jsx` |
| Colors, fonts, CSS variables | `src/styles/global.css` |
| App-level state & flow | `src/App.jsx` |

---

