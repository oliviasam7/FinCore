import React, { useState, useEffect } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   TrackerPanel — Contract lifecycle tracker
   Stores contracts in localStorage (key: "fincore_contracts")
   No backend changes required — fully client-side.
───────────────────────────────────────────────────────────────────────────── */

const STORAGE_KEY = "fincore_contracts";

const STATUS_OPTIONS = ["Active", "Under Review", "Expiring Soon", "Expired", "Terminated"];
const STATUS_COLORS  = {
  "Active":          { bg: "rgba(0,230,118,0.1)",  border: "rgba(0,230,118,0.3)",  text: "var(--green)" },
  "Under Review":    { bg: "rgba(0,212,255,0.1)",  border: "rgba(0,212,255,0.3)",  text: "var(--accent)" },
  "Expiring Soon":   { bg: "rgba(240,180,41,0.1)", border: "rgba(240,180,41,0.3)", text: "var(--gold)" },
  "Expired":         { bg: "rgba(255,77,77,0.1)",  border: "rgba(255,77,77,0.3)",  text: "var(--red)" },
  "Terminated":      { bg: "rgba(90,112,128,0.15)", border: "rgba(90,112,128,0.3)", text: "var(--muted)" },
};

const styles = `
/* ── Page header ── */
.tr-header { margin-bottom: 32px; animation: trFade .4s ease both; }
.tr-eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--accent); letter-spacing: 2px; text-transform: uppercase;
  margin-bottom: 8px; display: flex; align-items: center; gap: 8px;
}
.tr-eyebrow::before { content: ''; width: 20px; height: 1px; background: var(--accent); }
.tr-title { font-family: 'Instrument Serif', serif; font-size: 32px; font-style: italic; margin-bottom: 6px; }
.tr-sub   { font-size: 13px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }

/* ── Summary strip ── */
.tr-summary {
  display: grid; grid-template-columns: repeat(4,1fr); gap: 12px;
  margin-bottom: 28px; animation: trFade .4s ease .1s both;
}
.tr-sum-card {
  background: var(--surface); border: 1px solid var(--border2);
  padding: 16px 18px; position: relative; overflow: hidden;
  transition: border-color .2s, transform .2s;
}
.tr-sum-card:hover { border-color: rgba(0,212,255,0.2); transform: translateY(-2px); }
.tr-sum-card::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
  background: linear-gradient(180deg, var(--accent), transparent);
  opacity: 0; transition: opacity .2s;
}
.tr-sum-card:hover::before { opacity: 1; }
.tr-sum-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
.tr-sum-val   { font-family: 'Instrument Serif', serif; font-size: 32px; line-height: 1; }

/* ── Top bar ── */
.tr-topbar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px; animation: trFade .4s ease .15s both; flex-wrap: wrap; gap: 10px;
}
.tr-search {
  background: var(--surface); border: 1px solid var(--border2);
  color: var(--text); padding: 9px 14px; font-size: 13px;
  font-family: 'JetBrains Mono', monospace; outline: none;
  transition: border .15s; width: 260px;
}
.tr-search:focus { border-color: var(--accent); }
.tr-search::placeholder { color: var(--muted); }
.tr-filter-row { display: flex; gap: 6px; align-items: center; }
.tr-filter {
  padding: 7px 14px; background: var(--surface); border: 1px solid var(--border2);
  font-size: 11px; font-family: 'JetBrains Mono', monospace; color: var(--muted);
  cursor: pointer; transition: all .14s;
}
.tr-filter:hover, .tr-filter.on { border-color: var(--accent); color: var(--accent); background: rgba(0,212,255,0.05); }

.tr-add-btn {
  padding: 9px 22px; background: var(--accent); color: #000; border: none;
  font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
  cursor: pointer; transition: opacity .15s, box-shadow .15s;
  position: relative; overflow: hidden;
}
.tr-add-btn::before {
  content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  transition: left .4s;
}
.tr-add-btn:hover::before { left: 100%; }
.tr-add-btn:hover { opacity: .9; box-shadow: 0 0 16px rgba(0,212,255,0.3); }

/* ── Contract table ── */
.tr-table-wrap { animation: trFade .4s ease .2s both; }
.tr-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.tr-table th {
  padding: 10px 14px; text-align: left; background: var(--surface2);
  border: 1px solid var(--border); font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted);
}
.tr-table td {
  padding: 14px 14px; border: 1px solid var(--border);
  vertical-align: middle; transition: background .14s;
}
.tr-table tr:hover td { background: rgba(255,255,255,0.02); }
.tr-name { font-weight: 600; color: var(--text); margin-bottom: 3px; }
.tr-type { font-size: 11px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
.tr-date { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text); }
.tr-days-chip {
  display: inline-block; padding: 3px 10px; border-radius: 99px;
  font-size: 11px; font-family: 'JetBrains Mono', monospace; font-weight: 600;
}
.tr-status-pill {
  display: inline-block; padding: 4px 12px; border-radius: 2px;
  font-size: 10px; font-family: 'JetBrains Mono', monospace;
  letter-spacing: 1px; text-transform: uppercase; font-weight: 600;
}
.tr-action-row { display: flex; gap: 6px; }
.tr-action {
  padding: 5px 12px; font-size: 11px; font-family: 'JetBrains Mono', monospace;
  background: var(--surface2); border: 1px solid var(--border2); color: var(--muted);
  cursor: pointer; transition: all .14s;
}
.tr-action:hover { border-color: var(--accent); color: var(--accent); }
.tr-action.danger:hover { border-color: var(--red); color: var(--red); }

/* ── Empty state ── */
.tr-empty {
  text-align: center; padding: 80px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
}
.tr-empty-glyph { font-size: 56px; opacity: .12; filter: grayscale(1); }
.tr-empty-title { font-family: 'Instrument Serif', serif; font-size: 22px; font-style: italic; color: var(--muted); }
.tr-empty-sub   { font-size: 12px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }

/* ── Modal overlay ── */
.tr-modal-bg {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center; z-index: 999;
  animation: trFade .2s ease both;
}
.tr-modal {
  background: var(--surface); border: 1px solid var(--border2);
  padding: 32px; width: 520px; max-width: 95vw; position: relative;
  animation: trFadeUp .25s ease both;
}
.tr-modal-title {
  font-family: 'Instrument Serif', serif; font-size: 22px; font-style: italic;
  margin-bottom: 20px;
}
.tr-field { margin-bottom: 16px; }
.tr-field label {
  display: block; font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px;
}
.tr-field input, .tr-field select, .tr-field textarea {
  width: 100%; background: var(--bg); border: 1px solid var(--border2);
  color: var(--text); padding: 10px 12px; font-size: 13px;
  font-family: 'JetBrains Mono', monospace; outline: none;
  transition: border .15s;
}
.tr-field input:focus, .tr-field select:focus, .tr-field textarea:focus { border-color: var(--accent); }
.tr-field select option { background: var(--surface); }
.tr-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.tr-modal-actions { display: flex; gap: 10px; margin-top: 24px; justify-content: flex-end; }
.tr-modal-save {
  padding: 10px 28px; background: var(--accent); color: #000; border: none;
  font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer;
  transition: opacity .15s;
}
.tr-modal-save:hover { opacity: .88; }
.tr-modal-cancel {
  padding: 10px 20px; background: none; border: 1px solid var(--border2);
  color: var(--muted); font-size: 13px; cursor: pointer; transition: all .14s;
  font-family: 'Syne', sans-serif;
}
.tr-modal-cancel:hover { border-color: var(--border2); color: var(--text); }
.tr-modal-close {
  position: absolute; top: 14px; right: 16px; background: none; border: none;
  color: var(--muted); font-size: 18px; cursor: pointer; transition: color .15s;
}
.tr-modal-close:hover { color: var(--text); }

@keyframes trFade    { from { opacity: 0; } to { opacity: 1; } }
@keyframes trFadeUp  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
`;

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function DaysChip({ dateStr }) {
  const days = daysUntil(dateStr);
  if (days === null) return <span style={{ color: "var(--muted)", fontSize: 12 }}>—</span>;
  const color = days < 0 ? "var(--red)" : days <= 30 ? "var(--gold)" : days <= 90 ? "var(--accent)" : "var(--green)";
  const bg    = days < 0 ? "rgba(255,77,77,0.12)" : days <= 30 ? "rgba(240,180,41,0.12)" : days <= 90 ? "rgba(0,212,255,0.1)" : "rgba(0,230,118,0.1)";
  const label = days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Today" : `${days}d left`;
  return <span className="tr-days-chip" style={{ color, background: bg, border: `1px solid ${color}40` }}>{label}</span>;
}

