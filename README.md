# FinCore — AI-Powered Contract & Financial Intelligence Platform

Upload any contract and get an instant AI-powered breakdown of risks, clauses, and financial terms — powered by **Claude (Anthropic API)**.

---

##  Why This Project Matters

Contract analysis in real-world businesses is:

* Manual and time-consuming
* Prone to human error
* Difficult to standardize across teams

**FinCore solves this by:**

* Automating contract understanding using AI
* Providing instant and consistent risk scoring
* Converting complex legal language into simple insights

 **Use Cases:**

* Startups reviewing agreements quickly
* Legal teams speeding up contract evaluation
* Businesses minimizing financial and legal risks

---

##  Unique Selling Points (USP)

*  Real-time AI contract analysis (~10–15 seconds)
*  Focus-based analysis (user selects priority areas)
*  Structured JSON output (easy for integration)
*  Powered by Claude AI for advanced language understanding
*  Supports both text and image-based contracts

---

##  What It Does

| Step                 | What happens                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------- |
| ① Paste or Upload    | Paste contract text or upload `.txt`, `.pdf`, `.docx`, `.png`, `.jpg`, `.webp`              |
| ② Choose Focus Areas | Select Risk Flags, Financial Terms, Obligations, Exit Clauses, Penalties, or IP & Ownership |
| ③ Analyze            | Claude processes and returns structured JSON                                                |
| ④ View Results       | Risk score, clause breakdown, financial insights, and recommendation                        |

---

##  Risk Scoring Explained

The platform assigns a **risk score (0–100)** based on:

* Presence of unfavorable clauses
* Financial liabilities
* Penalties and exit conditions
* Ambiguity in obligations

**Interpretation:**

*  0–30 → Low Risk
*  31–70 → Medium Risk
*  71–100 → High Risk

This enables quick, informed decision-making.

---

##  System Architecture

1. User inputs contract (text or file)
2. Frontend processes and prepares data
3. Data sent to Anthropic API (Claude)
4. AI analyzes using prompt engineering
5. Structured JSON response generated
6. UI displays:

   * Risk Score
   * Clause Analysis
   * Financial Data
   * Recommendation

---

##  Key Concepts Used

* Natural Language Processing (NLP)
* Prompt Engineering
* Text Classification
* Risk Analysis Models
* Data Extraction Techniques

---

##  Tech Stack

* **Frontend:** React.js, HTML, CSS, JavaScript
* **Backend/API Handling:** JavaScript (Fetch API)
* **AI Engine:** Claude (Anthropic API)
* **File Processing:** Text extraction & base64 encoding

---

##  Project Structure

```
fincore/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── index.js
│   ├── styles/
│   │   └── global.css
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── InputPanel.jsx
│   │   ├── ResultsPanel.jsx
│   │   ├── Results.jsx
│   │   └── Footer.jsx
│   └── utils/
│       ├── api.js
│       └── constants.js
└── package.json
```

---

##  Setup & Installation

### Prerequisites

* Node.js (v16 or higher)
* Anthropic API Key

### Steps

**1. Install dependencies**

```bash
npm install
```

**2. Add API key**

Create `.env` file in root:

```
REACT_APP_ANTHROPIC_KEY=your_api_key_here
```

Update headers in `src/utils/api.js`:

```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",
}
```

**3. Run the app**

```bash
npm start
```

App runs at: **http://localhost:3000**

---



##  How to Use

1. Paste contract text OR upload a file
2. Select at least one focus area
3. Click **Analyze Contract →**
4. View:

   * Risk score
   * Clause breakdown
   * Financial insights
   * Final recommendation

>  **Note:**
> Image files are processed as vision inputs.
> Text-based files are parsed directly.

---

##  Security Note

* API key stored securely in environment variables
* No contract data stored permanently
* All analysis happens in real-time

---

##  Editing Guide

| Task          | File             |
| ------------- | ---------------- |
| Navbar / Logo | `Navbar.jsx`     |
| Hero Section  | `Hero.jsx`       |
| Input Panel   | `InputPanel.jsx` |
| Focus Options | `constants.js`   |
| AI Logic      | `api.js`         |
| Results UI    | `Results.jsx`    |
| App Flow      | `App.jsx`        |
| Styling       | `global.css`     |

---

##  Troubleshooting

**API key not working**
→ Ensure `.env` is in root & restart server

**CORS error**
→ Confirm header: `"anthropic-dangerous-direct-browser-access": "true"`

**Invalid JSON response**
→ Input may be too short or unclear

**Image not analyzed**
→ Use supported formats (`.png`, `.jpg`, `.webp`)

---

##  Future Enhancements

* Advanced AI fine-tuned contract models
* Multi-document comparison
* Real-time collaboration
* Integration with enterprise tools
* Predictive financial analytics

---




