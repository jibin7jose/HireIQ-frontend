'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalFooter() {
  const pathname = usePathname();

  // Hide global footer on dashboard pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/employer') || pathname?.startsWith('/candidate')) {
    return null;
  }

  return (
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
  );
}