const BLANK = { name: "", type: "", startDate: "", endDate: "", renewalDate: "", value: "", counterparty: "", status: "Active", notes: "" };

export default function TrackerPanel({ user, onLogin }) {
  const [contracts, setContracts] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });
  const [search,    setSearch  ] = useState("");
  const [filter,    setFilter  ] = useState("All");
  const [modal,     setModal   ] = useState(false);   // false | "add" | contract-id
  const [form,      setForm    ] = useState(BLANK);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
    // Auto-update "Expiring Soon" status
    setContracts(prev => prev.map(c => {
      const days = daysUntil(c.endDate);
      if (c.status === "Active" && days !== null && days <= 30) return { ...c, status: "Expiring Soon" };
      if (c.status === "Active" && days !== null && days < 0)   return { ...c, status: "Expired" };
      return c;
    }));
  }, [contracts.length]);

  const save = () => {
    if (!form.name.trim()) return;
    if (modal === "add") {
      setContracts(prev => [{ ...form, id: Date.now().toString() }, ...prev]);
    } else {
      setContracts(prev => prev.map(c => c.id === modal ? { ...form, id: modal } : c));
    }
    setModal(false); setForm(BLANK);
  };

  const del = (id) => { if (window.confirm("Delete this contract?")) setContracts(p => p.filter(c => c.id !== id)); };

  const openEdit = (c) => { setForm({ ...c }); setModal(c.id); };
  const openAdd  = () => {
    if (!user) { onLogin(); return; }
    setForm(BLANK); setModal("add");
  };

  const filtered = contracts.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.counterparty.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = { total: contracts.length, active: contracts.filter(c=>c.status==="Active").length, expiring: contracts.filter(c=>c.status==="Expiring Soon").length, expired: contracts.filter(c=>c.status==="Expired"||daysUntil(c.endDate)<0).length };

  return (
    <>
      <style>{styles}</style>

      {/* Header */}
      <div className="tr-header">
        <div className="tr-eyebrow">Beta Feature</div>
        <div className="tr-title">Contract Tracker</div>
        <div className="tr-sub">Track contract lifecycles, renewal dates, and deadlines. Get ahead of expirations.</div>
      </div>

      {/* Summary strip */}
      <div className="tr-summary">
        {[
          { label: "Total Contracts", val: counts.total, color: "var(--text)" },
          { label: "Active",          val: counts.active,   color: "var(--green)" },
          { label: "Expiring Soon",   val: counts.expiring, color: "var(--gold)" },
          { label: "Expired",         val: counts.expired,  color: "var(--red)" },
        ].map((s, i) => (
          <div key={i} className="tr-sum-card">
            <div className="tr-sum-label">{s.label}</div>
            <div className="tr-sum-val" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Topbar */}
      <div className="tr-topbar">
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input className="tr-search" placeholder="Search contracts…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <div className="tr-filter-row">
            {["All", "Active", "Expiring Soon", "Expired", "Terminated"].map(f => (
              <div key={f} className={`tr-filter ${filter===f?"on":""}`} onClick={() => setFilter(f)}>{f}</div>
            ))}
          </div>
        </div>
        <button className="tr-add-btn" onClick={openAdd}>+ Add Contract</button>
      </div>

      {/* Table */}
      <div className="tr-table-wrap">
        {filtered.length === 0 ? (
          <div className="tr-empty">
            <div className="tr-empty-glyph">📋</div>
            <div className="tr-empty-title">{contracts.length === 0 ? "No contracts tracked yet" : "No results found"}</div>
            <div className="tr-empty-sub">{contracts.length === 0 ? "Click \"+ Add Contract\" to start tracking your first contract." : "Try a different search or filter."}</div>
          </div>
        ) : (
          <table className="tr-table">
            <thead>
              <tr>
                <th>Contract</th>
                <th>Counterparty</th>
                <th>End Date</th>
                <th>Days Left</th>
                <th>Renewal</th>
                <th>Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const sc = STATUS_COLORS[c.status] || STATUS_COLORS["Active"];
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="tr-name">{c.name}</div>
                      <div className="tr-type">{c.type || "—"}</div>
                    </td>
                    <td><span className="tr-date">{c.counterparty || "—"}</span></td>
                    <td><span className="tr-date">{c.endDate || "—"}</span></td>
                    <td><DaysChip dateStr={c.endDate} /></td>
                    <td><span className="tr-date">{c.renewalDate || "—"}</span></td>
                    <td><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{c.value || "—"}</span></td>
                    <td>
                      <span className="tr-status-pill" style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div className="tr-action-row">
                        <button className="tr-action" onClick={() => openEdit(c)}>Edit</button>
                        <button className="tr-action danger" onClick={() => del(c.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="tr-modal-bg" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="tr-modal">
            <button className="tr-modal-close" onClick={() => setModal(false)}>×</button>
            <div className="tr-modal-title">{modal === "add" ? "Add Contract" : "Edit Contract"}</div>

            <div className="tr-field">
              <label>Contract Name *</label>
              <input placeholder="e.g. Office Lease Agreement" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} />
            </div>
            <div className="tr-field-row">
              <div className="tr-field">
                <label>Contract Type</label>
                <input placeholder="e.g. Lease, NDA, Vendor" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} />
              </div>
              <div className="tr-field">
                <label>Counterparty</label>
                <input placeholder="Other party name" value={form.counterparty} onChange={e=>setForm(p=>({...p,counterparty:e.target.value}))} />
              </div>
            </div>
            <div className="tr-field-row">
              <div className="tr-field">
                <label>Start Date</label>
                <input type="date" value={form.startDate} onChange={e=>setForm(p=>({...p,startDate:e.target.value}))} />
              </div>
              <div className="tr-field">
                <label>End Date</label>
                <input type="date" value={form.endDate} onChange={e=>setForm(p=>({...p,endDate:e.target.value}))} />
              </div>
            </div>
            <div className="tr-field-row">
              <div className="tr-field">
                <label>Renewal Date</label>
                <input type="date" value={form.renewalDate} onChange={e=>setForm(p=>({...p,renewalDate:e.target.value}))} />
              </div>
              <div className="tr-field">
                <label>Contract Value</label>
                <input placeholder="e.g. ₹1,20,000 / yr" value={form.value} onChange={e=>setForm(p=>({...p,value:e.target.value}))} />
              </div>
            </div>
            <div className="tr-field">
              <label>Status</label>
              <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="tr-field">
              <label>Notes</label>
              <textarea rows={3} placeholder="Any key reminders or notes…" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} />
            </div>

            <div className="tr-modal-actions">
              <button className="tr-modal-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="tr-modal-save" onClick={save}>Save Contract</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}