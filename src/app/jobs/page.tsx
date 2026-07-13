import JobCard from "@/components/shared/JobCard";

const MOCK_JOBS = [
  { id: "1", title: "Senior Frontend Developer", company: "TechNova Solutions", location: "San Francisco (Hybrid)", salary: "$120k–$150k", type: "Full-time", postedAt: "2 hours ago", matchScore: 98 },
  { id: "2", title: "Product Designer", company: "CreativeFlow", location: "Remote", salary: "$90k–$120k", type: "Full-time", postedAt: "5 hours ago", matchScore: 85 },
  { id: "3", title: "Backend Engineer (Go)", company: "DataSync Inc.", location: "New York, NY", salary: "$140k–$170k", type: "Full-time", postedAt: "1 day ago", matchScore: 92 },
  { id: "4", title: "DevOps Specialist", company: "CloudNative", location: "Austin, TX (Remote)", salary: "$130k–$160k", type: "Contract", postedAt: "2 days ago", matchScore: 78 },
  { id: "5", title: "UX/UI Lead", company: "Innovate Labs", location: "Seattle, WA", salary: "$110k–$145k", type: "Full-time", postedAt: "3 days ago", matchScore: 88 },
  { id: "6", title: "Full Stack Developer", company: "StartupX", location: "Remote", salary: "$100k–$130k", type: "Full-time", postedAt: "4 days ago", matchScore: 95 },
  { id: "7", title: "Data Scientist", company: "AnalyticsHQ", location: "Boston, MA", salary: "$125k–$155k", type: "Full-time", postedAt: "5 days ago", matchScore: 81 },
  { id: "8", title: "Mobile Engineer (iOS)", company: "AppCraft", location: "Remote", salary: "$115k–$140k", type: "Contract", postedAt: "1 week ago", matchScore: 76 },
];

const JOB_TYPES = ["All Types", "Full-time", "Part-time", "Contract", "Internship"];
const SORT_OPTIONS = ["Best Match", "Most Recent", "Salary (High to Low)"];

export default function JobsPage() {
  return (
    <div style={{ background: "#f0f4ff", minHeight: "100vh" }}>

      {/* ── Search Header ── */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid rgba(148,163,184,0.18)",
          padding: "2.5rem 1.5rem 2rem",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Find Your Next Role
          </h1>

          {/* Search row */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                flex: "1 1 260px",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                background: "#f8fafc",
                border: "1.5px solid rgba(148,163,184,0.25)",
                borderRadius: 10,
                padding: "0.6rem 1rem",
              }}
            >
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>🔍</span>
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.9rem",
                  color: "#0f172a",
                  width: "100%",
                }}
              />
            </div>

            <div
              style={{
                flex: "0 1 220px",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                background: "#f8fafc",
                border: "1.5px solid rgba(148,163,184,0.25)",
                borderRadius: 10,
                padding: "0.6rem 1rem",
              }}
            >
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>📍</span>
              <input
                type="text"
                placeholder="Location or Remote"
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.9rem",
                  color: "#0f172a",
                  width: "100%",
                }}
              />
            </div>

            <button
              style={{
                flexShrink: 0,
                background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "0.7rem 2rem",
                fontWeight: 700,
                fontSize: "0.92rem",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                transition: "filter 0.18s",
              }}
            >
              Search Jobs
            </button>
          </div>

          {/* Filter chips */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {JOB_TYPES.map((t, i) => (
              <button
                key={t}
                style={{
                  padding: "0.35rem 1rem",
                  borderRadius: 9999,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: i === 0 ? "2px solid #4f46e5" : "1.5px solid rgba(148,163,184,0.25)",
                  background: i === 0 ? "rgba(99,102,241,0.08)" : "transparent",
                  color: i === 0 ? "#4f46e5" : "#64748b",
                  transition: "all 0.18s",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Job Feed ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {/* Results bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Showing{" "}
            <strong style={{ color: "#0f172a" }}>342 jobs</strong> matching your search
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#64748b" }}>Sort:</span>
            <select
              style={{
                border: "1.5px solid rgba(148,163,184,0.25)",
                borderRadius: 8,
                padding: "0.35rem 0.75rem",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#0f172a",
                background: "#fff",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Job grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {MOCK_JOBS.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem", gap: "0.5rem" }}>
          {["←", "1", "2", "3", "...", "28", "→"].map((p, i) => (
            <button
              key={i}
              style={{
                width: p.length > 1 ? "auto" : 40,
                height: 40,
                padding: p.length > 1 ? "0 0.75rem" : undefined,
                borderRadius: 10,
                border: p === "1" ? "none" : "1.5px solid rgba(148,163,184,0.25)",
                background: p === "1" ? "linear-gradient(135deg,#4f46e5,#6366f1)" : "#fff",
                color: p === "1" ? "#fff" : "#64748b",
                fontWeight: p === "1" ? 700 : 500,
                fontSize: "0.88rem",
                cursor: "pointer",
                boxShadow: p === "1" ? "0 4px 14px rgba(99,102,241,0.3)" : "none",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
