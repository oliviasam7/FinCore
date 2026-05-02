import React, { useState, useRef } from "react";
import { analyzeContract, readFileAsText } from "../utils/api";
import { apiUseAnalysis } from "../utils/auth";

const styles = `
/* ── Page header ── */
.cp-header { margin-bottom: 32px; animation: cpFadeUp .4s ease both; }
.cp-eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--accent); letter-spacing: 2px; text-transform: uppercase;
  margin-bottom: 8px; display: flex; align-items: center; gap: 8px;
}
.cp-eyebrow::before { content: ''; width: 20px; height: 1px; background: var(--accent); }
.cp-title { font-family: 'Instrument Serif', serif; font-size: 32px; font-style: italic; margin-bottom: 6px; }
.cp-sub   { font-size: 13px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }

/* ── Upload row ── */
.cp-upload-row {
  display: grid; grid-template-columns: 1fr 48px 1fr; gap: 0;
  align-items: start; margin-bottom: 28px;
  animation: cpFadeUp .4s ease .1s both;
}
.cp-vs {
  display: flex; align-items: center; justify-content: center;
  height: 140px; font-family: 'Instrument Serif', serif;
  font-size: 18px; font-style: italic; color: var(--muted);
}
.cp-slot {
  border: 1.5px dashed var(--border2); background: var(--surface);
  padding: 28px 20px; text-align: center; cursor: pointer;
  transition: all .2s; position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.cp-slot::before, .cp-slot::after {
  content: '';
  position: absolute; width: 12px; height: 12px;
  border-color: var(--border2); border-style: solid;
  transition: border-color .2s, width .2s, height .2s;
}
.cp-slot::before { top: 6px; left: 6px; border-width: 1px 0 0 1px; }
.cp-slot::after  { bottom: 6px; right: 6px; border-width: 0 1px 1px 0; }
.cp-slot:hover::before, .cp-slot:hover::after { border-color: var(--accent); width: 18px; height: 18px; }
.cp-slot:hover {
  border-color: var(--accent); background: rgba(0,212,255,0.02);
  box-shadow: 0 0 20px rgba(0,212,255,0.06);
}
.cp-slot-icon { font-size: 28px; transition: transform .2s; }
.cp-slot:hover .cp-slot-icon { transform: scale(1.1) translateY(-3px); }
.cp-slot-title { font-size: 13px; font-weight: 600; color: var(--text); }
.cp-slot-sub   { font-size: 11px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
.cp-file-pill {
  display: inline-block; padding: 4px 12px; border-radius: 99px;
  background: rgba(0,212,255,0.1); color: var(--accent);
  border: 1px solid rgba(0,212,255,0.3);
  font-size: 11px; font-family: 'JetBrains Mono', monospace;
  max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* ── Criteria row ── */
.cp-criteria {
  margin-bottom: 24px; animation: cpFadeUp .4s ease .2s both;
}
.cp-criteria-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 2px; text-transform: uppercase; color: var(--muted);
  margin-bottom: 10px;
}
.cp-criteria-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.cp-crit {
  padding: 7px 14px; border: 1px solid var(--border2);
  background: var(--surface); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all .15s; color: var(--muted);
  user-select: none;
}
.cp-crit:hover { border-color: var(--accent); color: var(--text); }
.cp-crit.on {
  border-color: var(--accent); background: rgba(0,212,255,0.08);
  color: var(--accent);
}

/* ── Analyse button ── */
.cp-btn {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 32px; background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #000; border: none; font-family: 'Syne', sans-serif; font-size: 15px;
  font-weight: 800; cursor: pointer; margin-bottom: 36px;
  clip-path: polygon(12px 0%,100% 0%,100% calc(100% - 12px),calc(100% - 12px) 100%,0% 100%,0% 12px);
  transition: opacity .15s, transform .1s, box-shadow .2s;
  position: relative; overflow: hidden;
}
.cp-btn::before {
  content: '';
  position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left .4s ease;
}
.cp-btn:hover:not(:disabled)::before { left: 100%; }
.cp-btn:hover:not(:disabled) { box-shadow: 0 0 28px rgba(0,212,255,0.3); transform: translateY(-1px); }
.cp-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* ── Spinner ── */
.cp-spin {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(0,0,0,0.2); border-top-color: #000;
  animation: cpSpin .7s linear infinite; display: inline-block; flex-shrink: 0;
}
@keyframes cpSpin { to { transform: rotate(360deg); } }

/* ── Error ── */
.cp-error {
  padding: 12px 16px; margin-bottom: 20px;
  background: rgba(255,77,77,0.07); border: 1px solid rgba(255,77,77,0.3);
  color: var(--red); font-size: 13px; font-family: 'JetBrains Mono', monospace;
}

/* ── Results ── */
.cp-results { animation: cpFadeUp .4s ease both; }

/* Winner banner */
.cp-winner {
  padding: 24px 28px; margin-bottom: 28px;
  border: 1px solid rgba(0,230,118,0.3);
  background: rgba(0,230,118,0.05);
  display: flex; align-items: center; gap: 20px;
  position: relative; overflow: hidden;
}
.cp-winner::before {
  content: '';
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 3px; background: var(--green);
}
.cp-winner-trophy { font-size: 36px; }
.cp-winner-text {}
.cp-winner-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--green); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px;
}
.cp-winner-name   { font-family: 'Instrument Serif', serif; font-size: 24px; font-style: italic; }
.cp-winner-reason { font-size: 13px; color: var(--muted); margin-top: 4px; font-family: 'JetBrains Mono', monospace; line-height: 1.6; }

/* Comparison table */
.cp-table-wrap { overflow-x: auto; margin-bottom: 28px; }
table.cp-table {
  width: 100%; border-collapse: collapse;
  font-size: 13px; font-family: 'JetBrains Mono', monospace;
}
.cp-table th {
  padding: 12px 16px; text-align: left;
  background: var(--surface); border: 1px solid var(--border2);
  font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted);
  font-weight: 600;
}
.cp-table th.col-a { color: var(--accent); }
.cp-table th.col-b { color: var(--gold); }
.cp-table td {
  padding: 12px 16px; border: 1px solid var(--border);
  vertical-align: top; color: var(--text); line-height: 1.5;
  transition: background .15s;
}
.cp-table tr:hover td { background: rgba(255,255,255,0.02); }
.cp-table td.metric { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
.cp-table td.winner-a { background: rgba(0,212,255,0.04); }
.cp-table td.winner-b { background: rgba(240,180,41,0.04); }

/* Scores row */
.cp-scores {
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 28px;
}
.cp-score-card {
  background: var(--surface); border: 1px solid var(--border2);
  padding: 20px 24px; position: relative; overflow: hidden;
  transition: border-color .2s;
}
.cp-score-card:hover { border-color: rgba(0,212,255,0.2); }
.cp-score-card-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px;
}
.cp-score-num {
  font-family: 'Instrument Serif', serif; font-size: 48px; line-height: 1;
}
.cp-score-level {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  margin-top: 6px; letter-spacing: 1px; text-transform: uppercase;
}
.cp-score-bar-track { height: 4px; background: var(--border); margin-top: 12px; }
.cp-score-bar-fill  { height: 4px; transition: width 1.2s cubic-bezier(.4,0,.2,1); }

@keyframes cpFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
`;

