import React, { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   DocsPanel — shows the last 3 saved contract analysis reports.
   Reports are passed in from App.jsx (read from localStorage).
───────────────────────────────────────────────────────────────────────────── */

const styles = `
/* ── Page header ── */
.docs-header { margin-bottom: 32px; animation: docsFade .4s ease both; }
.docs-eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--accent); letter-spacing: 2px; text-transform: uppercase;
  margin-bottom: 8px; display: flex; align-items: center; gap: 8px;
}
.docs-eyebrow::before { content: ''; width: 20px; height: 1px; background: var(--accent); }
.docs-title { font-family: 'Instrument Serif', serif; font-size: 32px; font-style: italic; margin-bottom: 6px; }
.docs-sub   { font-size: 13px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }

/* ── Top row ── */
.docs-toprow {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px; animation: docsFade .4s ease .1s both;
}
.docs-count {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted);
}
.docs-clear {
  background: none; border: 1px solid var(--border2); color: var(--muted);
  padding: 6px 16px; font-size: 12px; font-family: 'JetBrains Mono', monospace;
  cursor: pointer; transition: all .15s;
}
.docs-clear:hover { border-color: var(--red); color: var(--red); }

/* ── Report cards ── */
.docs-list { display: flex; flex-direction: column; gap: 20px; }

.doc-card {
  background: var(--surface); border: 1px solid var(--border2);
  overflow: hidden;
  animation: docsFadeUp .4s ease both;
  transition: border-color .2s;
}
.doc-card:nth-child(1) { animation-delay: 0s; }
.doc-card:nth-child(2) { animation-delay: .08s; }
.doc-card:nth-child(3) { animation-delay: .16s; }
.doc-card:hover { border-color: rgba(0,212,255,0.2); }

/* Card header */
.doc-card-head {
  padding: 18px 22px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  background: var(--surface2); cursor: pointer; user-select: none;
  transition: background .15s;
}
.doc-card-head:hover { background: rgba(0,212,255,0.03); }
.doc-card-head-left { display: flex; align-items: center; gap: 14px; }

.doc-index {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--accent); border: 1px solid rgba(0,212,255,0.25);
  padding: 3px 9px; letter-spacing: 1px;
}
.doc-filename { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
.doc-meta     { font-size: 11px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }

.doc-risk-pill {
  padding: 4px 14px; font-size: 10px; font-weight: 700;
  font-family: 'JetBrains Mono', monospace; letter-spacing: 1.5px; text-transform: uppercase;
  flex-shrink: 0;
}
.pill-low  { background: rgba(0,230,118,0.1); color: var(--green); border: 1px solid rgba(0,230,118,0.3); }
.pill-med  { background: rgba(240,180,41,0.1); color: var(--gold);  border: 1px solid rgba(240,180,41,0.3); }
.pill-high { background: rgba(255,77,77,0.1);  color: var(--red);   border: 1px solid rgba(255,77,77,0.3); }

.doc-score {
  font-family: 'Instrument Serif', serif; font-size: 36px; line-height: 1;
  flex-shrink: 0; margin-left: 8px;
}

.doc-toggle {
  font-size: 12px; color: var(--muted); margin-left: 12px;
  transition: transform .3s ease, color .2s;
}
.doc-toggle.open { transform: rotate(180deg); color: var(--accent); }

/* Card body */
.doc-card-body { padding: 22px 22px; animation: docsFade .3s ease both; }

/* Risk bar */
.doc-bar-track { height: 4px; background: var(--border); margin-bottom: 18px; }
.doc-bar-fill  {
  height: 4px;
  animation: docsBarGrow 1.2s cubic-bezier(.4,0,.2,1) both;
}
@keyframes docsBarGrow { from { width: 0%; } }

/* Summary */
.doc-section-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 2px; text-transform: uppercase; color: var(--muted);
  margin-bottom: 10px; display: flex; align-items: center; gap: 8px;
}
.doc-section-label::before {
  content: ''; display: inline-block; width: 14px; height: 1px; background: var(--accent);
}
.doc-summary {
  font-size: 13px; color: #b0bec5; line-height: 1.75;
  font-family: 'JetBrains Mono', monospace; margin-bottom: 20px;
}

/* Clauses */
.doc-clauses { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.doc-clause {
  border-left: 2px solid var(--border2); padding: 10px 14px;
  background: var(--surface2); transition: transform .2s;
}
.doc-clause:hover { transform: translateX(3px); }
.doc-clause.risk     { border-left-color: var(--red); }
.doc-clause.positive { border-left-color: var(--green); }
.doc-clause.neutral  { border-left-color: var(--accent); }
.doc-clause-tag {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 1px; text-transform: uppercase; margin-bottom: 3px;
}
.tag-risk { color: var(--red); }
.tag-pos  { color: var(--green); }
.tag-neu  { color: var(--accent); }
.doc-clause-text { font-size: 12px; color: #b0bec5; line-height: 1.6; }

/* Financials */
.doc-fin-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px; margin-bottom: 20px;
}
.doc-fin-item {
  background: var(--surface2); border: 1px solid var(--border); padding: 12px 14px;
  transition: border-color .15s;
}
.doc-fin-item:hover { border-color: rgba(0,212,255,0.2); }
.doc-fin-label { font-size: 10px; color: var(--muted); font-family: 'JetBrains Mono', monospace; margin-bottom: 4px; }
.doc-fin-val   { font-family: 'Instrument Serif', serif; font-size: 18px; color: var(--text); }
.doc-fin-note  { font-size: 11px; color: var(--muted); margin-top: 3px; font-family: 'JetBrains Mono', monospace; }

/* Recommendation */
.doc-rec {
  background: rgba(0,212,255,0.04); border: 1px solid rgba(0,212,255,0.15);
  padding: 16px 18px; margin-bottom: 18px;
}
.doc-rec-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--accent); letter-spacing: 1.5px; text-transform: uppercase;
  margin-bottom: 8px;
}
.doc-rec-text { font-size: 13px; color: #b0bec5; line-height: 1.75; font-family: 'JetBrains Mono', monospace; }

/* Download button */
.doc-download-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #000; border: none; padding: 10px 22px;
  font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800;
  cursor: pointer; letter-spacing: 0.5px;
  clip-path: polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px);
  transition: opacity .2s, box-shadow .2s;
  position: relative; overflow: hidden;
}
.doc-download-btn::before {
  content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
  transition: left .4s ease;
}
.doc-download-btn:hover::before { left: 100%; }
.doc-download-btn:hover { opacity: .9; box-shadow: 0 0 16px rgba(0,212,255,0.25); }

/* ── Empty state ── */
.docs-empty {
  text-align: center; padding: 100px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  animation: docsFade .4s ease both;
}
.docs-empty-glyph { font-size: 56px; opacity: .12; filter: grayscale(1); }
.docs-empty-title { font-family: 'Instrument Serif', serif; font-size: 22px; font-style: italic; color: var(--muted); }
.docs-empty-sub   { font-size: 12px; color: var(--muted); font-family: 'JetBrains Mono', monospace; max-width: 280px; line-height: 1.6; }

@keyframes docsFade    { from { opacity: 0; } to { opacity: 1; } }
@keyframes docsFadeUp  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
`;

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return iso; }
}

