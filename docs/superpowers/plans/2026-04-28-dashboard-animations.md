# Dashboard Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter des animations pro-SaaS au dashboard (stagger d'entrée, hover lift + shimmer, pulse dot, barres benchmark animées) — CSS only, sans librairie externe.

**Architecture:** Toutes les animations sont en CSS pur via `globals.css` (keyframes + classes utilitaires). `StatCard` reçoit un prop `delay` pour le stagger. `PageDashboard` applique les classes et ajoute le pulse dot + barres animées.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS, CSS keyframes, JavaScript pur

---

### Task 1: Ajouter keyframes et classes utilitaires dans globals.css

**Files:**
- Modify: `src/styles/globals.css`

- [ ] **Step 1 — Ajouter les keyframes et classes dans `globals.css`**

Dans la section `@layer utilities` (après `animate-slide-up`), remplacer le bloc entier par :

```css
@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }
  .animate-card-enter {
    animation: cardEnter 0.6s cubic-bezier(.22,.68,0,1.2) both;
  }
}
```

Puis à la fin du fichier, avant `/* ── Scrollbar ── */`, ajouter :

```css
/* ── Dashboard animations ── */
@keyframes cardEntrance {
  0%   { opacity: 0; transform: translateY(16px) scale(0.97); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes cardEnter {
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes pulseDot {
  0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(245,158,11,0.5); }
  50%       { transform: scale(1.4); opacity: 0.7; box-shadow: 0 0 0 6px rgba(245,158,11,0); }
}

@keyframes barFillGrow {
  0%   { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}

/* StatCard animated — stagger + hover lift + shimmer */
.stat-card-anim {
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: cardEntrance 0.55s cubic-bezier(.22,.68,0,1.2) both;
  transition: transform 0.22s cubic-bezier(.22,.68,0,1.2), box-shadow 0.22s, border-color 0.2s;
  cursor: default;
}
.stat-card-anim:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 16px 40px rgba(0,0,0,0.10);
  border-color: transparent !important;
}
.stat-card-anim:active {
  transform: translateY(-2px) scale(0.99);
}
/* Shimmer — glisse une seule fois au hover, pas de loop */
.stat-card-anim::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 55%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
  pointer-events: none;
  transition: left 0s;
}
.stat-card-anim:hover::before {
  left: 200%;
  transition: left 0.45s ease;
}
```

- [ ] **Step 2 — Vérifier que le fichier compile sans erreur**

```bash
rtk npm run build 2>&1 | head -30
```

Expected : aucune erreur CSS. Si Tailwind se plaint de `cardEntrance` etc., ce n'est pas un problème — ces keyframes sont dans `globals.css`, pas dans Tailwind.

- [ ] **Step 3 — Commit**

```bash
rtk git add src/styles/globals.css
rtk git commit -m "feat: add dashboard animation keyframes and stat-card-anim class"
```

---

### Task 2: Mettre à jour StatCard pour le stagger et le hover

**Files:**
- Modify: `src/components/StatCard.js`

La `StatCard` actuelle a la signature `{ icon, label, value, sub, color }`. On ajoute `delay` (optionnel, défaut `"0s"`).

- [ ] **Step 1 — Réécrire `StatCard.js`**

Remplacer le contenu entier de `src/components/StatCard.js` par :

```js
"use client";

import Icon from "@/components/Icon";

export default function StatCard({ icon, label, value, sub, color = "#3B82F6", delay = "0s" }) {
  return (
    <div
      className="card stat-card-anim p-4 flex-1"
      style={{ minWidth: 0, animationDelay: delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}12` }}
        >
          <Icon name={icon} size={18} color={color} />
        </div>
      </div>
      <div className="text-[26px] font-bold text-slate-900 tracking-tight leading-none mb-1">
        {value}
      </div>
      <div className="text-[13px] text-slate-500 font-medium">{label}</div>
      {sub && (
        <div className="text-[12px] text-slate-400 mt-0.5">{sub}</div>
      )}
    </div>
  );
}
```

- [ ] **Step 2 — Lancer le dev server et vérifier visuellement**

```bash
rtk npm run dev
```

Ouvrir `http://localhost:3000/dashboard` et vérifier :
- Les 4 StatCards apparaissent en stagger (chacune 100ms après la précédente)
- Au survol d'une carte : elle monte légèrement + reflet blanc glisse dessus

- [ ] **Step 3 — Commit**

```bash
rtk git add src/components/StatCard.js
rtk git commit -m "feat: add stagger entrance and hover shimmer to StatCard"
```