const CRITERIA = [
  { id: "cost",        label: "💰 Cost & Payments" },
  { id: "penalties",   label: "▲ Penalties" },
  { id: "termination", label: "⊘ Exit Clauses" },
  { id: "duration",    label: "⏱ Duration / Lock-in" },
  { id: "ip",          label: "◉ IP & Ownership" },
  { id: "risks",       label: "⚠ Risk Flags" },
];

const COMPARISON_PROMPT = (textA, nameA, textB, nameB, criteria) => `
You are a contract comparison expert. Compare these two contracts and determine which is better.

CONTRACT A (${nameA}):
${textA.slice(0, 25000)}

CONTRACT B (${nameB}):
${textB.slice(0, 25000)}

Focus criteria: ${criteria.join(", ")}

Return ONLY valid JSON in this exact format:
{
  "winner": "<A|B>",
  "winnerName": "<${nameA}|${nameB}>",
  "winnerReason": "<2-sentence plain English explanation of why this contract is better>",
  "comparison": [
    { "metric": "<metric name>", "contractA": "<value or description>", "contractB": "<value or description>", "better": "<A|B|tie>" }
  ],
  "scoreA": <integer 0-100, lower=better/less risky>,
  "riskLevelA": "<Low|Medium|High>",
  "scoreB": <integer 0-100, lower=better/less risky>,
  "riskLevelB": "<Low|Medium|High>",
  "summaryA": "<1-sentence summary of contract A>",
  "summaryB": "<1-sentence summary of contract B>"
}
`;

