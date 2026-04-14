"use client";

import { useState, useRef } from "react";
import Icon from "@/components/Icon";

export default function ImageUpload({ value, onChange, label = "Logo" }) {
  const [mode, setMode]           = useState("upload"); // "upload" | "url"
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const [urlInput, setUrlInput]   = useState("");
  const [dragging, setDragging]   = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError(""); setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await r.json();
      if (r.ok) {
        onChange(d.url);
      } else {
        setError(d.error || "Erreur lors de l'upload");
      }
    } catch {
      setError("Erreur réseau, réessayez.");
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = ""; // reset pour repermetre le même fichier
  };

  const handleUrlApply = () => {
    const url = urlInput.trim();
    if (!url) return;
    setError("");
    onChange(url);
    setUrlInput("");
  };

  const tabBtn = (m, labelText) => ({
    padding: "6px 16px", fontSize: 12, fontWeight: 600, border: "none",
    cursor: "pointer", transition: "all 0.15s",
    background: mode === m ? "#2563EB" : "#fff",
    color:      mode === m ? "#fff"    : "#64748B",
  });

  const inp = {
    flex: 1, padding: "10px 13px", borderRadius: 10,
    border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none",
    background: "#fff", boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif", color: "#0F172A",
    transition: "border-color 0.2s",
  };

  return (
    <div>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 8 }}>
          {label}
        </label>
      )}

      {/* Aperçu du logo actuel */}
      {value && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            height: 52, maxWidth: 140, minWidth: 52,
            borderRadius: 10, border: "1.5px solid #E2E8F0",
            background: "#F8FAFC", padding: 6,
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          }}>
            <img
              src={value}
              alt="Logo"
              style={{ maxHeight: 40, maxWidth: 128, objectFit: "contain" }}
              onError={e => { e.target.style.display = "none"; }}
            />
          </div>
          <button
            onClick={() => onChange("")}
            title="Supprimer le logo"
            style={{
              width: 28, height: 28, borderRadius: 8, border: "none",
              background: "#FEF2F2", color: "#EF4444",
              cursor: "pointer", fontSize: 16, display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            ×
          </button>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>Logo actuel</span>
        </div>
      )}

      {/* Onglets */}
      <div style={{
        display: "flex", gap: 0, marginBottom: 10,
        borderRadius: 9, overflow: "hidden",
        border: "1.5px solid #E2E8F0", width: "fit-content",
      }}>
        <button onClick={() => setMode("upload")} style={tabBtn("upload")}>
          Uploader un fichier
        </button>
        <button onClick={() => setMode("url")} style={tabBtn("url")}>
          Coller une URL
        </button>
      </div>

      {/* Zone upload */}
      {mode === "upload" && (
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => !uploading && fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "#2563EB" : "#E2E8F0"}`,
            borderRadius: 12, padding: "24px 20px", textAlign: "center",
            cursor: uploading ? "not-allowed" : "pointer",
            background: dragging ? "#EFF6FF" : "#FAFAFA",
            transition: "all 0.2s",
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            style={{ display: "none" }}
            onChange={handleFileInput}
          />
          {uploading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <style>{`@keyframes iSpin { to { transform: rotate(360deg); } }`}</style>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                border: "3px solid #E2E8F0", borderTopColor: "#2563EB",
                animation: "iSpin 0.8s linear infinite",
              }} />
              <span style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>Upload en cours…</span>
            </div>
          ) : (
            <>
              <Icon name="upload" size={26} color={dragging ? "#2563EB" : "#CBD5E1"} />
              <p style={{ fontSize: 13, color: "#64748B", margin: "8px 0 4px", fontWeight: 500 }}>
                Glissez votre logo ici ou{" "}
                <span style={{ color: "#2563EB", fontWeight: 700 }}>parcourir</span>
              </p>
              <p style={{ fontSize: 11, color: "#CBD5E1", margin: 0 }}>
                PNG, JPG, WebP, SVG · Max 2 Mo
              </p>
            </>
          )}
        </div>
      )}

      {/* URL paste */}
      {mode === "url" && (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleUrlApply()}
            placeholder="https://exemple.com/logo.png"
            style={inp}
            onFocus={e => e.target.style.borderColor = "#3B82F6"}
            onBlur={e => e.target.style.borderColor = "#E2E8F0"}
          />
          <button
            onClick={handleUrlApply}
            disabled={!urlInput.trim()}
            className="btn-primary"
            style={{
              padding: "10px 16px", fontSize: 13, borderRadius: 10, flexShrink: 0,
              opacity: urlInput.trim() ? 1 : 0.5,
              cursor: urlInput.trim() ? "pointer" : "not-allowed",
            }}
          >
            Appliquer
          </button>
        </div>
      )}

      {error && (
        <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8, fontWeight: 600 }}>
          {error}
        </p>
      )}
    </div>
  );
}
