"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/Icon";

/* ── Star rating display ─────────────────────────────────────────── */
function Stars({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            fill={i <= rating ? "#F59E0B" : "#E2E8F0"}
            stroke={i <= rating ? "#F59E0B" : "#E2E8F0"}
            strokeWidth="1"
          />
        </svg>
      ))}
    </div>
  );
}

/* ── Rating overview bar ────────────────────────────────────────── */
function RatingBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 12, color: "#64748B", width: 28, textAlign: "right", flexShrink: 0 }}>{label}★</span>
      <div style={{ flex: 1, height: 7, borderRadius: 99, background: "#F1F5F9", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 11, color: "#94A3B8", width: 24, flexShrink: 0 }}>{count}</span>
    </div>
  );
}

/* ── Single review card ─────────────────────────────────────────── */
function ReviewCard({ review, index }) {
  const [expanded, setExpanded] = useState(false);
  const MAX_LEN = 220;
  const isLong = (review.text || "").length > MAX_LEN;
  const text = isLong && !expanded ? review.text.slice(0, MAX_LEN) + "…" : (review.text || "");

  const date = review.time
    ? new Date(review.time * 1000).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : review.relative_time_description || "";

  return (
    <div
      style={{
        padding: "18px 20px", borderBottom: "1px solid #F8FAFC",
        animation: `fadeSlide 0.3s ease ${index * 0.04}s both`,
      }}
      onMouseEnter={e => e.currentTarget.style.background = "#FAFBFF"}
      onMouseLeave={e => e.currentTarget.style.background = "#fff"}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {/* Avatar */}
        <div style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          overflow: "hidden", border: "1.5px solid #E2E8F0",
          background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {review.profile_photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={review.profile_photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 16, fontWeight: 700, color: "#94A3B8" }}>
              {(review.author_name || "?").charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + date row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{review.author_name}</span>
              {review.author_url && (
                <a
                  href={review.author_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center" }}
                  title="Voir le profil Google"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              )}
            </div>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>{date}</span>
          </div>

          {/* Stars */}
          <div style={{ marginTop: 4, marginBottom: 8 }}>
            <Stars rating={review.rating} size={13} />
          </div>

          {/* Text */}
          {text ? (
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.65 }}>
              {text}
              {isLong && (
                <button
                  onClick={() => setExpanded(v => !v)}
                  style={{ marginLeft: 6, fontSize: 12, fontWeight: 600, color: "#2563EB", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  {expanded ? "Réduire" : "Voir plus"}
                </button>
              )}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "#CBD5E1", fontStyle: "italic" }}>Aucun commentaire écrit</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function PageAvis() {
  const [entreprises, setEntreprises] = useState([]);
  const [selectedEnt, setSelectedEnt] = useState(null);
  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [fetching, setFetching]       = useState(false);
  const [error, setError]             = useState("");
  const [filterRating, setFilterRating] = useState(0); // 0 = all

  /* Load entreprises */
  useEffect(() => {
    fetch("/api/entreprises")
      .then(r => r.json())
      .then(d => {
        const list = d.entreprises || [];
        setEntreprises(list);
        if (list.length > 0) setSelectedEnt(list[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Fetch reviews when etablissement changes */
  useEffect(() => {
    if (!selectedEnt) return;
    const placeId = extractPlaceId(selectedEnt.lien_avis);
    if (!placeId) { setData(null); setError(""); return; }

    setFetching(true);
    setError("");
    setData(null);
    setFilterRating(0);

    fetch(`/api/places/reviews?placeId=${encodeURIComponent(placeId)}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.detail || d.error);
        else setData(d);
      })
      .catch(() => setError("Erreur réseau"))
      .finally(() => setFetching(false));
  }, [selectedEnt]);

  const placeId = selectedEnt ? extractPlaceId(selectedEnt.lien_avis) : null;

  /* Rating distribution */
  const distribution = data ? [5, 4, 3, 2, 1].map(star => ({
    star,
    count: (data.reviews || []).filter(r => Math.round(r.rating) === star).length,
  })) : [];

  /* Filtered reviews */
  const reviews = data
    ? (filterRating === 0
        ? data.reviews
        : data.reviews.filter(r => Math.round(r.rating) === filterRating)
      )
    : [];

  const starColor = (r) => r >= 4.5 ? "#10B981" : r >= 3.5 ? "#F59E0B" : "#EF4444";

  if (loading) return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">Avis Google</h1>
      <div className="card p-12 text-center text-slate-300 text-sm">Chargement…</div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Avis Google</h1>
          <p className="text-slate-400 text-sm mt-1">Les avis les plus récents en premier</p>
        </div>

        {/* Établissement selector */}
        {entreprises.length > 1 && (
          <select
            value={selectedEnt?._id || ""}
            onChange={e => setSelectedEnt(entreprises.find(x => x._id === e.target.value) || null)}
            style={{
              padding: "8px 12px", borderRadius: 10, border: "1.5px solid #E2E8F0",
              fontSize: 13, fontWeight: 600, color: "#0F172A", background: "#fff",
              outline: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {entreprises.map(e => <option key={e._id} value={e._id}>{e.nom}</option>)}
          </select>
        )}
      </div>

      {/* No lien_avis configured */}
      {!placeId && selectedEnt && (
        <div style={{
          background: "linear-gradient(135deg,#EFF6FF,#F0F9FF)",
          border: "1.5px solid #BFDBFE", borderRadius: 16,
          padding: "22px 28px", display: "flex", gap: 18, alignItems: "flex-start",
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="mapPin" size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1E40AF", marginBottom: 4 }}>
              Lien Google Maps non configuré
            </div>
            <div style={{ fontSize: 13, color: "#3B82F6", lineHeight: 1.6 }}>
              Pour afficher vos avis, allez dans <strong>Mes entreprises</strong>, modifiez l&apos;établissement et recherchez-le via le champ <em>"Lien avis Google → Rechercher"</em>. Le lien doit contenir un <code style={{ background: "#DBEAFE", padding: "1px 5px", borderRadius: 4, fontSize: 12 }}>placeid</code> Google.
            </div>
          </div>
        </div>
      )}

      {/* API key error */}
      {error && (
        <div style={{
          background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 14,
          padding: "16px 20px", display: "flex", gap: 12, alignItems: "flex-start",
        }}>
          <div style={{ fontSize: 20, flexShrink: 0 }}>⚠️</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#B91C1C", marginBottom: 3 }}>Impossible de charger les avis</div>
            <div style={{ fontSize: 13, color: "#EF4444" }}>{error}</div>
          </div>
        </div>
      )}

      {/* Loading spinner */}
      {fetching && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "48px 0", color: "#94A3B8" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", border: "3px solid #E2E8F0", borderTopColor: "#3B82F6", animation: "spin 0.7s linear infinite" }} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Chargement des avis Google…</span>
        </div>
      )}

      {/* Reviews content */}
      {data && !fetching && (
        <>
          {/* Overview */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
            {/* Big rating */}
            <div className="card" style={{ padding: "20px 28px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 140 }}>
              <div style={{ fontSize: 52, fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>
                {data.rating?.toFixed(1) ?? "—"}
              </div>
              <Stars rating={Math.round(data.rating || 0)} size={16} />
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 6, textAlign: "center" }}>
                {data.totalRatings > 0 ? `${data.totalRatings.toLocaleString("fr-FR")} avis` : `${data.reviews.length} avis chargés`}
              </div>
            </div>

            {/* Distribution bars */}
            <div className="card" style={{ padding: "18px 22px", flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
              {distribution.map(({ star, count }) => (
                <RatingBar
                  key={star}
                  label={star}
                  count={count}
                  total={data.reviews.length}
                  color={star >= 4 ? "#10B981" : star === 3 ? "#F59E0B" : "#EF4444"}
                />
              ))}
            </div>

            {/* Quick stats */}
            <div className="card" style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12, justifyContent: "center", minWidth: 160 }}>
              {[
                { label: "5 étoiles", count: distribution.find(d => d.star === 5)?.count || 0, color: "#10B981" },
                { label: "4 étoiles", count: distribution.find(d => d.star === 4)?.count || 0, color: "#6EE7B7" },
                { label: "≤ 3 étoiles", count: distribution.filter(d => d.star <= 3).reduce((s,d) => s + d.count, 0), color: "#FCA5A5" },
              ].map(({ label, count, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 12, color: "#64748B" }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter + count bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[0, 5, 4, 3, 2, 1].map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRating(r)}
                  style={{
                    padding: "5px 13px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                    border: `1.5px solid ${filterRating === r ? "#2563EB" : "#E2E8F0"}`,
                    background: filterRating === r ? "#EFF6FF" : "#fff",
                    color: filterRating === r ? "#1D4ED8" : "#64748B",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                    fontFamily: "'DM Sans',sans-serif", transition: "all 0.12s",
                  }}
                >
                  {r === 0 ? "Tous" : <><span style={{ color: "#F59E0B" }}>★</span>{r}</>}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>
              {reviews.length} avis{filterRating > 0 ? ` à ${filterRating} ★` : ""}
              {" "}· <span style={{ color: "#64748B" }}>triés du plus récent au plus ancien</span>
            </div>
          </div>

          {/* Review list */}
          {reviews.length === 0 ? (
            <div className="card p-10 text-center text-slate-400 text-sm">
              Aucun avis pour ce filtre.
            </div>
          ) : (
            <div className="card overflow-hidden">
              {reviews.map((review, i) => (
                <ReviewCard key={`${review.time}-${i}`} review={review} index={i} />
              ))}
            </div>
          )}

          {/* Note about 5 reviews limit */}
          <div style={{
            marginTop: 16, padding: "11px 16px", borderRadius: 10,
            background: "#F8FAFC", border: "1px solid #E2E8F0",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>
              L&apos;API Google Places retourne les 5 avis les plus récents. Le total affiché ({data.totalRatings?.toLocaleString("fr-FR") || "?"}) est celui de votre fiche Google.
            </span>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeSlide { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────── */
function extractPlaceId(lienAvis) {
  if (!lienAvis) return null;
  try {
    const url = new URL(lienAvis);
    return url.searchParams.get("placeid") || null;
  } catch { return null; }
}
