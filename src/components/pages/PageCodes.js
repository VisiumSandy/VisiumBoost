"use client";

import { useState, useEffect, useCallback } from "react";

export default function PageCodes() {
  const [spins, setSpins] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actioning, setActioning] = useState(null); // winCode en cours
  const [quickCode, setQuickCode] = useState("");
  const [quickResult, setQuickResult] = useState(null);
  const [quickLoading, setQuickLoading] = useState(false);

  // Mode Caisse
  const [caisseMode, setCaisseMode] = useState(false);
  const [caisseCode, setCaisseCode] = useState("");
  const [caisseResult, setCaisseResult] = useState(null);
  const [caisseLoading, setCaisseLoading] = useState(false);

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
      body: JSON.stringify({ winCode: quickCode.trim(), action: "validate" }),
    });
    const d = await r.json();
    setQuickResult({ ok: r.ok, ...d });
    setQuickLoading(false);
    if (r.ok) { setQuickCode(""); fetchSpins(); }
  };

  const handleCaisseValidate = async () => {
    if (!caisseCode.trim()) return;
    setCaisseLoading(true); setCaisseResult(null);
    const r = await fetch("/api/user/validations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winCode: caisseCode.trim(), action: "validate" }),
    });
    const d = await r.json();
    setCaisseResult({ ok: r.ok, ...d });
    setCaisseLoading(false);
    if (r.ok) { setCaisseCode(""); fetchSpins(); }
    setTimeout(() => { setCaisseResult(null); setCaisseCode(""); }, 4000);
  };

  const handleAction = async (winCode, action) => {
    setActioning(winCode + "_" + action);
    const r = await fetch("/api/user/validations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winCode, action }),
    });
    const d = await r.json();
    if (r.ok) fetchSpins();
    else alert(d.error || "Erreur");
    setActioning(null);
  };

  // Détermine le statut d'un spin
  const getStatus = (spin) => {
    if (spin.expired)   return "expired";
    if (spin.validated) return "validated";
    return "pending";
  };

  const STATUS_STYLES = {
    pending:   { bg: "#fff",     border: "#E2E8F0", label: "" },
    validated: { bg: "#F0FDF4",  border: "#BBF7D0", label: "" },
    expired:   { bg: "#FFF5F5",  border: "#FED7D7", label: "" },
  };

  return (
    <div className="animate-fade-in">
      {/* Mode Caisse Overlay */}
      {caisseMode && (
        <div style={{
          position: "fixed", inset: 0, background: "#fff",
          zIndex: 100, display: "flex", flexDirection: "column",
        }}>
          {/* Top bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 28px", borderBottom: "1.5px solid #E2E8F0",
            background: "#FAFAFA",
          }}>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#0F172A", letterSpacing: "-0.3px" }}>
              Mode Caisse — VisiumBoost
            </span>
            <button
              onClick={() => { setCaisseMode(false); setCaisseCode(""); setCaisseResult(null); }}
              style={{
                padding: "9px 20px", borderRadius: 10, border: "1.5px solid #E2E8F0",
                background: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                color: "#64748B", fontFamily: "inherit",
              }}
            >
              Quitter
            </button>
          </div>

          {/* Center */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "32px 24px",
          }}>
            <p style={{ fontSize: 15, color: "#64748B", marginBottom: 28, textAlign: "center" }}>
              Saisissez le code du client et appuyez sur VALIDER
            </p>
            <input
              value={caisseCode}
              onChange={e => { setCaisseCode(e.target.value.toUpperCase()); setCaisseResult(null); }}
              onKeyDown={e => e.key === "Enter" && handleCaisseValidate()}
              placeholder="WIN-XXXX-XXXX"
              maxLength={20}
              autoFocus
              style={{
                width: "100%", maxWidth: 420, padding: "18px 24px",
                borderRadius: 16, border: "2.5px solid #E2E8F0",
                fontSize: 32, fontWeight: 700, letterSpacing: 6,
                fontFamily: "'DM Mono','JetBrains Mono',monospace",
                outline: "none", textAlign: "center", color: "#0F172A",
                background: "#F8FAFC", boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#3B82F6"}
              onBlur={e => e.target.style.borderColor = "#E2E8F0"}
            />
            <button
              onClick={handleCaisseValidate}
              disabled={caisseLoading || !caisseCode.trim()}
              style={{
                width: "100%", maxWidth: 420, marginTop: 18,
                padding: "18px 0", borderRadius: 16, border: "none",
                background: caisseLoading || !caisseCode.trim()
                  ? "#CBD5E1"
                  : "linear-gradient(135deg, #2563EB, #0EA5E9)",
                color: "#fff", fontWeight: 800, fontSize: 20,
                cursor: caisseLoading || !caisseCode.trim() ? "not-allowed" : "pointer",
                letterSpacing: 2, fontFamily: "inherit",
                boxShadow: caisseLoading || !caisseCode.trim() ? "none" : "0 6px 24px rgba(37,99,235,0.3)",
                transition: "all 0.2s",
              }}
            >
              {caisseLoading ? "Vérification…" : "VALIDER"}
            </button>

            {caisseResult && (
              <div style={{
                width: "100%", maxWidth: 420, marginTop: 22,
                padding: "20px 24px", borderRadius: 16,
                background: caisseResult.ok ? "#F0FDF4" : "#FEF2F2",
                border: `2px solid ${caisseResult.ok ? "#BBF7D0" : "#FECACA"}`,
              }}>
                {caisseResult.ok ? (
                  <div>
                    <p style={{ fontWeight: 800, color: "#166534", fontSize: 20, margin: "0 0 6px", textAlign: "center" }}>
                      ✓ Code valide !
                    </p>
                    <p style={{ color: "#15803D", fontSize: 16, margin: 0, textAlign: "center" }}>
                      Récompense : <strong>{caisseResult.rewardName}</strong>
                    </p>
                    <p style={{ color: "#16A34A", fontSize: 14, margin: "4px 0 0", textAlign: "center" }}>
                      {caisseResult.entreprise}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontWeight: 800, color: "#DC2626", fontSize: 18, margin: "0 0 6px", textAlign: "center" }}>
                      ✗ {caisseResult.error}
                    </p>
                    {caisseResult.validatedAt && (
                      <p style={{ fontSize: 13, color: "#EF4444", margin: 0, textAlign: "center" }}>
                        Utilisé le {new Date(caisseResult.validatedAt).toLocaleString("fr-FR")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-7" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Codes clients</h1>
          <p className="text-slate-400 text-sm mt-1">Vérifiez et gérez les codes gagnants de vos clients</p>
        </div>
        <button
          onClick={() => setCaisseMode(true)}
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", fontSize: 14, borderRadius: 12 }}
        >
          <span>🏪</span> Mode Caisse
        </button>
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
            maxLength={20}
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
          placeholder="Rechercher par code, nom ou email…"
          style={{
            flex: "1 1 220px", padding: "9px 14px", borderRadius: 10,
            border: "1.5px solid #E2E8F0", fontSize: 13, outline: "none",
            background: "#fff", color: "#0F172A", transition: "border-color 0.2s",
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
            color: "#0F172A",
          }}
        >
          <option value="">Tous les codes</option>
          <option value="pending">En attente</option>
          <option value="validated">Validés</option>
          <option value="expired">Expirés</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1.4fr 1.6fr 1.1fr 0.9fr 150px",
          padding: "11px 16px", background: "#FAFAFA", borderBottom: "1.5px solid #F1F5F9",
          fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.8,
        }}>
          <div>Code</div>
          <div>Client</div>
          <div>Cadeau · Établissement</div>
          <div>Contact</div>
          <div>Date</div>
          <div style={{ textAlign: "center" }}>Actions</div>
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
              Aucun code{" "}
              {statusFilter === "pending" ? "en attente" : statusFilter === "validated" ? "validé" : statusFilter === "expired" ? "expiré" : "généré"}{" "}
              pour l&apos;instant
            </p>
            <p style={{ color: "#94A3B8", fontSize: 13 }}>
              Les codes apparaissent ici dès qu&apos;un client tourne la roue.
            </p>
          </div>
        )}

        {spins.map((spin) => {
          const status = getStatus(spin);
          const styles = STATUS_STYLES[status];
          return (
            <div
              key={spin._id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.3fr 1.4fr 1.6fr 1.1fr 0.9fr 150px",
                padding: "13px 16px", borderBottom: "1px solid #F8FAFC",
                alignItems: "center", fontSize: 13,
                background: styles.bg,
                transition: "background 0.12s",
              }}
            >
              {/* Code */}
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontWeight: 700, fontSize: 12, color: "#0F172A", letterSpacing: 1,
              }}>
                {spin.winCode}
              </div>

              {/* Client */}
              <div>
                <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 13 }}>
                  {spin.clientName || <span style={{ color: "#CBD5E1", fontStyle: "italic" }}>—</span>}
                </div>
                <div style={{ color: "#64748B", fontSize: 11, marginTop: 1 }}>
                  {spin.clientEmail || ""}
                </div>
              </div>

              {/* Cadeau + établissement */}
              <div>
                <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 13 }}>{spin.rewardName}</div>
                <div style={{ color: "#94A3B8", fontSize: 11, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {spin.entrepriseId?.nom || "—"}
                </div>
              </div>

              {/* Téléphone */}
              <div style={{ color: "#64748B", fontSize: 12 }}>
                {spin.clientPhone || <span style={{ color: "#CBD5E1" }}>—</span>}
              </div>

              {/* Date */}
              <div style={{ color: "#94A3B8", fontSize: 11 }}>
                {new Date(spin.createdAt).toLocaleDateString("fr-FR")}
                <br />
                <span style={{ fontSize: 10 }}>
                  {new Date(spin.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap" }}>
                {status === "validated" && (
                  <span style={{
                    padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                    background: "#DCFCE7", color: "#15803D", border: "1px solid #BBF7D0",
                    whiteSpace: "nowrap",
                  }}>
                    ✓ Validé
                  </span>
                )}
                {status === "expired" && (
                  <span style={{
                    padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                    background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA",
                    whiteSpace: "nowrap",
                  }}>
                    ✗ Expiré
                  </span>
                )}
                {status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAction(spin.winCode, "validate")}
                      disabled={actioning === spin.winCode + "_validate"}
                      style={{
                        padding: "5px 10px", fontSize: 11, borderRadius: 8, border: "none",
                        background: actioning === spin.winCode + "_validate" ? "#E2E8F0" : "#DCFCE7",
                        color: actioning === spin.winCode + "_validate" ? "#94A3B8" : "#15803D",
                        cursor: actioning === spin.winCode + "_validate" ? "not-allowed" : "pointer",
                        fontWeight: 700, whiteSpace: "nowrap",
                        transition: "all 0.15s",
                      }}
                    >
                      {actioning === spin.winCode + "_validate" ? "…" : "✓ Valider"}
                    </button>
                    <button
                      onClick={() => handleAction(spin.winCode, "expire")}
                      disabled={actioning === spin.winCode + "_expire"}
                      style={{
                        padding: "5px 10px", fontSize: 11, borderRadius: 8, border: "none",
                        background: actioning === spin.winCode + "_expire" ? "#E2E8F0" : "#FEE2E2",
                        color: actioning === spin.winCode + "_expire" ? "#94A3B8" : "#DC2626",
                        cursor: actioning === spin.winCode + "_expire" ? "not-allowed" : "pointer",
                        fontWeight: 700, whiteSpace: "nowrap",
                        transition: "all 0.15s",
                      }}
                    >
                      {actioning === spin.winCode + "_expire" ? "…" : "✗ Expirer"}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {total > 0 && (
        <p style={{ fontSize: 13, color: "#94A3B8", textAlign: "right", marginTop: 10 }}>
          {total} code{total > 1 ? "s" : ""} au total
        </p>
      )}
    </div>
  );
}
