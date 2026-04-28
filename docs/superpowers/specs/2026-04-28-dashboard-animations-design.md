# Dashboard Animations — Design Spec

**Date:** 2026-04-28  
**Status:** Approved

## Objectif

Ajouter des animations pro-SaaS au dashboard VisiumBoost (mix style B+C, mesuré). Les animations doivent se lancer une seule fois au chargement, puis ne s'activer qu'au hover — jamais en boucle infinie.

---

## Animations à implémenter

### 1. Stagger d'entrée — StatCards (`StatCard.js`)

Chaque carte apparaît avec un délai CSS croissant via `--stagger-i` (custom property injectée par le parent).

- `opacity: 0 → 1` + `translateY(16px) → 0` + `scale(0.97 → 1)`
- Durée : `0.55s`, easing : `cubic-bezier(.22,.68,0,1.2)` (légèrement élastique)
- Délais : `0.15s`, `0.25s`, `0.35s`, `0.45s` (via `nth-child` ou `--stagger-i`)
- Animation jouée une seule fois (`animation-fill-mode: both`)

### 2. Hover lift + shimmer — StatCards (`StatCard.js`)

Au survol de chaque carte :
- `transform: translateY(-5px) scale(1.02)` + `box-shadow` plus prononcé
- Reflet (shimmer) : pseudo-élément `::before` qui glisse de gauche à droite (`left: -100% → 200%`) en `0.5s ease` **uniquement au hover** — pas de loop
- `border-color` → transparent pour laisser le shadow parler

### 3. Pulse dot — Alerte codes en attente (`PageDashboard.js`)

Le point indicateur dans le badge "X codes en attente" reçoit une animation pulse :
- `scale(1 → 1.4)` + `box-shadow 0 → rgba(245,158,11,0)` en 1.8s loop
- Petit cercle coloré ajouté à gauche du texte de l'alerte

### 4. Barres de progression animées — Section benchmark (`PageDashboard.js`)

Les barres dans "Comment vous situez-vous ?" s'animent de 0% à leur valeur réelle à l'entrée de la page :
- `transform: scaleX(0 → 1)`, `transform-origin: left`
- Durée : `1.1s`, stagger de `0.15s` entre chaque barre
- Délai global : `0.7s` (la section apparaît après les stat cards)

### 5. Entrée des sections carte (`globals.css`)

Deux nouvelles classes utilitaires dans `globals.css` :
- `.animate-stagger-item` : entrée unique pour usage avec `--delay` inline
- `.animate-card-enter` : `slideUpFade` — `opacity 0→1` + `translateY(20px→0)` en `0.6s`

Ces classes remplacent/complètent `animate-fade-in` sur les blocs chart et benchmark.

---

## Ce qui NE change PAS

- Fond clair `#F8FAFC` conservé (pas de dark cards style option C pure)
- Pas d'animations en boucle infinie (sauf pulse dot, qui est intentionnel et discret)
- Pas d'animations sur les autres pages (codes, clients, etc.) — uniquement le dashboard principal
- Sidebar et navigation : inchangées (déjà animées avec `transition-all`)

---

## Fichiers modifiés

| Fichier | Changement |
|---|---|
| `src/styles/globals.css` | + `.animate-card-enter`, `.animate-stagger-item`, keyframes `cardEntrance`, `shimmerSlide`, `pulseDot`, `barFillGrow` |
| `src/components/StatCard.js` | Stagger via `style` prop + hover lift + shimmer via `className` |
| `src/components/pages/PageDashboard.js` | Pulse dot sur alerte, barres benchmark animées, `.animate-card-enter` sur chart + benchmark cards |

---

## Contraintes techniques

- JavaScript pur (pas TypeScript)
- Pas de librairie d'animation externe (Framer Motion, etc.) — CSS only
- Compatible avec le `animate-fade-in` existant sur le wrapper de page
- Les `nth-child` CSS ne fonctionnent pas fiablement dans JSX inline — utiliser `style={{ animationDelay: "Xs" }}` directement sur chaque `StatCard`
