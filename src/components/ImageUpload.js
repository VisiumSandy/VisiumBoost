"use client";

import { useState, useRef } from "react";
import Icon from "@/components/Icon";

/* ── Canvas crop modal ── */
function CropModal({ src, fileName, onConfirm, onCancel }) {
  const imgRef       = useRef(null);
  const containerRef = useRef(null);
  const dragRef      = useRef(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 100, h: 100 });

  const startDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const cx = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const cy = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    dragRef.current = { type, startX: cx, startY: cy, startCrop: { ...crop } };

    const move = (ev) => {
      if (!dragRef.current) return;
      const r = container.getBoundingClientRect();
      const px = Math.max(0, Math.min(100, ((ev.clientX - r.left) / r.width) * 100));
      const py = Math.max(0, Math.min(100, ((ev.clientY - r.top) / r.height) * 100));
      const dx = px - dragRef.current.startX;
      const dy = py - dragRef.current.startY;
      const sc = dragRef.current.startCrop;
      const MIN = 8;
      let { x, y, w, h } = sc;

      if (type === "move") {
        x = Math.max(0, Math.min(100 - w, sc.x + dx));
        y = Math.max(0, Math.min(100 - h, sc.y + dy));
      } else {
        if (type === "se" || type === "e") w = Math.max(MIN, Math.min(100 - sc.x, sc.w + dx));
        if (type === "se" || type === "s") h = Math.max(MIN, Math.min(100 - sc.y, sc.h + dy));
        if (type === "nw" || type === "w") {
          const nx = Math.max(0, Math.min(sc.x + sc.w - MIN, sc.x + dx));
          w = sc.x + sc.w - nx; x = nx;
        }
        if (type === "nw" || type === "n") {
          const ny = Math.max(0, Math.min(sc.y + sc.h - MIN, sc.y + dy));
          h = sc.y + sc.h - ny; y = ny;
        }
        if (type === "ne") {
          w = Math.max(MIN, Math.min(100 - sc.x, sc.w + dx));
          const ny = Math.max(0, Math.min(sc.y + sc.h - MIN, sc.y + dy));
          h = sc.y + sc.h - ny; y = ny;
        }
        if (type === "sw") {
          const nx = Math.max(0, Math.min(sc.x + sc.w - MIN, sc.x + dx));
          w = sc.x + sc.w - nx; x = nx;
          h = Math.max(MIN, Math.min(100 - sc.y, sc.h + dy));
        }
      }
      setCrop({ x, y, w, h });
    };

    const up = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const confirm = () => {
    const img = imgRef.current;
    if (!img) return;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const sx = (crop.x / 100) * iw;
    const sy = (crop.y / 100) * ih;
    const sw = (crop.w / 100) * iw;
    const sh = (crop.h / 100) * ih;
    const MAX = 1200;
    const scale = sw > 0 && sh > 0 ? Math.min(1, MAX / Math.max(sw, sh)) : 1;
    const canvas = document.createElement("canvas");
    canvas.width  = Math.round(sw * scale);
    canvas.height = Math.round(sh * scale);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => onConfirm(blob, fileName), "image/jpeg", 0.92);
  };

  const HS = 10; // handle size px
  const handles = [
    { type: "nw", top: `${crop.y}%`,          left: `${crop.x}%`,          cursor: "nw-resize" },
    { type: "ne", top: `${crop.y}%`,          left: `${crop.x + crop.w}%`, cursor: "ne-resize" },
    { type: "sw", top: `${crop.y + crop.h}%`, left: `${crop.x}%`,          cursor: "sw-resize" },
    { type: "se", top: `${crop.y + crop.h}%`, left: `${crop.x + crop.w}%`, cursor: "se-resize" },
  ];

  const pct = `${Math.round(crop.w)}% × ${Math.round(crop.h)}%`;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, maxWidth: 700, width: "100%",
        overflow: "hidden", boxShadow: "0 24px 72px rgba(0,0,0,0.35)",
      }}>
        {/* Header */}
        <div style={{
          padding: "15px 20px", borderBottom: "1px solid #E5E7EB",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="crop" size={16} color="#2563EB" />
            <span style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>Recadrer l&apos;image</span>
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 22, lineHeight: 1 }}>×</button>
        </div>

        {/* Canvas area */}
        <div style={{ padding: 16, background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            ref={containerRef}
            style={{ position: "relative", display: "inline-block", userSelect: "none", maxWidth: "100%", cursor: "default" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt="Recadrage"
              draggable={false}
              style={{ display: "block", maxWidth: 640, maxHeight: 400, objectFit: "contain" }}
            />

            {/* Dark overlay — 4 quadrants */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: `${crop.y}%`,                  background: "rgba(0,0,0,0.6)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${100 - crop.y - crop.h}%`, background: "rgba(0,0,0,0.6)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: `${crop.y}%`, left: 0, width: `${crop.x}%`, height: `${crop.h}%`,                background: "rgba(0,0,0,0.6)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: `${crop.y}%`, right: 0, width: `${100 - crop.x - crop.w}%`, height: `${crop.h}%`, background: "rgba(0,0,0,0.6)", pointerEvents: "none" }} />

            {/* Crop box */}
            <div
              onMouseDown={(e) => startDrag(e, "move")}
              style={{
                position: "absolute",
                top: `${crop.y}%`, left: `${crop.x}%`,
                width: `${crop.w}%`, height: `${crop.h}%`,
                border: "1.5px solid rgba(255,255,255,0.9)",
                cursor: "move", boxSizing: "border-box",
              }}
            >
              {/* Rule of thirds */}
              {[33.33, 66.66].map(p => (
                <div key={p} style={{ position: "absolute", top: `${p}%`, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.25)", pointerEvents: "none" }} />
              ))}
              {[33.33, 66.66].map(p => (
                <div key={p} style={{ position: "absolute", left: `${p}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.25)", pointerEvents: "none" }} />
              ))}
            </div>

            {/* Corner handles */}
            {handles.map((h) => (
              <div
                key={h.type}
                onMouseDown={(e) => startDrag(e, h.type)}
                style={{
                  position: "absolute", top: h.top, left: h.left,
                  width: HS, height: HS,
                  background: "#fff", border: "2px solid #2563EB",
                  borderRadius: 2, cursor: h.cursor,
                  transform: "translate(-50%, -50%)", zIndex: 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "13px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderTop: "1px solid #F1F5F9",
        }}>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>
            Zone sélectionnée : <strong style={{ color: "#475569" }}>{pct}</strong> de l&apos;image
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onCancel}
              className="btn-secondary"
              style={{ fontSize: 13, padding: "7px 15px" }}
            >
              Annuler
            </button>
            <button
              onClick={confirm}
              className="btn-primary"
              style={{ fontSize: 13, padding: "7px 15px" }}
            >
              Confirmer le recadrage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main ImageUpload component ── */
export default function ImageUpload({ value, onChange, label = "Logo" }) {
  const [mode, setMode]             = useState("upload"); // "upload" | "url"
  const [uploading, setUploading]   = useState(false);
  const [error, setError]           = useState("");
  const [urlInput, setUrlInput]     = useState("");
  const [dragging, setDragging]     = useState(false);
  const [cropSrc, setCropSrc]       = useState(null);
  const [cropFileName, setCropFileName] = useState("");
  const fileRef = useRef(null);

  const uploadBlob = async (blob, name) => {
    setError(""); setUploading(true);
    const fd = new FormData();
    fd.append("file", blob, name || "image.jpg");
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

  const handleFile = (file) => {
    if (!file) return;
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCropSrc(ev.target.result);
      setCropFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = (blob, name) => {
    setCropSrc(null);
    uploadBlob(blob, name);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleUrlApply = () => {
    const url = urlInput.trim();
    if (!url) return;
    setError("");
    onChange(url);
    setUrlInput("");
  };

  const tabBtn = (m) => ({
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
      {/* Crop modal */}
      {cropSrc && (
        <CropModal
          src={cropSrc}
          fileName={cropFileName}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}

      {label && (
        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 8 }}>
          {label}
        </label>
      )}

      {/* Current image preview */}
      {value && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            height: 52, maxWidth: 140, minWidth: 52,
            borderRadius: 10, border: "1.5px solid #E2E8F0",
            background: "#F8FAFC", padding: 6,
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
          <span style={{ fontSize: 12, color: "#94A3B8" }}>Image actuelle</span>
        </div>
      )}

      {/* Mode tabs */}
      <div style={{
        display: "flex", gap: 0, marginBottom: 10,
        borderRadius: 9, overflow: "hidden",
        border: "1.5px solid #E2E8F0", width: "fit-content",
      }}>
        <button onClick={() => setMode("upload")} style={tabBtn("upload")}>Uploader un fichier</button>
        <button onClick={() => setMode("url")}    style={tabBtn("url")}>Coller une URL</button>
      </div>

      {/* Upload drop zone */}
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
                Glissez votre image ici ou{" "}
                <span style={{ color: "#2563EB", fontWeight: 700 }}>parcourir</span>
              </p>
              <p style={{ fontSize: 11, color: "#CBD5E1", margin: 0 }}>
                PNG, JPG, WebP, SVG · Max 2 Mo · Recadrage avant envoi
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
