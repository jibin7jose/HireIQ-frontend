import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CareerConnect AI – Find Jobs Matched by AI",
  description:
    "AI-powered job matching platform connecting talent with top employers.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* ── Navigation ── */}
        <header
          className="glass-panel"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 1.5rem",
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none" }}>
              <span
                className="gradient-text"
                style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                CareerConnect
              </span>
            </Link>

            {/* Nav links */}
            <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              <Link href="/jobs" className="nav-link">
                Find Jobs
              </Link>
              <Link href="/employer" className="nav-link">
                For Employers
              </Link>
            </nav>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link href="/auth/login" className="btn-outline" style={{ fontSize: "0.85rem", padding: "0.5rem 1.25rem" }}>
                Sign In
              </Link>
              <Link href="/auth/register" className="btn-primary" style={{ fontSize: "0.85rem", padding: "0.55rem 1.4rem" }}>
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main style={{ flex: 1 }}>{children}</main>

        {/* ── Footer ── */}
        <footer
          style={{
            background: "#080c18",
            color: "#94a3b8",
            padding: "3rem 1.5rem 2rem",
            borderTop: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "2rem",
                paddingBottom: "2rem",
                borderBottom: "1px solid rgba(148,163,184,0.1)",
                marginBottom: "2rem",
              }}
            >
              <div>
                <div className="gradient-text" style={{ fontSize: "1.25rem", fontWeight: 800 }}>
                  CareerConnect
                </div>
                <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Connecting talent with opportunity through AI.
                </p>
              </div>
              <div style={{ display: "flex", gap: "2rem" }}>
                {["Privacy Policy", "Terms", "Contact"].map((l) => (
                  <Link
                    key={l}
                    href="#"
                    className="footer-link"
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>
            <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#475569" }}>
              © {new Date().getFullYear()} CareerConnect AI. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
