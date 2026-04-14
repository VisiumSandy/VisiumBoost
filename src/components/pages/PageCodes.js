"use client";

import { useState, useEffect, useCallback } from "react";

export default function PageCodes() {
  const [spins, setSpins] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [validating, setValidating] = useState(null);
  const [quickCode, setQuickCode] = useState("");
  const [quickResult, setQuickResult] = useState(null);
  const [quickLoading, setQuickLoading] = useState(false);

  const fetchSpins = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (statusFilter) params.set("status", statusFilter);
    const r = await fetch(`/api/user/validations?${params}`);
    const d = await r.json();
    setSpins(d.spins || []);
    setTotal(d.total || 0);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => { fetchSpins(); }, [fetchSpins]);

  const handleQuickValidate = async () => {
    if (!quickCode.trim()) return;
    setQuickLoading(true); setQuickResult(null);
    const r = await fetch("/api/user/validations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winCode: quickCode.trim() }),
    });
    const d = await r.json();
    setQuickResult({ ok: r.ok, ...d });
    setQuickLoading(false);
    if (r.ok) { setQuickCode(""); fetchSpins(); }
  };

  const handleValidate = async (winCode) => {
    setValidating(winCode);
    const r = await fetch("/api/user/validations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winCode }),
    });
    const d = await r.json();
    if (r.ok) fetchSpins();
    else alert(d.error || "Erreur");
    setValidating(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Validations</h1>
        <p className="text-slate-400 text-sm mt-1">Vérifiez et validez les codes gagnants de vos clients</p>
      </div>

      {/* Quick validate */}
      <div className="card p-6 mb-5">
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 5px", color: "#0F172A" }}>
          Valider un code en caisse
        </h3>
        <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 16px" }}>
          Le client vous présente son code — entrez-le ici pour le valider et lui remettre son cadeau.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            value={quickCode}
            onChange={e => { setQuickCode(e.target.value.toUpperCase()); setQuickResult(null); }}
            onKeyDown={e => e.key === "Enter" && handleQuickValidate()}
            placeholder="WIN-XXXX-XXXX"
            maxLength={12}
            style={{
              flex: "1 1 200px", padding: "12px 18px", borderRadius: 12,
              border: "2px solid #E2E8F0", fontSize: 18, fontWeight: 700,
              letterSpacing: 3, fontFamily: "'DM Mono', monospace",
              outline: "none", transition: "border-color 0.2s", background: "#fff",
              boxSizing: "border-box", color: "#0F172A",
            }}
            onFocus={e => e.target.style.borderColor = "#3B82F6"}
            onBlur={e => e.target.style.borderColor = "#E2E8F0"}
          />
          <button
            onClick={handleQuickValidate}
            disabled={quickLoading || !quickCode.trim()}
            className="btn-primary"
            style={{
              padding: "12px 28px", fontSize: 15, borderRadius: 12,
              opacity: quickLoading || !quickCode.trim() ? 0.5 : 1,
              cursor: quickLoading || !quickCode.trim() ? "not-allowed" : "pointer",
            }}
          >
            {quickLoading ? "Vérification…" : "Valider"}
          </button>
        </div>

        {quickResult && (
          <div style={{
            marginTop: 14, padding: "14px 18px", borderRadius: 12,
            background: quickResult.ok ? "#F0FDF4" : "#FEF2F2",
            border: `1.5px solid ${quickResult.ok ? "#BBF7D0" : "#FECACA"}`,
          }}>
            {quickResult.ok ? (
              <div>
                <p style={{ fontWeight: 700, color: "#166534", fontSize: 15, margin: "0 0 3px" }}>
                  ✓ Code valide — remettez le cadeau au client.
                </p>
                <p style={{ color: "#15803D", fontSize: 13, margin: 0 }}>
                  Récompense : <strong>{quickResult.rewardName}</strong> — {quickResult.entreprise}
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontWeight: 700, color: "#DC2626", fontSize: 14, margin: "0 0 3px" }}>
                  ✗ {quickResult.error}
                </p>
                {quickResult.validatedAt && (
                  <p style={{ fontSize: 12, color: "#EF4444", margin: 0 }}>
                    Code déjà utilisé le {new Date(quickResult.validatedAt).toLocaleString("fr-FR")}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value.toUpperCase())}
          placeholder="Rechercher WIN-XXXX-XXXX…"
          style={{
            flex: "1 1 200px", padding: "9px 14px", borderRadius: 10,
            border: "1.5px solid #E2E8F0", fontSize: 13, outline: "none",
            fontFamily: "'DM Mono', monospace", background: "#fff", color: "#0F172A",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "#3B82F6"}
          onBlur={e => e.target.style.borderColor = "#E2E8F0"}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            padding: "9px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0",
            fontSize: 13, outline: "none", background: "#fff", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", color: "#0F172A",
          }}
        >
          <option value="">Tous les codes</option>
          <option value="pending">En attente</option>
          <option value="validated">Validés</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div style={{
          display: "grid", gridTemplateColumns: "1.5fr 2fr 1.2fr 1fr 100px",
          padding: "11px 20px", background: "#FAFAFA", borderBottom: "1.5px solid #F1F5F9",
          fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.8,
        }}>
          <div>Code</div>
          <div>Cadeau gagné</div>
          <div>Établissement</div>
          <div>Date</div>
          <div style={{ textAlign: "center" }}>Statut</div>
        </div>

        {loading && (
          <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
            Chargement…
          </div>
        )}

        {!loading && spins.length === 0 && (
          <div style={{ padding: "52px 24px", textAlign: "center" }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, margin: "0 auto 14px",
              background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 24 }}>🎰</span>
            </div>
            <p style={{ fontWeight: 600, color: "#64748B", marginBottom: 5 }}>
              Aucun code {statusFilter === "pending" ? "en attente" : statusFilter === "validated" ? "validé" : "généré"} pour l&apos;instant
            </p>
            <p style={{ color: "#94A3B8", fontSize: 13 }}>
              Les codes apparaissent ici dès qu&apos;un client tourne la roue.
            </p>
          </div>
        )}

        {spins.map((spin) => (
          <div
            key={spin._id}
            style={{
              display: "grid", gridTemplateColumns: "1.5fr 2fr 1.2fr 1fr 100px",
              padding: "12px 20px", borderBottom: "1px solid #F8FAFC",
              alignItems: "center", fontSize: 13,
              background: spin.validated ? "#F0FDF4" : "#fff",
              transition: "background 0.12s",
            }}
          >
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontWeight: 700, fontSize: 13, color: "#0F172A", letterSpacing: 1,
            }}>
              {spin.winCode}
            </div>
            <div style={{ fontWeight: 600, color: "#1E293B" }}>{spin.rewardName}</div>
            <div style={{ color: "#64748B", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {spin.entrepriseId?.nom || "—"}
            </div>
            <div style={{ color: "#94A3B8", fontSize: 12 }}>
              {new Date(spin.createdAt).toLocaleDateString("fr-FR")}
              <br />
              <span style={{ fontSize: 11 }}>
                {new Date(spin.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div style={{ textAlign: "center" }}>
              {spin.validated ? (
                <span className="badge-success">✓ Validé</span>
              ) : (
                <button
                  onClick={() => handleValidate(spin.winCode)}
                  disabled={validating === spin.winCode}
                  className="btn-primary"
                  style={{
                    padding: "5px 14px", fontSize: 12, borderRadius: 8,
                    opacity: validating === spin.winCode ? 0.5 : 1,
                    cursor: validating === spin.winCode ? "not-allowed" : "pointer",
                  }}
                >
                  {validating === spin.winCode ? "…" : "Valider"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <p style={{ fontSize: 13, color: "#94A3B8", textAlign: "right", marginTop: 10 }}>
          {total} code{total > 1 ? "s" : ""} au total
        </p>
      )}
    </div>
  );
}
