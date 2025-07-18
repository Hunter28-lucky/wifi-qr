"use client";
import { useState } from "react";
import Image from "next/image";

export default function SubmitPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    utr: "",
    screenshot: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    const body = new FormData();
    body.append("name", form.name);
    body.append("email", form.email);
    body.append("amount", form.amount);
    body.append("utr", form.utr);
    if (form.screenshot) body.append("screenshot", form.screenshot);
    const res = await fetch("/api/payments/submit", {
      method: "POST",
      body,
    });
    setSubmitting(false);
    if (res.ok) {
      setSuccess("Payment submitted! You can check your status on the status page.");
      setForm({ name: "", email: "", amount: "", utr: "", screenshot: null });
    } else {
      setError("Submission failed. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>
      <h2>Pay via UPI QR</h2>
      <Image src="/qrpayment.jpeg" alt="UPI QR Code" width={300} height={300} style={{ margin: "0 auto", display: "block" }} />
      <form onSubmit={handleSubmit} style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
        <input name="name" type="text" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email ID" value={form.email} onChange={handleChange} required />
        <select name="amount" value={form.amount} onChange={handleChange} required>
          <option value="">Select Amount</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
        </select>
        <input name="utr" type="text" placeholder="UPI UTR Number" value={form.utr} onChange={handleChange} required />
        <input name="screenshot" type="file" accept="image/*" onChange={handleChange} required />
        <button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit Payment"}</button>
        {success && <div style={{ color: "green" }}>{success}</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}