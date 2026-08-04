import { useState, useRef } from "react";

interface ResumeUploadProps {
  currentResumeUrl?: string;
  onUploadSuccess: (url: string) => void;
}

export default function ResumeUpload({ currentResumeUrl, onUploadSuccess }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    setError("");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const res = await fetch("http://localhost:5000/api/users/me/resume", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload resume.");
      }

      const data = await res.json();
      onUploadSuccess(data.url);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Resume</h3>
      
      {currentResumeUrl && (
        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem" }}>📄</span>
          <a
            href={currentResumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4f46e5", textDecoration: "none", fontWeight: 500 }}
          >
            View Current Resume
          </a>
        </div>
      )}

      <div
        style={{
          border: "2px dashed rgba(148,163,184,0.3)",
          borderRadius: 12,
          padding: "2rem",
          textAlign: "center",
          background: "#f8fafc",
          position: "relative",
          cursor: isUploading ? "wait" : "pointer",
          transition: "border-color 0.2s"
        }}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <p style={{ color: "#4f46e5", fontWeight: 500 }}>Uploading...</p>
        ) : (
          <div>
            <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>☁️</span>
            <p style={{ color: "#0f172a", fontWeight: 600, marginBottom: "0.25rem" }}>
              Click to upload your resume
            </p>
            <p style={{ color: "#64748b", fontSize: "0.85rem" }}>PDF up to 5MB</p>
          </div>
        )}
      </div>

      {error && (
        <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.5rem" }}>{error}</p>
      )}
    </div>
  );
}
