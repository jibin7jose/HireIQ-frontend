import Link from "next/link";

export default function Home() {
  const categories = [
    { title: "Technology", count: "1,200+ Jobs", icon: "💻", color: "#4f46e5" },
    { title: "Design", count: "450+ Jobs", icon: "✨", color: "#14b8a6" },
    { title: "Marketing", count: "800+ Jobs", icon: "📈", color: "#f59e0b" },
    { title: "Finance", count: "320+ Jobs", icon: "🏦", color: "#3b82f6" },
    { title: "Healthcare", count: "680+ Jobs", icon: "🏥", color: "#10b981" },
    { title: "Education", count: "290+ Jobs", icon: "🎓", color: "#8b5cf6" },
    { title: "Legal", count: "150+ Jobs", icon: "⚖️", color: "#ef4444" },
    { title: "Remote", count: "3,400+ Jobs", icon: "🌍", color: "#06b6d4" },
  ];

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Matching",
      desc: "Get a precise match score for every job based on your unique skills and experience.",
      color: "rgba(99,102,241,0.1)",
      accent: "#6366f1",
    },
    {
      icon: "🏢",
      title: "Verified Companies",
      desc: "Every employer on CareerConnect is verified. No spam, no ghost jobs.",
      color: "rgba(20,184,166,0.1)",
      accent: "#14b8a6",
    },
    {
      icon: "⚡",
      title: "One-Click Apply",
      desc: "Apply to multiple roles instantly with your AI-optimised CareerConnect profile.",
      color: "rgba(245,158,11,0.1)",
      accent: "#f59e0b",
    },
  ];

  return (
    <div>
      {/* ──────── HERO ──────── */}
      <section
        className="bg-hero"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "7rem 1.5rem 6rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        {/* Animated blobs */}
        <div className="blob-primary blob-1" />
        <div className="blob-primary blob-2" />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 9999,
              padding: "0.4rem 1.1rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: "#2dd4bf",
              marginBottom: "2rem",
              backdropFilter: "blur(8px)",
            }}
          >
            ✦ AI-Powered Job Matching is Live
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "1.5rem",
            }}
          >
            Find the work that{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #818cf8, #2dd4bf)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              matches your potential
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              color: "rgba(248,250,252,0.7)",
              maxWidth: 600,
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            CareerConnect uses advanced AI to analyse your full career profile and connect you with employers who genuinely value what you bring.
          </p>

          {/* Search bar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              background: "rgba(255,255,255,0.95)",
              borderRadius: 16,
              padding: "0.75rem",
              boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
              maxWidth: 720,
              margin: "0 auto 1.75rem",
            }}
          >
            <div style={{ flex: "1 1 200px", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0 0.75rem" }}>
              <span style={{ fontSize: "1.1rem" }}>🔍</span>
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "0.92rem",
                  color: "#0f172a",
                  background: "transparent",
                  padding: "0.5rem 0",
                }}
              />
            </div>
            <div
              style={{
                width: 1,
                background: "#e2e8f0",
                alignSelf: "stretch",
                margin: "0.25rem 0",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: "1 1 160px", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0 0.75rem" }}>
              <span style={{ fontSize: "1.1rem" }}>📍</span>
              <input
                type="text"
                placeholder="City, state, or Remote"
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "0.92rem",
                  color: "#0f172a",
                  background: "transparent",
                  padding: "0.5rem 0",
                }}
              />
            </div>
            <Link href="/jobs" className="btn-primary" style={{ borderRadius: 12, padding: "0.75rem 1.75rem" }}>
              Search Jobs
            </Link>
          </div>

          {/* Popular tags */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.6rem", fontSize: "0.82rem", color: "rgba(248,250,252,0.55)" }}>
            <span>Popular:</span>
            {["Remote", "Software Engineer", "Product Designer", "Data Analyst"].map((t) => (
              <Link
                key={t}
                href="/jobs"
                style={{
                  color: "rgba(248,250,252,0.7)",
                  textDecoration: "none",
                  borderBottom: "1px dashed rgba(248,250,252,0.35)",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── STATS BAR ──────── */}
      <section
        style={{
          background: "#fff",
          borderBottom: "1px solid rgba(148,163,184,0.15)",
          padding: "1.25rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          {[
            { num: "120K+", label: "Active Jobs" },
            { num: "45K+", label: "Companies" },
            { num: "2M+", label: "Job Seekers" },
            { num: "98%", label: "Satisfaction Rate" },
          ].map((s) => (
            <div key={s.num} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#4f46e5" }}>{s.num}</div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────── CATEGORIES ──────── */}
      <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.75rem" }}>
              Explore by Category
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "1rem" }}>
              Browse thousands of opportunities across every industry
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {categories.map((cat) => (
              <Link key={cat.title} href="/jobs" style={{ textDecoration: "none" }}>
                <div
                  className="glass-panel hover-lift card-hover-accent"
                  style={{
                    padding: "1.75rem 1.5rem",
                    borderRadius: 16,
                    cursor: "pointer",
                    transition: "all 0.22s",
                  }}
                >
                  <div style={{ fontSize: "2.2rem", marginBottom: "0.75rem" }}>{cat.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--foreground)", marginBottom: "0.3rem" }}>
                    {cat.title}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--muted)", fontWeight: 500 }}>{cat.count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── WHY US ──────── */}
      <section style={{ padding: "5rem 1.5rem", background: "#fff", borderTop: "1px solid rgba(148,163,184,0.12)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem" }}>
              Why CareerConnect?
            </h2>
            <p style={{ color: "#64748b", fontSize: "1rem" }}>
              A smarter approach to hiring and job discovery
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                className="hover-lift card-hover-accent"
                style={{
                  background: "#f8fafc",
                  border: "1px solid rgba(148,163,184,0.2)",
                  borderRadius: 18,
                  padding: "2rem",
                  cursor: "default",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: f.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.6rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.6rem" }}>
                  {f.title}
                </h3>
                <p style={{ color: "#64748b", lineHeight: 1.65, fontSize: "0.9rem" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA BANNER ──────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)",
          padding: "4.5rem 1.5rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "1rem" }}>
          Ready to find your dream job?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "2rem", fontSize: "1rem" }}>
          Join 2 million+ professionals who found their perfect role with CareerConnect.
        </p>
        <Link
          href="/auth/register"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#fff",
            color: "#4f46e5",
            fontWeight: 700,
            fontSize: "1rem",
            padding: "0.85rem 2.25rem",
            borderRadius: 9999,
            textDecoration: "none",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            transition: "transform 0.18s, box-shadow 0.18s",
          }}
        >
          Create Free Account →
        </Link>
      </section>
    </div>
  );
}