function riskColor(level) {
  return level === "Low" ? "var(--green)" : level === "Medium" ? "var(--gold)" : "var(--red)";
}

function ReportCard({ report, index }) {
  const [open, setOpen] = useState(index === 0); // first card open by default

  const pillClass = report.riskLevel === "Low" ? "pill-low" : report.riskLevel === "Medium" ? "pill-med" : "pill-high";
  const barColor  = report.riskLevel === "Low" ? "var(--green)" : report.riskLevel === "Medium" ? "var(--gold)" : "var(--red)";

  async function handleDownload() {
    try {
      const { downloadReport } = await import("../utils/downloadReport");
      await downloadReport(report);
    } catch (err) {
      alert("Download failed: " + err.message);
    }
  }

  return (
    <div className="doc-card">
      {/* Header — always visible, click to expand */}
      <div className="doc-card-head" onClick={() => setOpen(o => !o)}>
        <div className="doc-card-head-left">
          <span className="doc-index">#{index + 1}</span>
          <div>
            <div className="doc-filename">{report.filename}</div>
            <div className="doc-meta">Analyzed {formatDate(report.savedAt)}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className={`doc-risk-pill ${pillClass}`}>{report.riskLevel} Risk</span>
          <span className="doc-score" style={{ color: riskColor(report.riskLevel) }}>{report.riskScore}</span>
          <span className={`doc-toggle ${open ? "open" : ""}`}>▼</span>
        </div>
      </div>

      {/* Body — collapsible */}
      {open && (
        <div className="doc-card-body">

          {/* Risk bar */}
          <div className="doc-bar-track">
            <div className="doc-bar-fill" style={{ width: `${report.riskScore}%`, background: barColor }} />
          </div>

          {/* Summary */}
          <div className="doc-section-label">Summary</div>
          <div className="doc-summary">{report.summary}</div>

          {/* Clauses */}
          {report.clauses?.length > 0 && (
            <>
              <div className="doc-section-label">Key Clauses</div>
              <div className="doc-clauses">
                {report.clauses.map((c, i) => (
                  <div key={i} className={`doc-clause ${c.type}`}>
                    <div className={`doc-clause-tag ${c.type === "risk" ? "tag-risk" : c.type === "positive" ? "tag-pos" : "tag-neu"}`}>
                      {c.type === "risk" ? "⚠ " : c.type === "positive" ? "✓ " : "→ "}{c.tag}
                    </div>
                    <div className="doc-clause-text">{c.text}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Financials */}
          {report.financials?.length > 0 && (
            <>
              <div className="doc-section-label">Financial Breakdown</div>
              <div className="doc-fin-grid">
                {report.financials.map((f, i) => (
                  <div key={i} className="doc-fin-item">
                    <div className="doc-fin-label">{f.label}</div>
                    <div className="doc-fin-val">{f.value}</div>
                    {f.note && <div className="doc-fin-note">{f.note}</div>}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Recommendation */}
          {report.recommendation && (
            <div className="doc-rec">
              <div className="doc-rec-label">FinCore Recommendation</div>
              <div className="doc-rec-text">{report.recommendation}</div>
            </div>
          )}

          {/* Download */}
          <button className="doc-download-btn" onClick={handleDownload}>
            ↓ Download Report
          </button>

        </div>
      )}
    </div>
  );
}

export default function DocsPanel({ reports, onClear }) {
  return (
    <>
      <style>{styles}</style>

      <div className="docs-header">
        <div className="docs-eyebrow">Recent Reports</div>
        <div className="docs-title">Your Documents</div>
        <div className="docs-sub">
          The last {3} contract analyses are saved here automatically. Clear history to remove them.
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="docs-empty">
          <div className="docs-empty-glyph">📄</div>
          <div className="docs-empty-title">No reports saved yet</div>
          <div className="docs-empty-sub">
            Analyze a contract on the home page and your report will automatically appear here.
          </div>
        </div>
      ) : (
        <>
          <div className="docs-toprow">
            <span className="docs-count">{reports.length} of 3 report{reports.length !== 1 ? "s" : ""} saved</span>
            <button className="docs-clear" onClick={() => { if (window.confirm("Clear all saved reports?")) onClear(); }}>
              Clear History
            </button>
          </div>

          <div className="docs-list">
            {reports.map((r, i) => (
              <ReportCard key={r.id} report={r} index={i} />
            ))}
          </div>
        </>
      )}
    </>
  );
}