---

### Task 3: Passer les délais de stagger depuis PageDashboard

**Files:**
- Modify: `src/components/pages/PageDashboard.js`

- [ ] **Step 1 — Ajouter les délais `delay` sur les StatCards**

Dans `PageDashboard.js`, trouver le bloc des 4 StatCards (actuellement lignes ~244-249) :

```jsx
<div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 mb-6">
  <StatCard icon="qr"      label="Scans de page"   value={String(s.totalScans ?? 0)}        color="#3B82F6" />
  <StatCard icon="wheel"   label="Roues tournées"  value={String(s.totalSpins ?? 0)}        color="#0EA5E9" />
  <StatCard icon="check"   label="Codes validés"   value={String(s.validatedSpins ?? 0)}    color="#10B981" />
  <StatCard icon="trendUp" label="Taux de retrait" value={`${s.conversionRate ?? 0}%`}      color="#F59E0B" />
</div>
```

Le remplacer par :

```jsx
<div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 mb-6">
  <StatCard icon="qr"      label="Scans de page"   value={String(s.totalScans ?? 0)}      color="#3B82F6" delay="0.15s" />
  <StatCard icon="wheel"   label="Roues tournées"  value={String(s.totalSpins ?? 0)}      color="#0EA5E9" delay="0.25s" />
  <StatCard icon="check"   label="Codes validés"   value={String(s.validatedSpins ?? 0)}  color="#10B981" delay="0.35s" />
  <StatCard icon="trendUp" label="Taux de retrait" value={`${s.conversionRate ?? 0}%`}    color="#F59E0B" delay="0.45s" />
</div>
```

- [ ] **Step 2 — Vérifier visuellement**

Recharger `http://localhost:3000/dashboard`. Les 4 cartes doivent arriver les unes après les autres avec ~100ms entre chaque.

- [ ] **Step 3 — Commit**

```bash
rtk git add src/components/pages/PageDashboard.js
rtk git commit -m "feat: pass stagger delays to StatCards in dashboard"
```

---

### Task 4: Pulse dot sur l'alerte codes en attente

**Files:**
- Modify: `src/components/pages/PageDashboard.js`

- [ ] **Step 1 — Ajouter le pulse dot dans le bloc alerte**

Trouver le bloc "Pending codes alert" (actuellement ~ligne 224) :

```jsx
{!loading && (s.pendingSpins ?? 0) > 0 && (
  <div style={{
    background: "#FFFBEB", border: "1.5px solid #FDE68A",
    borderRadius: 16, padding: "14px 20px", marginBottom: 24,
    display: "flex", alignItems: "center", gap: 12,
  }}>
    <div style={{ fontSize: 20, flexShrink: 0 }}>⏳</div>
    <p style={{ fontWeight: 600, color: "#92400E", fontSize: 14, margin: 0 }}>
      <strong>{s.pendingSpins}</strong> code{s.pendingSpins > 1 ? "s" : ""} en attente de validation —{" "}
      <button
        onClick={() => setCurrentPage("codes")}
        style={{ color: "#B45309", fontWeight: 700, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 14 }}
      >
        Voir les validations →
      </button>
    </p>
  </div>
)}
```

Le remplacer par :

```jsx
{!loading && (s.pendingSpins ?? 0) > 0 && (
  <div style={{
    background: "#FFFBEB", border: "1.5px solid #FDE68A",
    borderRadius: 16, padding: "14px 20px", marginBottom: 24,
    display: "flex", alignItems: "center", gap: 12,
  }}
  className="animate-card-enter"
  >
    <div style={{ position: "relative", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28 }}>
      <span style={{
        display: "block", width: 10, height: 10, borderRadius: "50%",
        background: "#F59E0B",
        animation: "pulseDot 1.8s ease-in-out infinite",
      }} />
    </div>
    <p style={{ fontWeight: 600, color: "#92400E", fontSize: 14, margin: 0 }}>
      <strong>{s.pendingSpins}</strong> code{s.pendingSpins > 1 ? "s" : ""} en attente de validation —{" "}
      <button
        onClick={() => setCurrentPage("codes")}
        style={{ color: "#B45309", fontWeight: 700, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 14 }}
      >
        Voir les validations →
      </button>
    </p>
  </div>
)}
```

- [ ] **Step 2 — Vérifier visuellement**

Si des codes en attente existent, le badge doit afficher un point orange pulsant à gauche du texte. Sinon, créer un spin test pour déclencher l'alerte.

