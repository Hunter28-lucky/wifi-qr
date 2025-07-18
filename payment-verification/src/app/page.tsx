import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Payment Verification System</h1>
        <Image
          src="/qrpayment.jpeg"
          alt="UPI QR Code"
          width={200}
          height={200}
          style={{ margin: "0 auto", display: "block", borderRadius: 8 }}
        />
        <nav style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>
          <Link href="/submit" style={{ fontWeight: 600, fontSize: 18 }}>Submit Payment</Link>
          <Link href="/status" style={{ fontWeight: 600, fontSize: 18 }}>Check Payment Status</Link>
          <Link href="/admin" style={{ fontWeight: 600, fontSize: 18 }}>Admin Dashboard</Link>
        </nav>
      </main>
    </div>
  );
}
