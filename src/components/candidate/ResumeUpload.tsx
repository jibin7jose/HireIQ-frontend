import { useState, useRef } from "react";
import { Loader2, FileText, UploadCloud, FileType } from "lucide-react";
import api from "@/lib/api";

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
      const res = await api.post("/users/me/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUploadSuccess(res.data.url);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-4">
      {currentResumeUrl && (
        <div className="mb-4 flex items-center space-x-2 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 w-max">
          <FileText className="w-5 h-5 text-blue-400" />
          <a
            href={currentResumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
          >
            View Current Resume
          </a>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center relative transition-all duration-200 ${
          isUploading
            ? "border-neutral-700 bg-neutral-900/50 cursor-wait"
            : "border-neutral-700 hover:border-blue-500 bg-neutral-900 hover:bg-neutral-800 cursor-pointer"
        }`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
            <p className="text-blue-400 font-medium">Uploading and Parsing Resume...</p>
            <p className="text-neutral-500 text-sm mt-1">Our AI is extracting your skills and experience.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="bg-neutral-800 p-4 rounded-full mb-4 group-hover:bg-neutral-700 transition-colors">
              <UploadCloud className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-white font-semibold mb-1">
              Click to upload your resume
            </p>
            <p className="text-neutral-500 text-sm flex items-center">
              <FileType className="w-4 h-4 mr-1" /> PDF up to 5MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
