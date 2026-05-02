import React, { useEffect, useState } from "react";

const styles = `
.hero {
  position: relative; z-index: 1;
  padding: 70px 40px 50px;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 18px;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 600px; height: 300px;
  background: radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%);
  pointer-events: none;
}
.hero-eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--accent); letter-spacing: 3px; text-transform: uppercase;
  border: 1px solid rgba(0, 212, 255, 0.25); padding: 6px 18px;
  background: rgba(0, 212, 255, 0.05);
  animation: fadeUp .6s ease both;
}
.hero-h1 {
  font-family: 'Instrument Serif', serif; font-size: clamp(38px, 6vw, 72px);
  font-weight: 400; line-height: 1.05; max-width: 760px; color: var(--text);
  animation: fadeUp .7s ease .1s both;
}
.hero-h1 em {
  font-style: italic;
  background: linear-gradient(135deg, var(--accent) 0%, var(--gold) 60%, var(--accent) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: shimmer 4s linear infinite;
}
@keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
@keyframes fadeUp  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

.hero-sub {
  font-size: 15px; color: var(--muted); max-width: 500px; line-height: 1.7;
  animation: fadeUp .7s ease .2s both;
}

/* ── Feature cards row ── */
.hero-features {
  display: flex; gap: 14px; margin-top: 10px; flex-wrap: wrap; justify-content: center;
  animation: fadeUp .7s ease .35s both;
}
.hero-feat {
  background: var(--surface); border: 1px solid var(--border2);
  padding: 18px 22px; cursor: pointer;
  display: flex; align-items: center; gap: 14px;
  transition: all .2s ease;
  position: relative; overflow: hidden; min-width: 220px;
}
.hero-feat::before {
  content: '';
  position: absolute; top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0,212,255,0.05), transparent);
  transition: left .4s ease;
}
.hero-feat:hover::before { left: 100%; }
.hero-feat:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,212,255,0.08);
}
.hero-feat:active { transform: scale(0.98); }
.feat-icon {
  font-size: 28px; flex-shrink: 0;
  transition: transform .25s ease;
}
.hero-feat:hover .feat-icon { transform: scale(1.15); }
.feat-text { text-align: left; }
.feat-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
.feat-sub   { font-size: 11px; color: var(--muted); font-family: 'JetBrains Mono', monospace; line-height: 1.4; }
.feat-arrow {
  margin-left: auto; color: var(--accent); font-size: 16px; flex-shrink: 0;
  opacity: 0; transform: translateX(-6px);
  transition: opacity .2s, transform .2s;
}
.hero-feat:hover .feat-arrow { opacity: 1; transform: translateX(0); }

/* badge on card */
.feat-badge {
  position: absolute; top: 8px; right: 8px;
  font-size: 8px; font-family: 'JetBrains Mono', monospace;
  letter-spacing: 1px; text-transform: uppercase; padding: 2px 7px;
  border-radius: 99px; font-weight: 700;
}
.feat-badge-new  { background: rgba(0,230,118,0.12); color: var(--green); border: 1px solid rgba(0,230,118,0.3); }
.feat-badge-beta { background: rgba(0,212,255,0.1);  color: var(--accent); border: 1px solid rgba(0,212,255,0.25); }
`;

export default function Hero({ onCompare, onTracker }) {
  return (
    <>
      <style>{styles}</style>
      <div className="hero">
        <div className="hero-eyebrow">Contract Intelligence Platform</div>

        <h1 className="hero-h1">
          Understand <em>every clause</em><br />before you sign.
        </h1>

        <p className="hero-sub">
          AI-powered contract analysis. Identify risks, extract financials,
          compare multiple contracts, and track deadlines — all in one place.
        </p>

        <div className="hero-features">
          <div className="hero-feat" onClick={onCompare}>
            <span className="feat-badge feat-badge-new">NEW</span>
            <div className="feat-icon">⚖️</div>
            <div className="feat-text">
              <div className="feat-title">Compare Contracts</div>
              <div className="feat-sub">Side-by-side analysis.<br/>Find the better deal.</div>
            </div>
            <div className="feat-arrow">→</div>
          </div>

          <div className="hero-feat" onClick={onTracker}>
            <span className="feat-badge feat-badge-beta">BETA</span>
            <div className="feat-icon">📅</div>
            <div className="feat-text">
              <div className="feat-title">Contract Tracker</div>
              <div className="feat-sub">Track deadlines &amp;<br/>renewal dates.</div>
            </div>
            <div className="feat-arrow">→</div>
          </div>
        </div>
      </div>
    </>
  );
}