export default function ComparePanel({ token, user, onLogin }) {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const refA = useRef(); const refB = useRef();

  const [criteria, setCriteria] = useState(["cost", "penalties", "termination", "risks"]);
  const toggleCrit = (id) => setCriteria(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState("");
  const [result,  setResult ] = useState(null);

  const canCompare = (fileA || textA.trim().length > 40) &&
                     (fileB || textB.trim().length > 40) &&
                     criteria.length > 0 && !loading;

  async function handleFile(file, setter, textSetter) {
    setter(file);
    try {
      const t = await readFileAsText(file);
      textSetter(t);
    } catch {}
  }

  async function handleCompare() {
    if (!user) { onLogin(); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const key = process.env.REACT_APP_OPENAI_API_KEY;
      if (!key) throw new Error("API key not configured.");

      const nameA = fileA?.name || "Contract A";
      const nameB = fileB?.name || "Contract B";
      const critLabels = criteria.map(c => CRITERIA.find(x => x.id === c)?.label.replace(/[^\w\s]/g, "").trim() || c);

      const prompt = COMPARISON_PROMPT(textA, nameA, textB, nameB, critLabels);

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: "gpt-4o", max_tokens: 2000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "API error");

      const raw = data.choices[0].message.content;
      const m = raw.match(/```json\s*([\s\S]*?)\s*```/) || raw.match(/(\{[\s\S]*\})/);
      if (!m) throw new Error("Could not parse comparison result.");
      const parsed = JSON.parse(m[1]);
      setResult({ ...parsed, nameA, nameB });
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  const riskColor = (l) => l === "Low" ? "var(--green)" : l === "Medium" ? "var(--gold)" : "var(--red)";

  return (
    <>
      <style>{styles}</style>

      <div className="cp-header">
        <div className="cp-eyebrow">New Feature</div>
        <div className="cp-title">Contract Comparison</div>
        <div className="cp-sub">Upload two contracts — AI will score them side-by-side and pick the winner.</div>
      </div>

      {/* Upload slots */}
      <div className="cp-upload-row">
        <div>
          <input ref={refA} type="file" accept=".txt,.pdf" style={{ display: "none" }}
            onChange={e => e.target.files[0] && handleFile(e.target.files[0], setFileA, setTextA)} />
          <div className="cp-slot" onClick={() => refA.current?.click()}>
            <div className="cp-slot-icon">{fileA ? "📄" : "📂"}</div>
            <div className="cp-slot-title">{fileA ? "Contract A loaded" : "Upload Contract A"}</div>
            {fileA
              ? <div className="cp-file-pill">{fileA.name}</div>
              : <div className="cp-slot-sub">PDF or TXT · Click or drop</div>}
          </div>
          {!fileA && (
            <textarea
              style={{ width: "100%", marginTop: 8, background: "var(--surface)", border: "1px solid var(--border2)", color: "var(--text)", padding: "10px 12px", fontSize: 12, fontFamily: "'JetBrains Mono',monospace", resize: "vertical", minHeight: 80, outline: "none" }}
              placeholder="…or paste contract A text here"
              value={textA}
              onChange={e => setTextA(e.target.value)}
            />
          )}
        </div>

        <div className="cp-vs">vs</div>

        <div>
          <input ref={refB} type="file" accept=".txt,.pdf" style={{ display: "none" }}
            onChange={e => e.target.files[0] && handleFile(e.target.files[0], setFileB, setTextB)} />
          <div className="cp-slot" onClick={() => refB.current?.click()}>
            <div className="cp-slot-icon">{fileB ? "📄" : "📂"}</div>
            <div className="cp-slot-title">{fileB ? "Contract B loaded" : "Upload Contract B"}</div>
            {fileB
              ? <div className="cp-file-pill">{fileB.name}</div>
              : <div className="cp-slot-sub">PDF or TXT · Click or drop</div>}
          </div>
          {!fileB && (
            <textarea
              style={{ width: "100%", marginTop: 8, background: "var(--surface)", border: "1px solid var(--border2)", color: "var(--text)", padding: "10px 12px", fontSize: 12, fontFamily: "'JetBrains Mono',monospace", resize: "vertical", minHeight: 80, outline: "none" }}
              placeholder="…or paste contract B text here"
              value={textB}
              onChange={e => setTextB(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* Criteria */}
      <div className="cp-criteria">
        <div className="cp-criteria-label">Compare by</div>
        <div className="cp-criteria-grid">
          {CRITERIA.map(c => (
            <div key={c.id} className={`cp-crit ${criteria.includes(c.id) ? "on" : ""}`}
              onClick={() => toggleCrit(c.id)}>{c.label}</div>
          ))}
        </div>
      </div>

      {error && <div className="cp-error">⚠ {error}</div>}

      <button className="cp-btn" onClick={handleCompare} disabled={!canCompare}>
        {loading ? <><span className="cp-spin" /> Comparing contracts…</> : "Compare Contracts →"}
      </button>

      {/* Results */}
      {result && (
        <div className="cp-results">

          {/* Scores */}
          <div className="cp-scores">
            {[
              { name: result.nameA, score: result.scoreA, level: result.riskLevelA, summary: result.summaryA, isWinner: result.winner === "A" },
              { name: result.nameB, score: result.scoreB, level: result.riskLevelB, summary: result.summaryB, isWinner: result.winner === "B" },
            ].map((c, i) => (
              <div key={i} className="cp-score-card" style={{ borderColor: c.isWinner ? "rgba(0,230,118,0.4)" : undefined }}>
                {c.isWinner && <div style={{ position: "absolute", top: 10, right: 12, fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "var(--green)", letterSpacing: 1 }}>✓ WINNER</div>}
                <div className="cp-score-card-label">{c.name}</div>
                <div className="cp-score-num" style={{ color: riskColor(c.level) }}>{c.score}</div>
                <div className="cp-score-level" style={{ color: riskColor(c.level) }}>{c.level} Risk</div>
                <div className="cp-score-bar-track">
                  <div className="cp-score-bar-fill" style={{
                    width: `${c.score}%`,
                    background: c.level === "Low" ? "var(--green)" : c.level === "Medium" ? "var(--gold)" : "var(--red)"
                  }} />
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 10, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.5 }}>{c.summary}</div>
              </div>
            ))}
          </div>

          {/* Winner banner */}
          <div className="cp-winner">
            <div className="cp-winner-trophy">🏆</div>
            <div className="cp-winner-text">
              <div className="cp-winner-label">Recommended Contract</div>
              <div className="cp-winner-name">{result.winnerName}</div>
              <div className="cp-winner-reason">{result.winnerReason}</div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="cp-table-wrap">
            <table className="cp-table">
              <thead>
                <tr>
                  <th style={{ width: "22%" }}>Metric</th>
                  <th className="col-a">{result.nameA}</th>
                  <th className="col-b">{result.nameB}</th>
                </tr>
              </thead>
              <tbody>
                {result.comparison?.map((row, i) => (
                  <tr key={i}>
                    <td className="metric">{row.metric}</td>
                    <td className={row.better === "A" ? "winner-a" : ""}>
                      {row.better === "A" && <span style={{ color: "var(--green)", marginRight: 6 }}>✓</span>}
                      {row.contractA}
                    </td>
                    <td className={row.better === "B" ? "winner-b" : ""}>
                      {row.better === "B" && <span style={{ color: "var(--gold)", marginRight: 6 }}>✓</span>}
                      {row.contractB}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </>
  );
}