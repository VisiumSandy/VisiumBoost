"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════
const PLAN_LABELS = { free: "Essentiel", starter: "Starter", pro: "Pro" };
const PLAN_COLORS = { free: "#94A3B8", starter: "#00B894", pro: "#6C5CE7" };
const TABS = [
  { id: "overview",      label: "Vue d'ensemble" },
  { id: "clients",       label: "Clients" },
  { id: "etablissements",label: "Établissements" },
  { id: "codes",         label: "Codes" },
];

// ═══════════════════════════════════════════════════════════
// TINY HELPERS
// ═══════════════════════════════════════════════════════════
function fmt(n) { return (n ?? 0).toLocaleString("fr-FR"); }
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}
function daysLeft(d) {
  if (!d) return 0;
  return Math.max(0, Math.ceil((new Date(d) - Date.now()) / 86400000));
}

// ═══════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════
function KPICard({ icon, label, value, sub, color = "#6C5CE7", trend }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 18, padding: "22px 24px",
      border: "1.5px solid #F0F0F5", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      flex: "1 1 175px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11, background: `${color}18`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>{icon}</div>
        {trend && (
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: trend.startsWith("+") ? "#00B894" : "#E17055",
            background: trend.startsWith("+") ? "#00B89418" : "#E1705518",
            padding: "3px 8px", borderRadius: 8,
          }}>{trend}</span>
        )}
      </div>
      <div style={{ fontFamily: "'Calistoga',serif", fontSize: 30, color: "#0F0F1A", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#718096", marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#b2bec3", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function PlanBadge({ plan }) {
  const c = PLAN_COLORS[plan] || "#94A3B8";
  return (
    <span style={{
      padding: "3px 9px", borderRadius: 8, fontSize: 11, fontWeight: 700,
      background: `${c}18`, color: c, border: `1px solid ${c}30`,
    }}>{PLAN_LABELS[plan] || plan}</span>
  );
}

function StatusDot({ active }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600,
      color: active ? "#00B894" : "#E17055" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: active ? "#00B894" : "#E17055", display: "inline-block" }} />
      {active ? "Actif" : "Inactif"}
    </span>
  );
}

function Btn({ children, onClick, variant = "default", disabled, style: s }) {
  const base = {
    padding: "8px 16px", borderRadius: 10, border: "none", fontWeight: 700,
    fontSize: 13, cursor: disabled ? "default" : "pointer", transition: "all 0.15s",
    fontFamily: "'Inter',sans-serif", opacity: disabled ? 0.5 : 1,
    ...s,
  };
  const variants = {
    default:  { background: "#0F0F1A", color: "#fff" },
    outline:  { background: "#fff", color: "#0F0F1A", border: "1.5px solid #E2E8F0" },
    danger:   { background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA" },
    success:  { background: "#F0FDF4", color: "#16A34A", border: "1.5px solid #BBF7D0" },
    violet:   { background: "#6C5CE7", color: "#fff" },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>{children}</button>;
}

function Input({ label, value, onChange, type = "text", placeholder, small }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>}
      <input
        type={type} value={value ?? ""} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          padding: small ? "7px 11px" : "10px 13px", borderRadius: 10,
          border: `1.5px solid ${focus ? "#6C5CE7" : "#E2E8F0"}`,
          fontSize: small ? 12 : 13, outline: "none", fontFamily: "'Inter',sans-serif",
          background: "#fff", width: "100%", boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
      />
    </div>
  );
}

function Overlay({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        zIndex: 200, backdropFilter: "blur(2px)",
      }}
    />
  );
}

