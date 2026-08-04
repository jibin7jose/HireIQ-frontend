"use client";

import { useState } from "react";
import ResumeUpload from "@/components/candidate/ResumeUpload";

export default function CandidateDashboard() {
  const [resumeUrl, setResumeUrl] = useState<string | undefined>(undefined);

  const handleUploadSuccess = (url: string) => {
    setResumeUrl(url);
    alert("Resume uploaded successfully!");
  };

  return (
    <div style={{ background: "#f0f4ff", minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", background: "#fff", padding: "2rem", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>
          Candidate Dashboard
        </h1>

        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>
            Profile Details
          </h2>
          <p style={{ color: "#64748b" }}>Manage your personal information and upload your resume for employers to see.</p>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(148,163,184,0.2)", margin: "2rem 0" }} />

        <ResumeUpload 
          currentResumeUrl={resumeUrl} 
          onUploadSuccess={handleUploadSuccess} 
        />
      </div>
    </div>
  );
}
