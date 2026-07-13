import Link from "next/link";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
  matchScore?: number;
}

export default function JobCard({
  id,
  title,
  company,
  location,
  salary,
  type,
  postedAt,
  matchScore,
}: JobCardProps) {
  const typeColor =
    type === "Full-time"
      ? { bg: "rgba(59,130,246,0.1)", color: "#3b82f6" }
      : type === "Contract"
      ? { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" }
      : { bg: "rgba(20,184,166,0.1)", color: "#14b8a6" };

  return (
    <div
      className="hover-lift card-hover-accent"
      style={{
        background: "#fff",
        border: "1px solid rgba(148,163,184,0.18)",
        borderRadius: 16,
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
        cursor: "default",
      }}
    >
      {/* Top row: logo + title + bookmark */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "0.9rem", alignItems: "center" }}>
          {/* Company logo placeholder */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#4f46e5",
              flexShrink: 0,
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            {company.charAt(0)}
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                color: "#0f172a",
                marginBottom: "0.2rem",
                lineHeight: 1.3,
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 500 }}>{company}</div>
          </div>
        </div>

        <button
          title="Save job"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.4rem",
            borderRadius: 8,
            color: "#94a3b8",
            fontSize: "1.1rem",
            lineHeight: 1,
            transition: "color 0.18s",
          }}
        >
          🔖
        </button>
      </div>

      {/* Badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <span
          style={{
            padding: "0.25rem 0.7rem",
            borderRadius: 9999,
            fontSize: "0.75rem",
            fontWeight: 600,
            background: typeColor.bg,
            color: typeColor.color,
          }}
        >
          {type}
        </span>
        <span
          style={{
            padding: "0.25rem 0.7rem",
            borderRadius: 9999,
            fontSize: "0.75rem",
            fontWeight: 600,
            background: "rgba(100,116,139,0.08)",
            color: "#64748b",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          📍 {location}
        </span>
        <span
          style={{
            padding: "0.25rem 0.7rem",
            borderRadius: 9999,
            fontSize: "0.75rem",
            fontWeight: 600,
            background: "rgba(20,184,166,0.08)",
            color: "#14b8a6",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          💰 {salary}
        </span>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(148,163,184,0.12)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>🕐 {postedAt}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {matchScore && (
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#14b8a6",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              ✦ {matchScore}% Match
            </span>
          )}
          <Link
            href={`/jobs/${id}`}
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#4f46e5",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
