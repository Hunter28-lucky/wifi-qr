"use client";
import { useState } from "react";

export default function StatusPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<null | { status: string; name: string; amount: number; utr: string; screenshot_url: string }>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const res = await fetch(`/api/payments/status?query=${encodeURIComponent(query)}`);
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setResult(data.payment || null);
      if (!data.payment) setError("No payment found for this Email or UTR.");
    } else {
      setError("Error fetching status.");
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>
      <h2>Check Payment Status</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input
          type="text"
          placeholder="Enter Email or UTR Number"
          value={query}
          onChange={e => setQuery(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{loading ? "Checking..." : "Check Status"}</button>
      </form>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 24 }}>
          <div><b>Name:</b> {result.name}</div>
          <div><b>Amount:</b> ₹{result.amount}</div>
          <div><b>UTR:</b> {result.utr}</div>
          <div><b>Status:</b> {result.status}</div>
          <div><b>Screenshot:</b> <a href={result.screenshot_url} target="_blank" rel="noopener noreferrer">View</a></div>
        </div>
      )}
    </div>
  );
}