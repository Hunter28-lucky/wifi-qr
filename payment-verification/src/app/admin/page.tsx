"use client";
import { useEffect, useState } from "react";

type Payment = {
  id: string;
  name: string;
  email: string;
  amount: number;
  utr: string;
  screenshot_url: string;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("Pending");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("admin_api_key") : null;
    if (stored) setApiKey(stored);
  }, []);

  useEffect(() => {
    if (apiKey) fetchPayments();
    // eslint-disable-next-line
  }, [apiKey, statusFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/list?status=${statusFilter}`, {
      headers: { "x-api-key": apiKey! },
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setPayments(data.payments || []);
    } else {
      setError("Invalid API key or error fetching payments.");
      setPayments([]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_api_key", inputKey);
    setApiKey(inputKey);
  };

  const handleAction = async (id: string, action: "Approved" | "Rejected") => {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey! },
      body: JSON.stringify({ id, status: action }),
    });
    setLoading(false);
    if (res.ok) {
      fetchPayments();
    } else {
      setError("Failed to update status.");
    }
  };

  if (!apiKey) {
    return (
      <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="password"
            placeholder="Enter Admin API Key"
            value={inputKey}
            onChange={e => setInputKey(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>
      <h2>Admin Dashboard</h2>
      <div style={{ marginBottom: 16 }}>
        <label>Status Filter: </label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="">All</option>
        </select>
        <button style={{ marginLeft: 16 }} onClick={() => { sessionStorage.removeItem("admin_api_key"); setApiKey(null); }}>Logout</button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Amount</th>
              <th>UTR</th>
              <th>Screenshot</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} style={{ background: p.status === "Pending" ? "#fffbe6" : p.status === "Approved" ? "#e6ffed" : "#ffe6e6" }}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>₹{p.amount}</td>
                <td>{p.utr}</td>
                <td><a href={p.screenshot_url} target="_blank" rel="noopener noreferrer">View</a></td>
                <td>{p.status}</td>
                <td>{new Date(p.created_at).toLocaleString()}</td>
                <td>
                  {p.status === "Pending" && (
                    <>
                      <button onClick={() => handleAction(p.id, "Approved")}>Approve</button>
                      <button onClick={() => handleAction(p.id, "Rejected")}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}