- [ ] **Step 3 — Commit**

```bash
rtk git add src/components/pages/PageDashboard.js
rtk git commit -m "feat: add pulse dot animation to pending codes alert"
```

---

### Task 5: Barres de progression animées dans la section benchmark

**Files:**
- Modify: `src/components/pages/PageDashboard.js`

- [ ] **Step 1 — Ajouter l'entrée animée sur les cards chart + benchmark**

Trouver la div `/* Chart */` (~ligne 252) :

```jsx
<div className="card p-4 md:p-6">
```

La remplacer par :

```jsx
<div className="card p-4 md:p-6 animate-card-enter" style={{ animationDelay: "0.5s" }}>
```

Trouver la div `/* Benchmark card */` (~ligne 295) :

```jsx
<div className="card p-4 md:p-6 mt-6">
```

La remplacer par :

```jsx
<div className="card p-4 md:p-6 mt-6 animate-card-enter" style={{ animationDelay: "0.65s" }}>
```

- [ ] **Step 2 — Ajouter les barres de progression dans la section benchmark**

Trouver le bloc `.map` de la section benchmark qui rend chaque ligne (actuellement ~ligne 300) :

```jsx
{[
  { label: "Roues / mois", userVal: s.totalSpins || 0, avg: 47, unit: "" },
  { label: "Taux de validation", userVal: s.conversionRate || 0, avg: 68, unit: "%" },
  { label: "Scans / mois", userVal: s.totalScans || 0, avg: 89, unit: "" },
].map(({ label, userVal, avg, unit }) => {
  const diff = avg > 0 ? Math.round(((userVal - avg) / avg) * 100) : 0;
  const above = userVal >= avg;
  return (
    <div key={label} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 0", borderBottom: "1px solid #F1F5F9", flexWrap: "wrap", gap: 8,
    }}>
      <span style={{ fontSize: 14, color: "#475569", fontWeight: 500, minWidth: 140 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
        {userVal}{unit}
      </span>
      <span style={{ fontSize: 13, color: "#94A3B8" }}>vs {avg}{unit} moy.</span>
      <span style={{
        fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
        background: above ? "#DCFCE7" : "#FEF3C7",
        color: above ? "#15803D" : "#92400E",
      }}>
        {above ? `+${diff}% au-dessus` : `${Math.abs(diff)}% en dessous`}
      </span>
    </div>
  );
})}
```

Le remplacer par :

```jsx
{[
  { label: "Roues / mois", userVal: s.totalSpins || 0, avg: 47, unit: "", color: "#3B82F6", idx: 0 },
  { label: "Taux de validation", userVal: s.conversionRate || 0, avg: 68, unit: "%", color: "#10B981", idx: 1 },
  { label: "Scans / mois", userVal: s.totalScans || 0, avg: 89, unit: "", color: "#F59E0B", idx: 2 },
].map(({ label, userVal, avg, unit, color, idx }) => {
  const diff = avg > 0 ? Math.round(((userVal - avg) / avg) * 100) : 0;
  const above = userVal >= avg;
  const barPct = Math.min(100, avg > 0 ? Math.round((userVal / (avg * 2)) * 100) : 50);
  return (
    <div key={label} style={{
      padding: "12px 0", borderBottom: "1px solid #F1F5F9",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 14, color: "#475569", fontWeight: 500 }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{userVal}{unit}</span>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>vs {avg}{unit} moy.</span>
          <span style={{
            fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
            background: above ? "#DCFCE7" : "#FEF3C7",
            color: above ? "#15803D" : "#92400E",
          }}>
            {above ? `+${diff}% au-dessus` : `${Math.abs(diff)}% en dessous`}
          </span>
        </div>
      </div>
      <div style={{ height: 5, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${barPct}%`,
          background: color,
          borderRadius: 99,
          transformOrigin: "left",
          animation: `barFillGrow 1.1s cubic-bezier(.22,.68,0,1.2) both`,
          animationDelay: `${0.7 + idx * 0.15}s`,
        }} />
      </div>
    </div>
  );
})}
```

- [ ] **Step 3 — Vérifier visuellement**

Recharger le dashboard. La section benchmark doit afficher des barres colorées qui grandissent de gauche à droite en stagger (0.7s, 0.85s, 1.0s après le chargement).

- [ ] **Step 4 — Commit final**

```bash
rtk git add src/components/pages/PageDashboard.js
rtk git commit -m "feat: animate chart/benchmark card entrances and benchmark progress bars"
```
