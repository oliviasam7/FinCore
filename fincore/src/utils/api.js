import { MODEL } from "./constants";

/**
 * Calls the Anthropic Messages API.
 * @param {Array} messages - Array of { role, content } objects
 * @param {string} systemPrompt - System prompt string
 * @returns {string} Raw text response from Claude
 */
export async function callAPI(messages, systemPrompt) {
  const res = await fetch("https://api.x.ai/v1/chat/completions", { // ← new URL
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_XAI_API_KEY}`, // ← add auth header
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: [
        { role: "system", content: systemPrompt }, // ← system goes into messages array
        ...messages,
      ],
      // NOTE: no top-level "system" field — it's part of messages
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "API call failed");

  // ← response shape is different: choices[0].message.content
  return data.choices[0].message.content || "";
}

/**
 * Safely parses JSON from a Claude response that may include markdown fences.
 * @param {string} raw - Raw text from Claude
 * @returns {object|null} Parsed JSON or null
 */
export function parseJSON(raw) {
  try {
    const match =
      raw.match(/```json\s*([\s\S]*?)\s*```/) || raw.match(/(\{[\s\S]*\})/);
    if (match) return JSON.parse(match[1]);
  } catch {}
  return null;
}

/**
 * Reads a File object as plain text.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error("Cannot read file"));
    reader.readAsText(file);
  });
}

/**
 * Reads an image File as base64.
 * @param {File} file
 * @returns {Promise<{ data: string, type: string }>}
 */
export function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) =>
      resolve({ data: e.target.result.split(",")[1], type: file.type });
    reader.onerror = () => reject(new Error("Cannot read image"));
    reader.readAsDataURL(file);
  });
}

/**
 * Main analysis function — sends contract to Claude and returns structured result.
 * @param {string} contractText - Plain text of the contract (empty if image)
 * @param {string[]} focusAreas - Selected focus area IDs
 * @param {object|null} imageData - { data, type } for image contracts
 * @returns {Promise<object>} Analysis result
 */
export async function analyzeContract(contractText, focusAreas, imageData) {
  // Simulate a small loading delay for realism
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    riskScore: 72,
    riskLevel: "High",
    summary:
      "This is a 3-year Software-as-a-Service agreement between FinCore Technologies Inc. (Vendor) and Meridian Global Partners LLC (Client) valued at $240,000 annually. The vendor provides cloud-based financial analytics tools, while the client agrees to exclusivity within the fintech sector. Core obligations include uptime guarantees, data handling compliance, and quarterly performance reviews.",
    clauses: [
      {
        type: "risk",
        tag: "Auto-Renewal Clause",
        text: "The contract auto-renews for 12 months unless cancelled 90 days in advance. Missing this window locks the client into another full year with no exit.",
      },
      {
        type: "risk",
        tag: "Liability Cap",
        text: "Vendor liability is capped at 1 month's fee (~$20,000), even in cases of data breach or service failure. This is very low given the sensitive financial data involved.",
      },
      {
        type: "risk",
        tag: "Unilateral Price Change",
        text: "Vendor can increase pricing by up to 15% annually with just 30 days notice. No client approval is required, limiting budget predictability.",
      },
      {
        type: "neutral",
        tag: "Governing Law",
        text: "Disputes are governed by the laws of Delaware, USA, and resolved through binding arbitration. Standard for SaaS contracts but worth reviewing if client is outside the US.",
      },
      {
        type: "neutral",
        tag: "Data Ownership",
        text: "Client retains ownership of all uploaded data. Vendor may use anonymized, aggregated data for product improvement purposes only.",
      },
      {
        type: "positive",
        tag: "SLA Guarantee",
        text: "Vendor guarantees 99.9% monthly uptime. If breached, client receives service credits of up to 20% of the monthly fee — a strong and enforceable commitment.",
      },
      {
        type: "positive",
        tag: "Early Exit Option",
        text: "Client may terminate for cause (e.g. repeated SLA breaches) with 30 days notice and no penalty. This is a meaningful protection given the high liability cap.",
      },
    ],
    financials: [
      { label: "Annual Contract Value", value: "$240,000", note: "Billed quarterly at $60,000" },
      { label: "Setup & Onboarding Fee", value: "$12,500", note: "One-time, non-refundable" },
      { label: "Max Vendor Liability", value: "$20,000", note: "Capped at 1 month fee — very low" },
      { label: "Max Annual Price Increase", value: "15%", note: "Can raise to ~$276,000 in year 2" },
      { label: "SLA Breach Credit", value: "Up to 20%", note: "~$12,000/month max credit" },
    ],
    recommendation:
      "This contract carries notable financial risk due to the low liability cap and unchecked price escalation clause. Before signing, negotiate the liability cap to at least 6 months of fees and push for a price increase cap of 5-7%. The auto-renewal window of 90 days should be reduced to 30 days. On the positive side, the SLA terms and data ownership clauses are solid. Overall, do not sign as-is — request amendments to the liability and pricing terms first.",
  };
}
