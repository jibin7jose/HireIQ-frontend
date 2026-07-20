"use client";

import JobCard from "@/components/shared/JobCard";
import { useState, useEffect } from "react";

const JOB_TYPES = ["All Types", "Full-time", "Part-time", "Contract", "Internship"];
const SORT_OPTIONS = ["Best Match", "Most Recent", "Salary (High to Low)"];

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("All Types");
  
  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        pageNumber: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (keyword) params.append("keyword", keyword);
      if (location) params.append("location", location);
      if (jobType && jobType !== "All Types") params.append("jobType", jobType);

      // Using the standard Next.js rewrites or full URL for backend API
      const res = await fetch(`http://localhost:5000/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.items || []);
        setTotalCount(data.totalCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]); // Re-fetch when page changes

  const handleSearch = () => {
    setPage(1);
    fetchJobs();
  };

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
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
              onClick={handleSearch}
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
            {JOB_TYPES.map((t) => {
              const isActive = jobType === t;
              return (
                <button
                  key={t}
                  onClick={() => {
                    setJobType(t);
                    setPage(1); // reset page on filter change
                  }}
                  style={{
                    padding: "0.35rem 1rem",
                    borderRadius: 9999,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: isActive ? "2px solid #4f46e5" : "1.5px solid rgba(148,163,184,0.25)",
                    background: isActive ? "rgba(99,102,241,0.08)" : "transparent",
                    color: isActive ? "#4f46e5" : "#64748b",
                    transition: "all 0.18s",
                  }}
                >
                  {t}
                </button>
              );
            })}
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
            <strong style={{ color: "#0f172a" }}>{totalCount} jobs</strong> matching your search
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

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
            No jobs found matching your criteria.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {jobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem", gap: "0.5rem" }}>
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              style={{
                height: 40,
                padding: "0 0.75rem",
                borderRadius: 10,
                border: "1.5px solid rgba(148,163,184,0.25)",
                background: "#fff",
                color: page === 1 ? "#cbd5e1" : "#64748b",
                fontWeight: 500,
                fontSize: "0.88rem",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>
            <span style={{ display: "flex", alignItems: "center", margin: "0 0.5rem", fontSize: "0.9rem", color: "#64748b" }}>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              style={{
                height: 40,
                padding: "0 0.75rem",
                borderRadius: 10,
                border: "1.5px solid rgba(148,163,184,0.25)",
                background: "#fff",
                color: page === totalPages ? "#cbd5e1" : "#64748b",
                fontWeight: 500,
                fontSize: "0.88rem",
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