function Toast({ msg, ok, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: ok ? "#F0FDF4" : "#FEF2F2",
      border: `1.5px solid ${ok ? "#BBF7D0" : "#FECACA"}`,
      color: ok ? "#166534" : "#DC2626",
      borderRadius: 14, padding: "12px 18px", fontSize: 13, fontWeight: 600,
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 10,
      animation: "slideUp 0.25s ease",
    }}>
      {ok ? "✓" : "✗"} {msg}
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.5, fontSize: 15, color: "inherit" }}>×</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CLIENT DETAIL DRAWER
// ═══════════════════════════════════════════════════════════
function ClientDrawer({ clientId, onClose, onSaved, onDeleted, showToast }) {
  const [client, setClient] = useState(null);
  const [entreprises, setEntreprises] = useState([]);
  const [codes, setCodes] = useState([]);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [section, setSection] = useState("info"); // info | etablissements | codes | danger

  const load = useCallback(async () => {
    const [cR, eR, coR] = await Promise.all([
      fetch(`/api/admin/clients?q=`).then(r => r.json()),
      fetch(`/api/admin/entreprises?userId=${clientId}`).then(r => r.json()),
      fetch(`/api/admin/codes?userId=${clientId}&page=1`).then(r => r.json()),
    ]);
    const found = cR.clients?.find(c => c._id === clientId);
    if (found) {
      setClient(found);
      setForm({
        name: found.name, email: found.email, businessName: found.businessName || "",
        phone: found.phone || "", googleLink: found.googleLink || "",
        plan: found.plan, active: found.active,
        trialEndsAt: found.trialEndsAt ? found.trialEndsAt.split("T")[0] : "",
      });
    }
    setEntreprises(eR.entreprises || []);
    setCodes(coR.codes || []);
  }, [clientId]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/admin/clients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: clientId, ...form }),
      });
      const d = await r.json();
      if (d.user) { showToast("Client mis à jour", true); onSaved(); load(); }
      else showToast(d.error || "Erreur", false);
    } finally { setSaving(false); }
  };

  const renewTrial = async () => {
    await fetch("/api/admin/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: clientId, renewTrial: true }),
    });
    showToast("Essai renouvelé (+ 14 jours)", true);
    onSaved(); load();
  };

  const deleteClient = async () => {
    if (!confirm(`Supprimer définitivement ${client?.name} ? Toutes ses données seront perdues.`)) return;
    setDeleting(true);
    await fetch("/api/admin/clients", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: clientId }),
    });
    showToast("Client supprimé", true);
    onDeleted();
    onClose();
  };

  const deleteEntreprise = async (entId, nom) => {
    if (!confirm(`Supprimer l'établissement "${nom}" ?`)) return;
    await fetch("/api/admin/entreprises", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entrepriseId: entId }),
    });
    showToast(`"${nom}" supprimé`, true);
    load();
  };

  const toggleEntActive = async (ent) => {
    await fetch("/api/admin/entreprises", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entrepriseId: ent._id, active: !ent.active }),
    });
    load();
  };

  const deleteCode = async (codeId) => {
    await fetch("/api/admin/codes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codeId }),
    });
    load();
  };

  const deleteAllCodes = async () => {
    if (!confirm("Supprimer TOUS les codes de ce client ?")) return;
    await fetch("/api/admin/codes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: clientId, deleteAll: true }),
    });
    showToast("Codes supprimés", true);
    load();
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const drawerSections = [
    { id: "info", label: "Infos" },
    { id: "etablissements", label: `Établissements (${entreprises.length})` },
    { id: "codes", label: `Codes (${codes.length})` },
    { id: "danger", label: "Danger" },
  ];

  return (
    <>
      <Overlay onClose={onClose} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 520,
        background: "#fff", zIndex: 300, display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.15)", overflowY: "auto",
      }}>
        {/* Drawer header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1.5px solid #F0F0F5",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#FAFAFA", position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", background: "#6C5CE720",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 700, color: "#6C5CE7",
              fontFamily: "'Calistoga',serif",
            }}>
              {client?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#0F0F1A" }}>{client?.name || "…"}</div>
              <div style={{ fontSize: 12, color: "#8896A5" }}>{client?.email}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 9, border: "1.5px solid #E2E8F0",
            background: "#fff", cursor: "pointer", fontSize: 16, display: "flex",
            alignItems: "center", justifyContent: "center", color: "#8896A5",
          }}>×</button>
        </div>

        {/* Section tabs */}
        <div style={{ display: "flex", gap: 2, padding: "12px 16px", borderBottom: "1.5px solid #F0F0F5" }}>
          {drawerSections.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)} style={{
              padding: "6px 14px", borderRadius: 9, border: "none", fontSize: 12, fontWeight: 700,
              cursor: "pointer", background: section === s.id ? "#0F0F1A" : "transparent",
              color: section === s.id ? "#fff" : "#8896A5", fontFamily: "'Inter',sans-serif",
              transition: "all 0.15s",
            }}>{s.label}</button>
          ))}
        </div>

        <div style={{ padding: "24px", flex: 1 }}>

          {/* ── INFO SECTION ── */}
          {section === "info" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input label="Nom" value={form.name} onChange={v => f("name", v)} />
                <Input label="Email" value={form.email} onChange={v => f("email", v)} type="email" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input label="Entreprise" value={form.businessName} onChange={v => f("businessName", v)} />
                <Input label="Téléphone" value={form.phone} onChange={v => f("phone", v)} />
              </div>
              <Input label="Lien Google" value={form.googleLink} onChange={v => f("googleLink", v)} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {/* Plan */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.5 }}>Plan</label>
                  <select value={form.plan} onChange={e => f("plan", e.target.value)} style={{
                    padding: "10px 13px", borderRadius: 10, border: "1.5px solid #E2E8F0",
                    fontSize: 13, fontFamily: "'Inter',sans-serif", background: "#fff", outline: "none",
                  }}>
                    {Object.entries(PLAN_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                {/* Active */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.5 }}>Statut</label>
                  <select value={form.active ? "true" : "false"} onChange={e => f("active", e.target.value === "true")} style={{
                    padding: "10px 13px", borderRadius: 10, border: "1.5px solid #E2E8F0",
                    fontSize: 13, fontFamily: "'Inter',sans-serif", background: "#fff", outline: "none",
                  }}>
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </select>
                </div>
              </div>

              {/* Trial */}
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Essai gratuit</div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}>
                    <Input label="Date expiration" value={form.trialEndsAt} onChange={v => f("trialEndsAt", v)} type="date" />
                  </div>
                  <Btn variant="success" onClick={renewTrial} style={{ whiteSpace: "nowrap", marginBottom: 1 }}>
                    +14 jours
                  </Btn>
                </div>
                {client?.trialEndsAt && (
                  <div style={{ fontSize: 12, color: "#8896A5", marginTop: 8 }}>
                    {daysLeft(client.trialEndsAt) > 0
                      ? `${daysLeft(client.trialEndsAt)} jour(s) restant(s)`
                      : "Essai expiré"}
                    {" — "}expire le {fmtDate(client.trialEndsAt)}
                  </div>
                )}
              </div>

              {/* Stats */}
              {client && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Scans", v: fmt(client.totalScans) },
                    { label: "Avis", v: fmt(client.totalReviews) },
                    { label: "Inscrit", v: fmtDate(client.createdAt) },
                  ].map(s => (
                    <div key={s.label} style={{ background: "#F8FAFC", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                      <div style={{ fontSize: 17, fontWeight: 800, color: "#0F0F1A", fontFamily: "'Calistoga',serif" }}>{s.v}</div>
                      <div style={{ fontSize: 11, color: "#8896A5", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              <Btn variant="violet" onClick={save} disabled={saving} style={{ width: "100%", padding: "12px" }}>
                {saving ? "Enregistrement…" : "Enregistrer les modifications"}
              </Btn>
            </div>
          )}

          {/* ── ÉTABLISSEMENTS SECTION ── */}
          {section === "etablissements" && (
            <div>
              {entreprises.length === 0 ? (
                <p style={{ color: "#b2bec3", fontSize: 13, textAlign: "center", padding: "32px 0" }}>Aucun établissement</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {entreprises.map(e => (
                    <div key={e._id} style={{
                      border: "1.5px solid #F0F0F5", borderRadius: 14, padding: "14px 16px",
                      background: "#FAFAFA",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#0F0F1A" }}>{e.nom}</div>
                          <div style={{ fontSize: 11, color: "#8896A5", fontFamily: "'DM Mono',monospace" }}>/{e.slug}</div>
                        </div>
                        <StatusDot active={e.active} />
                      </div>
                      <div style={{ fontSize: 12, color: "#8896A5", marginBottom: 10 }}>
                        {e.rewards?.length || 0} lot(s) · {fmt(e.totalScans)} scans · {fmt(e.totalReviews)} avis
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Btn variant="outline" onClick={() => toggleEntActive(e)} style={{ fontSize: 12, padding: "5px 12px" }}>
                          {e.active ? "Désactiver" : "Activer"}
                        </Btn>
                        <Btn variant="danger" onClick={() => deleteEntreprise(e._id, e.nom)} style={{ fontSize: 12, padding: "5px 12px" }}>
                          Supprimer
                        </Btn>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CODES SECTION ── */}
          {section === "codes" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 13, color: "#8896A5" }}>{codes.length} code(s) chargé(s)</span>
                {codes.length > 0 && (
                  <Btn variant="danger" onClick={deleteAllCodes} style={{ fontSize: 11, padding: "5px 12px" }}>
                    Tout supprimer
                  </Btn>
                )}
              </div>
              {codes.length === 0 ? (
                <p style={{ color: "#b2bec3", fontSize: 13, textAlign: "center", padding: "32px 0" }}>Aucun code</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {codes.map(c => (
                    <div key={c._id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px", borderRadius: 10, border: "1px solid #F0F0F5",
                      background: c.used ? "#F8FAFC" : "#fff",
                    }}>
                      <div>
                        <span style={{
                          fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 700,
                          color: c.used ? "#94A3B8" : "#0F0F1A",
                          textDecoration: c.used ? "line-through" : "none",
                        }}>{c.code}</span>
                        <span style={{ fontSize: 11, color: "#b2bec3", marginLeft: 10 }}>
                          {c.used ? `Utilisé le ${fmtDate(c.usedAt)}` : `Créé le ${fmtDate(c.createdAt)}`}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteCode(c._id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", fontSize: 16, padding: "2px 6px" }}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── DANGER SECTION ── */}
          {section === "danger" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                background: "#FEF2F2", border: "1.5px solid #FECACA",
                borderRadius: 14, padding: "18px 20px",
              }}>
                <div style={{ fontWeight: 700, color: "#DC2626", fontSize: 14, marginBottom: 6 }}>
                  Supprimer le compte
                </div>
                <p style={{ fontSize: 13, color: "#B91C1C", lineHeight: 1.6, margin: "0 0 14px" }}>
                  Cette action est <strong>irréversible</strong>. Le compte, tous les établissements et codes associés seront définitivement supprimés.
                </p>
                <Btn variant="danger" onClick={deleteClient} disabled={deleting} style={{ fontSize: 13 }}>
                  {deleting ? "Suppression…" : `Supprimer ${client?.name}`}
                </Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// ÉTABLISSEMENT EDIT MODAL
// ═══════════════════════════════════════════════════════════
function EntrepriseModal({ ent, onClose, onSaved, showToast }) {
  const [form, setForm] = useState({
    nom: ent.nom || "",
    slug: ent.slug || "",
    lien_avis: ent.lien_avis || "",
    cta_text: ent.cta_text || "",
    couleur_principale: ent.couleur_principale || "#3B82F6",
    couleur_secondaire: ent.couleur_secondaire || "#0EA5E9",
    active: ent.active ?? true,
    rewards: ent.rewards ? [...ent.rewards] : [],
  });
  const [saving, setSaving] = useState(false);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const updateReward = (i, k, v) => {
    const r = [...form.rewards];
    r[i] = { ...r[i], [k]: v };
    setForm(p => ({ ...p, rewards: r }));
  };
  const removeReward = (i) => setForm(p => ({ ...p, rewards: p.rewards.filter((_, j) => j !== i) }));
  const addReward = () => setForm(p => ({ ...p, rewards: [...p.rewards, { id: Date.now().toString(), name: "", probability: 10 }] }));

  const save = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/admin/entreprises", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entrepriseId: ent._id, ...form }),
      });
      const d = await r.json();
      if (d.entreprise) { showToast("Établissement mis à jour", true); onSaved(); onClose(); }
      else showToast(d.error || "Erreur", false);
    } finally { setSaving(false); }
  };

  return (
    <>
      <Overlay onClose={onClose} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 580, maxHeight: "88vh", overflowY: "auto",
        background: "#fff", borderRadius: 20, zIndex: 300,
        boxShadow: "0 24px 80px rgba(0,0,0,0.18)", padding: "28px 28px 24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0F0F1A" }}>
            Modifier l&apos;établissement
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#8896A5" }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Nom" value={form.nom} onChange={v => f("nom", v)} />
            <Input label="Slug" value={form.slug} onChange={v => f("slug", v)} />
          </div>
          <Input label="Lien Google Avis" value={form.lien_avis} onChange={v => f("lien_avis", v)} />
          <Input label="Texte CTA" value={form.cta_text} onChange={v => f("cta_text", v)} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, alignItems: "center" }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 5 }}>Couleur principale</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="color" value={form.couleur_principale} onChange={e => f("couleur_principale", e.target.value)} style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #E2E8F0", cursor: "pointer", padding: 2 }} />
                <span style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: "#8896A5" }}>{form.couleur_principale}</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 5 }}>Couleur secondaire</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="color" value={form.couleur_secondaire} onChange={e => f("couleur_secondaire", e.target.value)} style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #E2E8F0", cursor: "pointer", padding: 2 }} />
                <span style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: "#8896A5" }}>{form.couleur_secondaire}</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 5 }}>Statut</label>
              <select value={form.active ? "true" : "false"} onChange={e => f("active", e.target.value === "true")} style={{
                padding: "8px 12px", borderRadius: 10, border: "1.5px solid #E2E8F0",
                fontSize: 13, fontFamily: "'Inter',sans-serif", background: "#fff", outline: "none", width: "100%",
              }}>
                <option value="true">Actif</option>
                <option value="false">Inactif</option>
              </select>
            </div>
          </div>

          {/* Rewards */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.5 }}>Lots ({form.rewards.length})</label>
              <Btn variant="outline" onClick={addReward} style={{ fontSize: 11, padding: "4px 12px" }}>+ Ajouter</Btn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {form.rewards.map((r, i) => (
                <div key={r.id || i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    value={r.name}
                    onChange={e => updateReward(i, "name", e.target.value)}
                    placeholder="Nom du lot"
                    style={{ flex: 1, padding: "8px 11px", borderRadius: 9, border: "1.5px solid #E2E8F0", fontSize: 12, outline: "none", fontFamily: "'Inter',sans-serif" }}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <input
                      type="number" min="1" max="100"
                      value={r.probability ?? r.prob ?? ""}
                      onChange={e => updateReward(i, "probability", Number(e.target.value))}
                      style={{ width: 62, padding: "8px 10px", borderRadius: 9, border: "1.5px solid #E2E8F0", fontSize: 12, outline: "none", fontFamily: "'Inter',sans-serif", textAlign: "center" }}
                    />
                    <span style={{ fontSize: 12, color: "#8896A5" }}>%</span>
                  </div>
                  <button onClick={() => removeReward(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", fontSize: 18, padding: "2px 4px" }}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <Btn variant="outline" onClick={onClose}>Annuler</Btn>
          <Btn variant="violet" onClick={save} disabled={saving} style={{ minWidth: 140 }}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Btn>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════
export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState(null);

  // Data
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [codes, setCodes] = useState([]);
  const [codesTotal, setCodesTotal] = useState(0);
  const [codesPages, setCodesPages] = useState(1);

  // UI state
  const [clientDrawer, setClientDrawer] = useState(null); // clientId
  const [entModal, setEntModal] = useState(null); // ent object

  // Filters
  const [clientSearch, setClientSearch] = useState("");
  const [clientPlan, setClientPlan] = useState("");
  const [clientStatus, setClientStatus] = useState("");
  const [entSearch, setEntSearch] = useState("");
  const [codeUsed, setCodeUsed] = useState("");
  const [codePage, setCodePage] = useState(1);

  const showToast = useCallback((msg, ok = true) => setToast({ msg, ok }), []);

  // Auth
  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (!d.user || d.user.role !== "admin") { router.replace("/login"); return; }
        setUser(d.user);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  const fetchStats = useCallback(async () => {
    const r = await fetch("/api/admin/stats");
    const d = await r.json();
    setStats(d);
  }, []);

  const fetchClients = useCallback(async () => {
    const p = new URLSearchParams();
    if (clientSearch) p.set("q", clientSearch);
    if (clientPlan)   p.set("plan", clientPlan);
    const r = await fetch(`/api/admin/clients?${p}`);
    const d = await r.json();
    let list = d.clients || [];
    if (clientStatus === "active")   list = list.filter(c => c.active);
    if (clientStatus === "inactive") list = list.filter(c => !c.active);
    if (clientStatus === "trial")    list = list.filter(c => c.trialEndsAt && new Date(c.trialEndsAt) > new Date());
    if (clientStatus === "expired")  list = list.filter(c => !c.stripeSubscriptionId && (!c.trialEndsAt || new Date(c.trialEndsAt) <= new Date()));
    setClients(list);
  }, [clientSearch, clientPlan, clientStatus]);

  const fetchEntreprises = useCallback(async () => {
    const p = new URLSearchParams();
    if (entSearch) p.set("q", entSearch);
    const r = await fetch(`/api/admin/entreprises?${p}`);
    const d = await r.json();
    setEntreprises(d.entreprises || []);
  }, [entSearch]);

  const fetchCodes = useCallback(async () => {
    const p = new URLSearchParams();
    if (codeUsed) p.set("used", codeUsed === "used" ? "true" : "false");
    p.set("page", codePage);
    const r = await fetch(`/api/admin/codes?${p}`);
    const d = await r.json();
    setCodes(d.codes || []);
    setCodesTotal(d.total || 0);
    setCodesPages(d.pages || 1);
  }, [codeUsed, codePage]);

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchStats(), fetchClients()]).finally(() => setLoading(false));
  }, [user, fetchStats, fetchClients]);

  useEffect(() => { if (user && activeTab === "etablissements") fetchEntreprises(); }, [user, activeTab, fetchEntreprises]);
  useEffect(() => { if (user && activeTab === "codes") fetchCodes(); }, [user, activeTab, fetchCodes]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const deleteClient = async (clientId) => {
    if (!confirm("Supprimer définitivement ce client ?")) return;
    await fetch("/api/admin/clients", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: clientId }),
    });
    showToast("Client supprimé");
    fetchClients(); fetchStats();
  };

  const toggleClientActive = async (c) => {
    await fetch("/api/admin/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: c._id, active: !c.active }),
    });
    fetchClients();
  };

  const changeClientPlan = async (clientId, plan) => {
    await fetch("/api/admin/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: clientId, plan }),
    });
    fetchClients(); fetchStats();
  };

  const deleteEntreprise = async (entId, nom) => {
    if (!confirm(`Supprimer "${nom}" ?`)) return;
    await fetch("/api/admin/entreprises", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entrepriseId: entId }),
    });
    showToast(`"${nom}" supprimé`);
    fetchEntreprises(); fetchStats();
  };

  const toggleEntActive = async (ent) => {
    await fetch("/api/admin/entreprises", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entrepriseId: ent._id, active: !ent.active }),
    });
    fetchEntreprises();
  };

  const deleteCode = async (codeId) => {
    await fetch("/api/admin/codes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codeId }),
    });
    fetchCodes(); fetchStats();
  };

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", fontFamily: "'Inter',sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
          <img src="/images/logo_second.png" alt="VisiumBoost" style={{ height: 64, objectFit: "contain", margin: "0 auto 16px", display: "block", animation: "pulse 1.6s ease-in-out infinite" }} />
          <p style={{ color: "#718096", fontSize: 14 }}>Chargement…</p>
        </div>
      </div>
    );
  }

  const s = stats || {};

  return (
    <div style={{ minHeight: "100dvh", background: "#F8FAFC", fontFamily: "'Inter',system-ui,sans-serif" }}>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#E2E8F0;border-radius:10px}
      `}</style>

      {/* ── TOP NAV ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#0F0F1A", borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height: 32, objectFit: "contain" }} />
          <img src="/images/logo_main1.png" alt="VisiumBoost" style={{ height: 18, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          <span style={{
            marginLeft: 8, padding: "3px 10px", borderRadius: 8,
            background: "rgba(108,92,231,0.25)", border: "1px solid rgba(108,92,231,0.4)",
            color: "#a29bfe", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase",
          }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {s.expiringSoon?.length > 0 && (
            <div style={{
              padding: "5px 12px", borderRadius: 9,
              background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
              color: "#FBD13A", fontSize: 12, fontWeight: 700,
            }}>
              ⚠ {s.expiringSoon.length} essai(s) expire bientôt
            </div>
          )}
          <span style={{ color: "#718096", fontSize: 13 }}>{user.name}</span>
          <button onClick={handleLogout} style={{
            padding: "6px 14px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent", color: "#718096", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Inter',sans-serif",
          }}>Déconnexion</button>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 60px" }}>

        {/* ── PAGE TITLE ── */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 4px", color: "#0F0F1A", fontFamily: "'Calistoga',serif" }}>
            Panel d&apos;administration
          </h1>
          <p style={{ color: "#8896A5", fontSize: 13, margin: 0 }}>
            {fmt(s.totalClients)} clients · {fmt(s.totalEntreprises)} établissements · {fmt(s.monthlyRevenue)}€ MRR
          </p>
        </div>

        {/* ── TABS ── */}
        <div style={{
          display: "flex", gap: 3, marginBottom: 28,
          background: "#fff", borderRadius: 14, padding: 4,
          border: "1.5px solid #F0F0F5", width: "fit-content",
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "8px 18px", borderRadius: 10, border: "none",
              background: activeTab === t.id ? "#0F0F1A" : "transparent",
              color: activeTab === t.id ? "#fff" : "#8896A5",
              fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Inter',sans-serif",
              transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ════════ OVERVIEW TAB ════════ */}
        {activeTab === "overview" && (
          <>
            {/* KPIs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
              <KPICard icon="👥" label="Total clients" value={fmt(s.totalClients)} sub={`${fmt(s.activeClients)} actifs`} color="#6C5CE7" />
              <KPICard icon="💰" label="Revenu mensuel" value={`${fmt(s.monthlyRevenue)}€`} color="#00B894" sub="MRR estimé" />
              <KPICard icon="✅" label="Abonnés payants" value={fmt(s.paidCount)} sub={`sur ${fmt(s.totalClients)}`} color="#0984E3" />
              <KPICard icon="⏳" label="En essai" value={fmt(s.trialingCount)} sub="essai actif" color="#F59E0B" />
              <KPICard icon="🏢" label="Établissements" value={fmt(s.totalEntreprises)} sub={`${fmt(s.activeEntreprises)} actifs`} color="#E17055" />
              <KPICard icon="📊" label="Taux conversion" value={`${s.conversionRate ?? 0}%`} sub={`${fmt(s.usedCodes)}/${fmt(s.totalCodes)} codes`} color="#00B894" />
            </div>

            {/* Plan breakdown */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
              {Object.entries(PLAN_LABELS).map(([key, label]) => (
                <div key={key} style={{
                  flex: "1 1 140px", background: "#fff", borderRadius: 16,
                  padding: "18px 22px", border: "1.5px solid #F0F0F5",
                  boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: PLAN_COLORS[key], marginBottom: 10 }} />
                  <div style={{ fontFamily: "'Calistoga',serif", fontSize: 28, color: "#0F0F1A", lineHeight: 1 }}>
                    {s.plans?.[key] ?? 0}
                  </div>
                  <div style={{ fontSize: 12, color: "#8896A5", marginTop: 4, fontWeight: 600 }}>Plan {label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 22, marginBottom: 24 }}>
              <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1.5px solid #F0F0F5" }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 18px", color: "#0F0F1A" }}>Inscriptions — 30 derniers jours</h3>
                <ResponsiveContainer width="100%" height={210}>
                  <AreaChart data={s.signupChart || []}>
                    <defs>
                      <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5"/>
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#b2bec3" }} interval={Math.ceil((s.signupChart?.length||30)/6)}/>
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#b2bec3" }} allowDecimals={false}/>
                    <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #F0F0F5", fontSize: 12 }} formatter={v => [v, "Inscriptions"]}/>
                    <Area type="monotone" dataKey="count" stroke="#6C5CE7" strokeWidth={2.5} fill="url(#gS)"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1.5px solid #F0F0F5" }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 18px", color: "#0F0F1A" }}>Distribution par plan</h3>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={Object.entries(PLAN_LABELS).map(([k, label]) => ({ name: label, count: s.plans?.[k] || 0, fill: PLAN_COLORS[k] }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5"/>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8b8da0" }}/>
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#b2bec3" }} allowDecimals={false}/>
                    <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #F0F0F5", fontSize: 12 }}/>
                    <Bar dataKey="count" radius={[7,7,0,0]} name="Clients" fill="#6C5CE7"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expiring soon */}
            {s.expiringSoon?.length > 0 && (
              <div style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 16, padding: "18px 22px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E", marginBottom: 12 }}>
                  ⚠ Essais expirant dans moins de 3 jours ({s.expiringSoon.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {s.expiringSoon.map(c => (
                    <div key={c._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ fontWeight: 600, color: "#0F0F1A" }}>{c.name}</span>
                      <span style={{ color: "#8896A5" }}>{c.email}</span>
                      <span style={{ color: "#F59E0B", fontWeight: 700 }}>J-{daysLeft(c.trialEndsAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ════════ CLIENTS TAB ════════ */}
        {activeTab === "clients" && (
          <div>
            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
              <input
                value={clientSearch} onChange={e => setClientSearch(e.target.value)}
                placeholder="Rechercher par nom, email, entreprise…"
                style={{
                  flex: "1 1 240px", padding: "10px 14px", borderRadius: 12,
                  border: "1.5px solid #E2E8F0", fontSize: 13, outline: "none",
                  fontFamily: "'Inter',sans-serif", background: "#fff",
                }}
              />
              <select value={clientPlan} onChange={e => setClientPlan(e.target.value)} style={{
                padding: "10px 14px", borderRadius: 12, border: "1.5px solid #E2E8F0",
                fontSize: 13, background: "#fff", fontFamily: "'Inter',sans-serif", outline: "none",
              }}>
                <option value="">Tous les plans</option>
                {Object.entries(PLAN_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={clientStatus} onChange={e => setClientStatus(e.target.value)} style={{
                padding: "10px 14px", borderRadius: 12, border: "1.5px solid #E2E8F0",
                fontSize: 13, background: "#fff", fontFamily: "'Inter',sans-serif", outline: "none",
              }}>
                <option value="">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
                <option value="trial">En essai</option>
                <option value="expired">Essai expiré</option>
              </select>
            </div>

            {/* Table */}
            <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1.5px solid #F0F0F5" }}>
              {/* Header */}
              <div style={{
                display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr 110px",
                padding: "12px 20px", background: "#FAFAFA",
                borderBottom: "1.5px solid #F0F0F5",
                fontSize: 10, fontWeight: 800, color: "#b2bec3",
                textTransform: "uppercase", letterSpacing: 0.8,
              }}>
                <div>Client</div>
                <div>Email</div>
                <div>Plan</div>
                <div>Essai</div>
                <div>Inscrit</div>
                <div>Statut</div>
                <div style={{ textAlign: "center" }}>Actions</div>
              </div>

              {clients.length === 0 && (
                <div style={{ padding: "40px", textAlign: "center", color: "#b2bec3", fontSize: 13 }}>Aucun client</div>
              )}

              {clients.map(c => {
                const left = daysLeft(c.trialEndsAt);
                const hasPaid = !!c.stripeSubscriptionId;
                return (
                  <div key={c._id}
                    style={{
                      display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr 110px",
                      padding: "13px 20px", borderBottom: "1px solid #F8F8FC",
                      alignItems: "center", fontSize: 13, cursor: "pointer",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAFE"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                    onClick={() => setClientDrawer(c._id)}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: "#0F0F1A" }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "#b2bec3" }}>{c.businessName || "—"}</div>
                    </div>
                    <div style={{ color: "#636e72", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12 }}>{c.email}</div>
                    <div onClick={e => e.stopPropagation()}>
                      <select
                        value={c.plan}
                        onChange={e => changeClientPlan(c._id, e.target.value)}
                        style={{
                          padding: "5px 9px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                          border: `1.5px solid ${PLAN_COLORS[c.plan]}40`,
                          background: `${PLAN_COLORS[c.plan]}12`,
                          color: PLAN_COLORS[c.plan],
                          fontFamily: "'Inter',sans-serif", outline: "none", cursor: "pointer",
                        }}
                      >
                        {Object.entries(PLAN_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      {hasPaid ? (
                        <span style={{ fontSize: 11, color: "#00B894", fontWeight: 700 }}>Payé</span>
                      ) : left > 0 ? (
                        <span style={{ fontSize: 11, color: left <= 3 ? "#F59E0B" : "#0984E3", fontWeight: 700 }}>J-{left}</span>
                      ) : (
                        <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 700 }}>Expiré</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "#8896A5" }}>{fmtDate(c.createdAt)}</div>
                    <div onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => toggleClientActive(c)}
                        style={{
                          padding: "4px 11px", borderRadius: 8, border: "none", fontSize: 11, fontWeight: 700,
                          background: c.active ? "#00B89415" : "#E1705515",
                          color: c.active ? "#00B894" : "#E17055", cursor: "pointer",
                        }}
                      >{c.active ? "Actif" : "Inactif"}</button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: 6 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => setClientDrawer(c._id)} style={{
                        width: 30, height: 30, borderRadius: 8, border: "1.5px solid #E2E8F0",
                        background: "#fff", cursor: "pointer", fontSize: 14, display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }} title="Modifier">✏️</button>
                      <button onClick={() => deleteClient(c._id)} style={{
                        width: 30, height: 30, borderRadius: 8, border: "none",
                        background: "#FFF5F5", color: "#EF4444", cursor: "pointer", fontSize: 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }} title="Supprimer">🗑</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 10, fontSize: 12, color: "#b2bec3", textAlign: "right" }}>
              {clients.length} client{clients.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}

        {/* ════════ ÉTABLISSEMENTS TAB ════════ */}
        {activeTab === "etablissements" && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
              <input
                value={entSearch} onChange={e => setEntSearch(e.target.value)}
                placeholder="Rechercher par nom ou slug…"
                style={{
                  flex: "1 1 280px", padding: "10px 14px", borderRadius: 12,
                  border: "1.5px solid #E2E8F0", fontSize: 13, outline: "none",
                  fontFamily: "'Inter',sans-serif", background: "#fff",
                }}
              />
            </div>

            <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1.5px solid #F0F0F5" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 80px 80px 80px 110px",
                padding: "12px 20px", background: "#FAFAFA", borderBottom: "1.5px solid #F0F0F5",
                fontSize: 10, fontWeight: 800, color: "#b2bec3", textTransform: "uppercase", letterSpacing: 0.8,
              }}>
                <div>Établissement</div>
                <div>Slug</div>
                <div>Propriétaire</div>
                <div>Plan</div>
                <div>Scans</div>
                <div>Lots</div>
                <div>Statut</div>
                <div style={{ textAlign: "center" }}>Actions</div>
              </div>

              {entreprises.length === 0 && (
                <div style={{ padding: "40px", textAlign: "center", color: "#b2bec3", fontSize: 13 }}>Aucun établissement</div>
              )}

              {entreprises.map(e => (
                <div key={e._id} style={{
                  display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 80px 80px 80px 110px",
                  padding: "13px 20px", borderBottom: "1px solid #F8F8FC",
                  alignItems: "center", fontSize: 13, transition: "background 0.1s",
                }}
                  onMouseEnter={ev => ev.currentTarget.style.background = "#FAFAFE"}
                  onMouseLeave={ev => ev.currentTarget.style.background = "#fff"}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: "#0F0F1A" }}>{e.nom}</div>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: e.couleur_principale || "#3B82F6", display: "inline-block", marginTop: 4, border: "1px solid #E2E8F0" }} />
                  </div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#8896A5" }}>/{e.slug}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#0F0F1A" }}>{e.owner?.name || "—"}</div>
                    <div style={{ fontSize: 11, color: "#b2bec3" }}>{e.owner?.email || ""}</div>
                  </div>
                  <div><PlanBadge plan={e.owner?.plan || "free"} /></div>
                  <div style={{ fontSize: 12, color: "#8896A5", fontWeight: 600 }}>{fmt(e.totalScans)}</div>
                  <div style={{ fontSize: 12, color: "#8896A5", fontWeight: 600 }}>{e.rewards?.length || 0}</div>
                  <div><StatusDot active={e.active} /></div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                    <button onClick={() => setEntModal(e)} style={{
                      width: 30, height: 30, borderRadius: 8, border: "1.5px solid #E2E8F0",
                      background: "#fff", cursor: "pointer", fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }} title="Modifier">✏️</button>
                    <button onClick={() => toggleEntActive(e)} style={{
                      width: 30, height: 30, borderRadius: 8, border: "none",
                      background: e.active ? "#E1705515" : "#00B89415",
                      color: e.active ? "#E17055" : "#00B894",
                      cursor: "pointer", fontSize: 13,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }} title={e.active ? "Désactiver" : "Activer"}>{e.active ? "⏸" : "▶"}</button>
                    <button onClick={() => deleteEntreprise(e._id, e.nom)} style={{
                      width: 30, height: 30, borderRadius: 8, border: "none",
                      background: "#FFF5F5", color: "#EF4444", cursor: "pointer", fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }} title="Supprimer">🗑</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "#b2bec3", textAlign: "right" }}>
              {entreprises.length} établissement{entreprises.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}

        {/* ════════ CODES TAB ════════ */}
        {activeTab === "codes" && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
              <select value={codeUsed} onChange={e => { setCodeUsed(e.target.value); setCodePage(1); }} style={{
                padding: "10px 14px", borderRadius: 12, border: "1.5px solid #E2E8F0",
                fontSize: 13, background: "#fff", fontFamily: "'Inter',sans-serif", outline: "none",
              }}>
                <option value="">Tous les codes</option>
                <option value="used">Utilisés</option>
                <option value="unused">Non utilisés</option>
              </select>
              <span style={{ fontSize: 13, color: "#8896A5" }}>{fmt(codesTotal)} code{codesTotal !== 1 ? "s" : ""} au total</span>
            </div>

            <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1.5px solid #F0F0F5" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 40px",
                padding: "12px 20px", background: "#FAFAFA", borderBottom: "1.5px solid #F0F0F5",
                fontSize: 10, fontWeight: 800, color: "#b2bec3", textTransform: "uppercase", letterSpacing: 0.8,
              }}>
                <div>Code</div>
                <div>Propriétaire</div>
                <div>Statut</div>
                <div>Date</div>
                <div />
              </div>

              {codes.length === 0 && (
                <div style={{ padding: "40px", textAlign: "center", color: "#b2bec3", fontSize: 13 }}>Aucun code</div>
              )}

              {codes.map(c => (
                <div key={c._id} style={{
                  display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 40px",
                  padding: "12px 20px", borderBottom: "1px solid #F8F8FC",
                  alignItems: "center", fontSize: 13,
                }}>
                  <div style={{
                    fontFamily: "'DM Mono',monospace", fontWeight: 700,
                    color: c.used ? "#94A3B8" : "#0F0F1A",
                    textDecoration: c.used ? "line-through" : "none",
                    fontSize: 13,
                  }}>{c.code}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#0F0F1A" }}>{c.owner?.name || "—"}</div>
                    <div style={{ fontSize: 11, color: "#b2bec3" }}>{c.owner?.email || ""}</div>
                  </div>
                  <div>
                    <span style={{
                      padding: "3px 9px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                      background: c.used ? "#F1F5F9" : "#F0FDF4",
                      color: c.used ? "#94A3B8" : "#16A34A",
                    }}>{c.used ? "Utilisé" : "Valide"}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#8896A5" }}>
                    {c.used ? fmtDate(c.usedAt) : fmtDate(c.createdAt)}
                  </div>
                  <div>
                    <button onClick={() => deleteCode(c._id)} style={{
                      width: 28, height: 28, borderRadius: 7, border: "none",
                      background: "#FFF5F5", color: "#EF4444", cursor: "pointer", fontSize: 13,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>×</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {codesPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 18 }}>
                <Btn variant="outline" onClick={() => setCodePage(p => Math.max(1, p-1))} disabled={codePage === 1} style={{ padding: "7px 14px" }}>←</Btn>
                <span style={{ padding: "7px 14px", fontSize: 13, color: "#8896A5" }}>Page {codePage} / {codesPages}</span>
                <Btn variant="outline" onClick={() => setCodePage(p => Math.min(codesPages, p+1))} disabled={codePage === codesPages} style={{ padding: "7px 14px" }}>→</Btn>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── DRAWERS & MODALS ── */}
      {clientDrawer && (
        <ClientDrawer
          clientId={clientDrawer}
          onClose={() => setClientDrawer(null)}
          onSaved={() => { fetchClients(); fetchStats(); }}
          onDeleted={() => { fetchClients(); fetchStats(); }}
          showToast={showToast}
        />
      )}

      {entModal && (
        <EntrepriseModal
          ent={entModal}
          onClose={() => setEntModal(null)}
          onSaved={() => fetchEntreprises()}
          showToast={showToast}
        />
      )}

      {/* ── TOAST ── */}
      {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}
    </div>
  );
}
