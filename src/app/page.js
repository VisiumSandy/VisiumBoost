"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const E = [0.22, 1, 0.36, 1];
const FONT_TITLE = "'Special Gothic Expanded One','DM Sans',system-ui,sans-serif";
const FONT_BODY  = "'DM Sans',system-ui,sans-serif";

// ── Gradient text ──────────────────────────────────────────────────────────────
const G = ({ children, from = "#2563EB", to = "#38BDF8" }) => (
  <span style={{
    fontStyle: "italic", fontWeight: 700,
    background: `linear-gradient(135deg,${from} 0%,${to} 100%)`,
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    backgroundClip: "text", display: "inline",
  }}>{children}</span>
);

// ── Icons ──────────────────────────────────────────────────────────────────────
const Ic = {
  Sun:       ({s=20,c="#71717A"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon:      ({s=20,c="#71717A"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={c} fillOpacity="0.2"/></svg>,
  Check:     ({s=15,c="#10B981"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Star:      ({s=14,c="#F59E0B"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Google:    ({s=20}) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
  Shield:    ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  Zap:       ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  BarChart:  ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  QrCode:    ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><line x1="17" y1="17" x2="20" y2="17"/><line x1="20" y1="14" x2="20" y2="17"/></svg>,
  Arrow:     ({s=16,c="#fff"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Lock:      ({s=14,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Sparkle:   ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/></svg>,
  Layers:    ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Globe:     ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Clock:     ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  TrendUp:   ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

// ── Fluid NavBar ──────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Tarifs",          href: "#pricing" },
  { label: "Témoignages",     href: "#testimonials" },
];

function NavBar({ isDark, onToggleDark }) {
  const [scrolled,    setScrolled]    = useState(false);
  const [hoveredId,   setHoveredId]   = useState(null);
  const [activeId,    setActiveId]    = useState(null);
  const [themeHov,    setThemeHov]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const border = isDark ? "rgba(255,255,255,0.09)" : "rgba(37,99,235,0.12)";
  const text2  = isDark ? "#8892B0" : "#4B5563";
  const textMain = isDark ? "#EEF2FF" : "#0A0D1E";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 860) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pillBg      = isDark ? "rgba(6,9,26,0.82)"    : "rgba(255,255,255,0.82)";
  const pillBrd     = isDark ? "rgba(255,255,255,0.1)" : "rgba(37,99,235,0.14)";
  const pillShadow  = isDark
    ? "0 8px 40px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset"
    : "0 8px 40px rgba(37,99,235,0.1), 0 1px 0 rgba(255,255,255,0.9) inset";
  const drawerBg    = isDark ? "rgba(6,9,26,0.97)"    : "rgba(255,255,255,0.97)";

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, pointerEvents: "none" }}>

      {/* Floating pill nav */}
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 16px", pointerEvents: "none" }}>
        <motion.nav
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1], delay: 0.1 }}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            pointerEvents: "all",
            padding: scrolled ? "7px 10px" : "8px 12px",
            borderRadius: 9999,
            background:           scrolled ? pillBg     : "transparent",
            border:               scrolled ? `1px solid ${pillBrd}` : "1px solid transparent",
            boxShadow:            scrolled ? pillShadow : "none",
            backdropFilter:       scrolled ? "blur(28px) saturate(200%)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(28px) saturate(200%)" : "none",
            transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s, padding 0.4s",
            width: "min(100%, 880px)",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height: 30, objectFit: "contain" }} />
            </Link>
          </motion.div>

          {/* Nav links — desktop only */}
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 2, position: "relative" }}>
            {NAV_LINKS.map(({ label, href }) => {
              const isHov = hoveredId === label;
              const isAct = activeId === label;
              return (
                <a key={label} href={href}
                  onMouseEnter={() => setHoveredId(label)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setActiveId(label)}
                  style={{
                    position: "relative", padding: "7px 16px", borderRadius: 9999,
                    textDecoration: "none", fontWeight: 500, fontSize: 14,
                    color: isAct ? textMain : (isHov ? (isDark ? "#E2E8F0" : "#1e3a8a") : text2),
                    transition: "color 0.22s", zIndex: 1,
                  }}
                >
                  <AnimatePresence>
                    {(isHov || isAct) && (
                      <motion.span layoutId="nav-pill"
                        initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }}
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                        style={{
                          position: "absolute", inset: 0, borderRadius: 9999, zIndex: -1,
                          background: isAct ? (isDark ? "rgba(37,99,235,0.22)" : "rgba(37,99,235,0.1)") : (isDark ? "rgba(255,255,255,0.07)" : "rgba(37,99,235,0.07)"),
                          border: `1px solid ${isAct ? (isDark ? "rgba(37,99,235,0.4)" : "rgba(37,99,235,0.2)") : (isDark ? "rgba(255,255,255,0.1)" : "rgba(37,99,235,0.12)")}`,
                        }}
                      />
                    )}
                  </AnimatePresence>
                  {label}
                </a>
              );
            })}
          </div>

          {/* Right — desktop */}
          <div className="nav-right-desktop" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <motion.button onClick={onToggleDark}
              onMouseEnter={() => setThemeHov(true)} onMouseLeave={() => setThemeHov(false)}
              whileTap={{ scale: 0.88 }}
              style={{
                width: 36, height: 36, borderRadius: 10,
                border: `1px solid ${themeHov ? (isDark ? "rgba(255,255,255,0.2)" : "rgba(37,99,235,0.25)") : border}`,
                background: themeHov ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(37,99,235,0.06)") : "transparent",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.25s, border-color 0.25s", flexShrink: 0,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div key={isDark ? "sun" : "moon"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
                >
                  {isDark ? <Ic.Sun s={16} c={text2} /> : <Ic.Moon s={16} c={text2} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
            <a href="/login" style={{
              padding: "7px 15px", borderRadius: 9999, textDecoration: "none",
              color: text2, fontWeight: 500, fontSize: 14, transition: "all 0.22s",
            }}>Se connecter</a>
            <NavCTA isDark={isDark} />
          </div>

          {/* Right — mobile: theme toggle + hamburger */}
          <div className="nav-right-mobile" style={{ display: "none", alignItems: "center", gap: 8 }}>
            <motion.button onClick={onToggleDark} whileTap={{ scale: 0.88 }}
              style={{
                width: 36, height: 36, borderRadius: 10,
                border: `1px solid ${border}`, background: "transparent",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div key={isDark ? "sun2" : "moon2"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
                >
                  {isDark ? <Ic.Sun s={16} c={text2} /> : <Ic.Moon s={16} c={text2} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Hamburger */}
            <motion.button
              onClick={() => setMobileOpen(o => !o)} whileTap={{ scale: 0.9 }}
              style={{
                width: 38, height: 38, borderRadius: 10,
                border: `1px solid ${mobileOpen ? (isDark ? "rgba(37,99,235,0.4)" : "rgba(37,99,235,0.2)") : border}`,
                background: mobileOpen ? (isDark ? "rgba(37,99,235,0.15)" : "rgba(37,99,235,0.07)") : "transparent",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 5, padding: "10px",
                transition: "all 0.25s",
              }}
            >
              <motion.span animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: "block", width: 18, height: 1.5, background: text2, borderRadius: 2, transformOrigin: "center" }} />
              <motion.span animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                style={{ display: "block", width: 14, height: 1.5, background: text2, borderRadius: 2 }} />
              <motion.span animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: "block", width: 18, height: 1.5, background: text2, borderRadius: 2, transformOrigin: "center" }} />
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: -1, pointerEvents: "all" }}
            />
            {/* Drawer panel */}
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
              style={{
                position: "absolute", top: "calc(100% - 8px)", left: 16, right: 16,
                background: drawerBg,
                backdropFilter: "blur(32px) saturate(200%)",
                WebkitBackdropFilter: "blur(32px) saturate(200%)",
                border: `1px solid ${pillBrd}`,
                borderRadius: 20,
                boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.6)" : "0 24px 64px rgba(37,99,235,0.15)",
                overflow: "hidden", pointerEvents: "all",
              }}
            >
              {/* Nav links */}
              <div style={{ padding: "8px 8px 4px" }}>
                {NAV_LINKS.map(({ label, href }, i) => (
                  <motion.a key={label} href={href}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.05, duration: 0.3, ease: [0.22,1,0.36,1] }}
                    onClick={() => { setActiveId(label); setMobileOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", padding: "14px 16px",
                      borderRadius: 12, textDecoration: "none",
                      color: activeId === label ? (isDark ? "#93C5FD" : "#1D4ED8") : textMain,
                      fontWeight: 600, fontSize: 16,
                      background: activeId === label ? (isDark ? "rgba(37,99,235,0.15)" : "rgba(37,99,235,0.07)") : "transparent",
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >{label}</motion.a>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(37,99,235,0.08)", margin: "4px 16px" }} />

              {/* Actions */}
              <div style={{ padding: "8px 8px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
                <motion.a href="/login"
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3, ease: [0.22,1,0.36,1] }}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block", padding: "13px 16px", borderRadius: 12,
                    textDecoration: "none", color: text2, fontWeight: 600, fontSize: 15,
                    border: `1px solid ${border}`, textAlign: "center",
                    transition: "background 0.2s",
                  }}
                >Se connecter</motion.a>
                <motion.div
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.3, ease: [0.22,1,0.36,1] }}
                >
                  <Link href="/register" onClick={() => setMobileOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "14px 16px", borderRadius: 12, textDecoration: "none",
                      background: "linear-gradient(135deg,#2563EB,#06B6D4)", color: "#fff",
                      fontWeight: 700, fontSize: 15,
                      boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
                    }}
                  >
                    Commencer gratuitement <Ic.Arrow s={14} c="#fff" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Animated shimmer CTA button
function NavCTA({ isDark }) {
  const [hov, setHov] = useState(false);
  return (
    <Link href="/register"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "8px 18px", borderRadius: 9999, textDecoration: "none",
        fontWeight: 700, fontSize: 14, fontFamily: FONT_BODY,
        color: "#fff", position: "relative", overflow: "hidden",
        background: hov ? "linear-gradient(135deg,#1D51CE,#059bbf)" : "linear-gradient(135deg,#2563EB,#06B6D4)",
        boxShadow: hov ? "0 8px 28px rgba(37,99,235,0.55), 0 0 0 1px rgba(37,99,235,0.3)" : "0 4px 16px rgba(37,99,235,0.38)",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        letterSpacing: "-0.1px",
      }}
    >
      {/* Shimmer sweep */}
      <motion.div
        initial={false}
        animate={hov ? { x: ["−100%","160%"] } : { x: "−100%" }}
        transition={hov ? { duration: 0.55, ease: "easeInOut" } : {}}
        style={{
          position: "absolute", top: 0, left: 0, bottom: 0, width: "50%",
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)",
          pointerEvents: "none", transform: "skewX(-16deg)",
        }}
      />
      Essai gratuit
      <motion.span animate={hov ? { x: 3 } : { x: 0 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
        <Ic.Arrow s={13} c="#fff" />
      </motion.span>
    </Link>
  );
}

// ── ElegantShape floating pill ─────────────────────────────────────────────────
function ElegantShape({ width, height, rotate, gradient, top, left, right, bottom, delay = 0, opacity = 0.18 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30, rotate: rotate - 5 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "absolute", top, left, right, bottom,
        width, height, borderRadius: 9999,
        background: gradient,
        filter: "blur(1px)",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

// ── Dot grid background ────────────────────────────────────────────────────────
function DotGrid({ dark, size = 22, opacity = 1 }) {
  const dot = dark ? `rgba(99,102,241,0.22)` : `rgba(37,99,235,0.14)`;
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: `radial-gradient(circle, ${dot} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      opacity,
    }} />
  );
}

// ── Perspective 3D grid background ────────────────────────────────────────────
function PerspectiveGrid({ dark }) {
  const lineC  = dark ? "rgba(99,102,241,0.09)" : "rgba(37,99,235,0.06)";
  const lineC2 = dark ? "rgba(99,102,241,0.14)" : "rgba(37,99,235,0.09)";
  const fadeC  = dark ? "#06091A" : "#FFFFFF";
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${lineC} 1px,transparent 1px),linear-gradient(90deg,${lineC} 1px,transparent 1px)`,
        backgroundSize: "56px 56px",
      }} />
      <div style={{
        position: "absolute", left: "-60%", right: "-60%", top: "44%", bottom: "-60%",
        backgroundImage: `linear-gradient(${lineC2} 1px,transparent 1px),linear-gradient(90deg,${lineC2} 1px,transparent 1px)`,
        backgroundSize: "80px 80px",
        transform: "perspective(520px) rotateX(72deg)",
        transformOrigin: "50% 0%",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(to bottom,${fadeC} 0%,transparent 18%,transparent 70%,${fadeC} 100%)`,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(to right,${fadeC} 0%,transparent 8%,transparent 92%,${fadeC} 100%)`,
      }} />
    </div>
  );
}

// ── SEG data ───────────────────────────────────────────────────────────────────
const SEG = [
  ["#3B82F6","Café offert"],["#8B5CF6","−20%"],["#06B6D4","Dessert"],
  ["#F59E0B","−10%"],["#10B981","Boisson"],["#EF4444","−30%"],
  ["#6366F1","Menu"],["#F97316","Pizza"],
];
const CONIC = SEG.map(([c],i,a)=>`${c} ${(i/a.length)*100}% ${((i+1)/a.length)*100}%`).join(",");

// ── Hero Wheel 3D ──────────────────────────────────────────────────────────────
function HeroWheel({ isDark }) {
  const [angle, setAngle]   = useState(0);
  const [spinning, setSpin] = useState(false);
  const [won, setWon]       = useState(null);
  const rafRef = useRef(null);

  const spin = () => {
    if (spinning) return;
    setSpin(true); setWon(null);
    const target = 1440 + Math.floor(Math.random() * 360);
    const start = Date.now(), dur = 3200, startA = angle;
    const ease = t => 1 - Math.pow(1 - t, 4);
    const tick = () => {
      const t = Math.min((Date.now() - start) / dur, 1);
      const cur = startA + target * ease(t);
      setAngle(cur);
      if (t < 1) { rafRef.current = requestAnimationFrame(tick); }
      else {
        const norm    = ((cur % 360) + 360) % 360;
        const segSize = 360 / SEG.length;
        const α = ((270 - norm) % 360 + 360) % 360;
        const idx = Math.floor(α / segSize) % SEG.length;
        setWon(SEG[idx][1]); setSpin(false);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: E, delay: 0.35 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, position: "relative" }}
    >
      {/* Glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 380, height: 380, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(37,99,235,0.25) 0%,transparent 70%)",
        filter: "blur(56px)", pointerEvents: "none",
      }} />

      <motion.div
        animate={{ rotateX: [3, 7, 3], rotateY: [-7, -2, -7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d", perspective: 900, position: "relative",
          filter: "drop-shadow(0 40px 60px rgba(37,99,235,0.3)) drop-shadow(0 8px 24px rgba(0,0,0,0.35))" }}
      >
        <div onClick={spin} style={{
          width: 300, height: 300, borderRadius: "50%",
          cursor: spinning ? "wait" : "pointer",
          background: `conic-gradient(${CONIC})`,
          transform: `rotate(${angle}deg)`,
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.3),0 0 0 8px rgba(255,255,255,0.06)",
          position: "relative",
        }}>
          {SEG.map((_,i) => (
            <div key={i} style={{
              position: "absolute", top: "50%", left: "50%", width: "50%", height: 2,
              background: "rgba(255,255,255,0.25)", transformOrigin: "0 50%",
              transform: `rotate(${(i/SEG.length)*360}deg)`,
            }} />
          ))}
          {SEG.map(([,name],i) => {
            const a = (i/SEG.length)*360+(360/SEG.length/2);
            const rad = (a-90)*Math.PI/180; const r = 105;
            return (
              <div key={i} style={{
                position: "absolute", top: `calc(50% + ${r*Math.sin(rad)}px)`,
                left: `calc(50% + ${r*Math.cos(rad)}px)`,
                transform: `translate(-50%,-50%) rotate(${a}deg)`,
                fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.92)",
                whiteSpace: "nowrap", textShadow: "0 1px 3px rgba(0,0,0,0.5)", pointerEvents: "none",
              }}>{name}</div>
            );
          })}
          <div style={{
            position: "absolute", top: "50%", left: "50%", width: 44, height: 44, borderRadius: "50%",
            background: "#fff", transform: "translate(-50%,-50%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3),0 0 0 3px rgba(37,99,235,0.4)", zIndex: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#2563EB" }} />
          </div>
        </div>
        {/* Pointer */}
        <div style={{
          position: "absolute", top: "50%", left: -22, transform: "translateY(-50%)",
          width: 0, height: 0,
          borderTop: "12px solid transparent", borderBottom: "12px solid transparent",
          borderLeft: "24px solid #F59E0B",
          filter: "drop-shadow(0 2px 8px rgba(245,158,11,0.8))", zIndex: 5,
        }} />
      </motion.div>

      <AnimatePresence mode="wait">
        {won && (
          <motion.div key="won"
            initial={{ opacity: 0, y: 12, scale: 0.88 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease: E }}
            style={{
              background: isDark ? "rgba(6,9,26,0.72)" : "rgba(255,255,255,0.75)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: isDark ? "1.5px solid rgba(245,158,11,0.35)" : "1.5px solid rgba(245,158,11,0.45)",
              borderRadius: 18, padding: "16px 32px", textAlign: "center",
              boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, marginBottom: 6,
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)" }}>VOUS AVEZ GAGNÉ</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#F59E0B", textShadow: "0 0 20px rgba(245,158,11,0.4)" }}>
              {won} 🎉
            </div>
          </motion.div>
        )}
        {!won && !spinning && (
          <motion.button key="btn" onClick={spin}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 48px rgba(37,99,235,0.55)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "13px 36px", borderRadius: 100, border: "none",
              background: "linear-gradient(135deg,#2563EB,#06B6D4)", color: "#fff",
              fontWeight: 700, fontSize: 15, cursor: "pointer",
              boxShadow: "0 8px 28px rgba(37,99,235,0.42)", fontFamily: FONT_BODY,
            }}
          >
            Tourner la démo
          </motion.button>
        )}
        {spinning && (
          <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontSize: 14, fontWeight: 600, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)" }}>
            La roue tourne…
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Animated Counter ───────────────────────────────────────────────────────────
function Counter({ to, suffix = "", duration = 1.8 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / (duration * 1000), 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ── 3D Tilt Card ──────────────────────────────────────────────────────────────
function TiltCard({ children, style, className }) {
  const ref = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-120, 120], [8, -8]), { stiffness: 300, damping: 28 });
  const ry = useSpring(useTransform(x, [-120, 120], [-8, 8]), { stiffness: 300, damping: 28 });
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(e.clientX - r.left - r.width / 2);
    y.set(e.clientY - r.top - r.height / 2);
  };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", ...style }} className={className}>
      {children}
    </motion.div>
  );
}

// ── FluidBtn ───────────────────────────────────────────────────────────────────
function FluidBtn({ href, onClick, children, variant = "primary", size = "md", style: ext = {}, isDark = false }) {
  const [hov, setHov] = useState(false);
  const pad = size === "lg" ? "18px 44px" : "12px 26px";
  const fs  = size === "lg" ? 17 : 15;
  const base = variant === "primary" ? {
    background: hov ? "linear-gradient(135deg,#1D51CE,#0599BF)" : "linear-gradient(135deg,#2563EB,#06B6D4)",
    color: "#fff", border: "none",
    boxShadow: hov ? "0 20px 56px rgba(37,99,235,0.55)" : "0 8px 28px rgba(37,99,235,0.38)",
  } : {
    background: hov ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(37,99,235,0.06)") : "transparent",
    color: isDark ? (hov ? "#EEF2FF" : "#A1A1AA") : (hov ? "#2563EB" : "#374151"),
    border: "1.5px solid",
    borderColor: isDark ? (hov ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)") : (hov ? "rgba(37,99,235,0.4)" : "rgba(0,0,0,0.14)"),
    boxShadow: "none",
  };
  const props = href
    ? { as: Link, href }
    : { as: "button", onClick };
  const Tag = href ? Link : "button";
  return (
    <Tag href={href} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, padding: pad,
        borderRadius: 100, textDecoration: "none", fontWeight: 700, fontSize: fs,
        fontFamily: FONT_BODY, letterSpacing: "-0.2px",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", cursor: "pointer",
        ...base, ...ext,
      }}>
      {children}
    </Tag>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────────
const STATS = [
  { n: 500, suffix: "+",   label: "Établissements actifs",  color: "#2563EB" },
  { n: 4.9, suffix: "★",   label: "Note Google moyenne",    color: "#F59E0B", float: true },
  { n: 98,  suffix: "%",   label: "Taux de satisfaction",   color: "#10B981" },
  { n: 5,   suffix: "min", label: "Temps de setup",         color: "#8B5CF6" },
];

const STEPS = [
  { n: "01", ac: "#2563EB", icon: Ic.Zap,       title: "Créez votre roue",    desc: "Configurez couleurs, récompenses et probabilités en quelques clics." },
  { n: "02", ac: "#8B5CF6", icon: Ic.QrCode,    title: "Affichez le QR code", desc: "Imprimez ou affichez le QR généré. Posez-le en caisse ou sur vos tables." },
  { n: "03", ac: "#10B981", icon: Ic.BarChart,   title: "Récoltez les avis",   desc: "Vos clients jouent après un avis Google. Les avis arrivent en continu." },
];

const BENTO_FEATURES = [
  { col: "span 2", rows: 1, color: "#3B82F6", icon: Ic.Sparkle,  title: "Roue 100% personnalisable",  desc: "Couleurs, récompenses, logo, probabilités par segment. Configurez tout en quelques secondes.", tags: ["Drag & drop","Live preview","Export PDF"], big: true },
  { col: "span 1", rows: 1, color: "#818CF8", icon: Ic.Shield,   title: "Anti-fraude intégré",         desc: "Codes uniques à usage unique. Impossible de tricher.", tags: ["Codes uniques","Vérification IP"] },
  { col: "span 1", rows: 1, color: "#06B6D4", icon: Ic.TrendUp,  title: "Analytics temps réel",        desc: "Scans, conversions, avis générés et ROI en direct.", tags: ["Dashboard live","Export CSV"] },
  { col: "span 1", rows: 1, color: "#38BDF8", icon: Ic.QrCode,   title: "QR Code prêt à imprimer",     desc: "PNG / SVG / PDF. URL personnalisée prête à l'emploi.", tags: ["URL perso","Sticker A4"] },
  { col: "span 2", rows: 1, color: "#10B981", icon: Ic.Layers,   title: "Multi-établissements",         desc: "Gérez tous vos restaurants, salons ou points de vente depuis une seule interface. Statistiques consolidées.", tags: ["Illimité","Stats consolidées","Rôles équipe"], big: true },
  { col: "span 1", rows: 1, color: "#F59E0B", icon: Ic.Clock,    title: "Setup en 5 minutes",           desc: "Aucune installation, aucun code. Opérationnel dès aujourd'hui.", tags: ["Guidé","Support 7j/7"] },
];

const TESTIMONIALS = [
  { q: "En 3 semaines, j'ai doublé mes avis Google. Mes clients adorent tourner la roue.", name: "Marie D.",    role: "Restauratrice, Lyon",           avatar: "MD", color: "#3B82F6" },
  { q: "La mise en place a pris 10 minutes. 15 nouveaux avis chaque semaine sans rien faire.", name: "Karim B.", role: "Gérant café, Paris",            avatar: "KB", color: "#8B5CF6" },
  { q: "Notre note Google est passée de 3.8 à 4.7 en 6 semaines. Absolument magique.", name: "Youssef A.",     role: "Food truck, Toulouse",          avatar: "YA", color: "#06B6D4" },
  { q: "Mes clients reviennent plus souvent depuis la roue. C'est un vrai boost fidélité.", name: "Sophie M.",  role: "Salon de coiffure, Bordeaux",   avatar: "SM", color: "#10B981" },
  { q: "ROI incroyable : 200 avis en 2 mois pour 29€/mois. Je ne peux plus m'en passer.", name: "Thomas R.",   role: "Pizzeria, Marseille",           avatar: "TR", color: "#F59E0B" },
  { q: "Interface simple, résultats impressionnants. Je le recommande à tous mes collègues.", name: "Isabelle V.", role: "Brasserie, Nantes",          avatar: "IV", color: "#EF4444" },
];

const PLANS = [
  { id: "free",    name: "Essentiel", price: "9,99", desc: "Après votre essai gratuit",  features: ["1 établissement","100 scans/mois","Roue personnalisée","Codes anti-fraude","Support email"],                    cta: "Démarrer l'essai",       href: "/register" },
  { id: "starter", name: "Starter",  price: "29",   desc: "Pour les indépendants",      features: ["3 établissements","500 scans/mois","Analytics avancés","URL personnalisée","Support prioritaire"],              cta: "Essai 14 jours gratuit", href: "/register", highlight: true },
  { id: "pro",     name: "Pro",      price: "79",   desc: "Pour les chaînes & agences", features: ["Établissements illimités","Scans illimités","API access","White label","Account manager dédié"],               cta: "Nous contacter",         href: "/register" },
];

const SLIDER_IMGS_DARK  = Array.from({ length: 10 }, (_, i) => `/images/slider_sombre/slider${i+1}.png`);
const SLIDER_IMGS_LIGHT = Array.from({ length: 10 }, (_, i) => `/images/slider/slider${i+1}.png`);

const iv = (delay = 0) => ({
  initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 }, transition: { duration: 0.65, ease: E, delay },
});

// ── Bento Feature Card ─────────────────────────────────────────────────────────
function BentoCard({ f, isDark, border, text, text2, card }) {
  const [hov, setHov] = useState(false);
  return (
    <TiltCard style={{ gridColumn: f.col, height: "100%" }} className={f.big ? "bento-wide" : ""}>
      <motion.div {...iv()}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          height: "100%", minHeight: f.big ? 200 : 180,
          borderRadius: 24, padding: "28px 28px",
          background: isDark
            ? `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)`
            : "#FFFFFF",
          border: `1px solid ${hov ? f.color + "55" : border}`,
          boxShadow: hov
            ? `0 0 0 1px ${f.color}22, 0 24px 56px rgba(0,0,0,${isDark ? 0.55 : 0.12}), 0 0 40px ${f.color}18`
            : isDark ? "0 4px 24px rgba(0,0,0,0.35)" : "0 2px 16px rgba(37,99,235,0.07)",
          position: "relative", overflow: "hidden",
          transition: "border-color 0.3s, box-shadow 0.3s",
          display: "flex", flexDirection: f.big ? "row" : "column",
          alignItems: f.big ? "center" : "flex-start",
          gap: f.big ? 32 : 0,
        }}
      >
        {/* Dot grid */}
        <DotGrid dark={isDark} size={18} opacity={hov ? 0.7 : 0.35} />

        {/* Glow top-right */}
        <div style={{
          position: "absolute", top: -32, right: -32, width: 120, height: 120, borderRadius: "50%",
          background: `radial-gradient(circle,${f.color}28,transparent 70%)`,
          filter: "blur(24px)", pointerEvents: "none",
          transition: "opacity 0.3s", opacity: hov ? 1 : 0.5,
        }} />

        {/* Accent top bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg,${f.color},${f.color}66)`,
          borderRadius: "24px 24px 0 0",
          opacity: hov ? 1 : 0,
          transition: "opacity 0.3s",
        }} />

        <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
          <motion.div
            animate={hov ? { rotate: 12, scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            style={{
              width: 44, height: 44, borderRadius: 13,
              background: `${f.color}18`, border: `1px solid ${f.color}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <f.icon s={20} c={f.color} />
          </motion.div>
          <h3 style={{ fontSize: f.big ? 20 : 17, fontWeight: 800, color: text, margin: "0 0 8px", letterSpacing: "-0.3px" }}>
            {f.title}
          </h3>
          <p style={{ fontSize: 13, color: text2, lineHeight: 1.7, margin: "0 0 16px" }}>
            {f.desc}
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {f.tags.map((tag, i) => (
              <span key={i} style={{
                padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                background: `${f.color}14`, border: `1px solid ${f.color}28`,
                color: f.color, letterSpacing: "0.3px",
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {f.big && (
          <div style={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
            <motion.div
              animate={hov ? { rotate: [0, 3, -3, 0], scale: 1.05 } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{
                width: 80, height: 80, borderRadius: 20,
                background: `linear-gradient(135deg,${f.color},${f.color}88)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 12px 32px ${f.color}44`,
              }}
            >
              <f.icon s={36} c="#fff" />
            </motion.div>
          </div>
        )}
      </motion.div>
    </TiltCard>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);
  const { scrollY } = useScroll();

  // ── Theme tokens ─────────────────────────────────────────────────────────────
  const bg      = isDark ? "#06091A" : "#FFFFFF";
  const bg2     = isDark ? "#0A0D22" : "#F5F7FF";
  const text     = isDark ? "#EEF2FF" : "#0A0D1E";
  const text2    = isDark ? "#8892B0" : "#4B5563";
  const text3    = isDark ? "#4A5280" : "#9CA3AF";
  const card     = isDark ? "rgba(255,255,255,0.038)" : "#FFFFFF";
  const border   = isDark ? "rgba(255,255,255,0.07)"  : "rgba(37,99,235,0.1)";
  const imgs     = isDark ? SLIDER_IMGS_DARK : SLIDER_IMGS_LIGHT;

  return (
    <div style={{ fontFamily: FONT_BODY, background: bg, color: text, minHeight: "100vh", overflowX: "clip" }}>

      {/* ── NAV ── */}
      <NavBar isDark={isDark} onToggleDark={() => setIsDark(d => !d)} />

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100dvh", position: "relative",
        display: "flex", alignItems: "center",
        padding: "100px clamp(20px,6vw,80px) 80px",
        background: bg, overflow: "hidden",
      }}>
        <PerspectiveGrid dark={isDark} />

        {/* ElegantShape floating pills */}
        <ElegantShape width={420} height={100} rotate={-18}
          gradient={isDark ? "linear-gradient(135deg,rgba(37,99,235,0.22),rgba(99,102,241,0.1))" : "linear-gradient(135deg,rgba(37,99,235,0.12),rgba(99,102,241,0.06))"}
          top="12%" left="-8%" delay={0.1} opacity={isDark ? 0.9 : 0.7} />
        <ElegantShape width={320} height={76} rotate={14}
          gradient={isDark ? "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(6,182,212,0.1))" : "linear-gradient(135deg,rgba(139,92,246,0.1),rgba(6,182,212,0.06))"}
          top="20%" right="-6%" delay={0.2} opacity={isDark ? 0.85 : 0.65} />
        <ElegantShape width={240} height={60} rotate={-8}
          gradient={isDark ? "linear-gradient(135deg,rgba(16,185,129,0.18),rgba(37,99,235,0.08))" : "linear-gradient(135deg,rgba(16,185,129,0.1),rgba(37,99,235,0.05))"}
          top="68%" left="2%" delay={0.15} opacity={isDark ? 0.8 : 0.6} />
        <ElegantShape width={280} height={70} rotate={22}
          gradient={isDark ? "linear-gradient(135deg,rgba(245,158,11,0.18),rgba(239,68,68,0.08))" : "linear-gradient(135deg,rgba(245,158,11,0.1),rgba(239,68,68,0.05))"}
          bottom="14%" right="4%" delay={0.25} opacity={isDark ? 0.8 : 0.6} />

        <div style={{
          maxWidth: 1200, margin: "0 auto", width: "100%",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,80px)",
          alignItems: "center", position: "relative", zIndex: 1,
        }} className="hero-grid">

          {/* LEFT */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: E }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
                background: isDark ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.07)",
                border: `1px solid ${isDark ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.2)"}`,
                borderRadius: 100, padding: "6px 18px 6px 8px",
              }}>
              <span style={{
                background: "#2563EB", borderRadius: 100, padding: "3px 10px",
                fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.3px",
              }}>NOUVEAU</span>
              <span style={{ color: isDark ? "#93C5FD" : "#1D4ED8", fontWeight: 600, fontSize: 13 }}>
                14 jours d&apos;essai gratuit — sans CB
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: E, delay: 0.06 }}
              style={{
                fontFamily: FONT_TITLE, fontSize: "clamp(38px,5.5vw,72px)",
                fontWeight: 400, lineHeight: 1.06, letterSpacing: "-0.02em",
                margin: "0 0 24px", color: text,
              }}>
              La roue qui <G>transforme</G>
              <br />vos clients en <G from="#8B5CF6" to="#38BDF8">avis</G>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: E, delay: 0.12 }}
              style={{ fontSize: "clamp(15px,1.6vw,18px)", lineHeight: 1.75, color: text2, margin: "0 0 36px", maxWidth: 480 }}>
              Gamifiez l&apos;expérience client. Chaque avis Google déclenche un tour de roue —
              vos clients jouent, vos avis explosent.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: E, delay: 0.18 }}
              className="hero-btns"
              style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
              <FluidBtn href="/register" variant="primary" size="lg" isDark={isDark}>
                Commencer gratuitement <Ic.Arrow />
              </FluidBtn>
              <FluidBtn href="/login" variant="ghost" size="lg" isDark={isDark}>
                Voir la démo
              </FluidBtn>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.28 }}
              style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex" }}>
                  {["#3B82F6","#8B5CF6","#10B981","#F59E0B","#EF4444"].map((c,i) => (
                    <div key={i} style={{
                      width: 28, height: 28, borderRadius: "50%", border: `2px solid ${bg}`,
                      background: `linear-gradient(135deg,${c},${c}bb)`,
                      marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 800, color: "#fff",
                    }}>
                      {["M","K","Y","S","T"][i]}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 13, color: text2, fontWeight: 600 }}>500+ clients actifs</span>
              </div>
              <div style={{ width: 1, height: 18, background: border }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {[...Array(5)].map((_, i) => <Ic.Star key={i} s={13} />)}
                <span style={{ fontSize: 13, color: text2, fontWeight: 600 }}>4.9 / 5</span>
              </div>
              <div style={{ width: 1, height: 18, background: border }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Ic.Google s={16} />
                <span style={{ fontSize: 13, color: text2, fontWeight: 600 }}>Google Reviews</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="hero-wheel-wrap" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <HeroWheel isDark={isDark} />
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          style={{
            position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.22)"} strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ── SLIDER STRIP ── */}
      <div style={{
        borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`,
        background: isDark ? "rgba(255,255,255,0.02)" : bg2,
        padding: "24px 0", overflow: "hidden", position: "relative",
      }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, zIndex: 2, pointerEvents: "none",
          background: `linear-gradient(to right,${isDark ? "#06091A" : bg2},transparent)` }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, zIndex: 2, pointerEvents: "none",
          background: `linear-gradient(to left,${isDark ? "#06091A" : bg2},transparent)` }} />
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", alignItems: "center", gap: 56, width: "max-content" }}>
          {[...imgs, ...imgs].map((src, i) => (
            <img key={i} src={src} alt={`partenaire ${(i%10)+1}`}
              style={{ height: 44, width: "auto", maxWidth: 160, objectFit: "contain", flexShrink: 0, opacity: 0.72 }} />
          ))}
        </motion.div>
      </div>

      {/* ── STATS ── */}
      <section style={{ background: bg2, padding: "clamp(64px,8vw,100px) clamp(20px,6vw,80px)", position: "relative" }}>
        <DotGrid dark={isDark} size={26} opacity={0.6} />
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1,
            borderRadius: 24, overflow: "hidden",
            border: `1px solid ${border}`,
            boxShadow: isDark ? "0 4px 40px rgba(0,0,0,0.4)" : "0 4px 32px rgba(37,99,235,0.07)",
          }} className="stats-grid">
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...iv(i * 0.08)}
                style={{
                  padding: "clamp(28px,4vw,44px) clamp(20px,3vw,36px)",
                  background: isDark ? "rgba(255,255,255,0.035)" : card,
                  textAlign: "center",
                  borderRight: i < 3 ? `1px solid ${border}` : "none",
                  position: "relative", overflow: "hidden",
                }}>
                <div style={{
                  position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)",
                  width: 120, height: 120, borderRadius: "50%",
                  background: `radial-gradient(circle,${s.color}22,transparent 70%)`, pointerEvents: "none",
                }} />
                <div style={{
                  fontFamily: FONT_TITLE, fontSize: "clamp(32px,4vw,52px)",
                  fontWeight: 400, color: s.color, lineHeight: 1, marginBottom: 8, letterSpacing: "-0.02em",
                }}>
                  {s.float ? <span>{s.n}{s.suffix}</span> : <Counter to={s.n} suffix={s.suffix} />}
                </div>
                <div style={{ fontSize: 13, color: text3, fontWeight: 500 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="features" style={{ padding: "clamp(80px,10vw,130px) clamp(20px,6vw,80px)", background: bg, position: "relative" }}>
        <DotGrid dark={isDark} size={22} opacity={0.5} />
        <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div {...iv()} style={{ textAlign: "center", marginBottom: "clamp(48px,6vw,72px)" }}>
            <div style={{ fontSize: 11, color: "#2563EB", fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 14 }}>
              COMMENT ÇA MARCHE
            </div>
            <h2 style={{ fontFamily: FONT_TITLE, fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 400, margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.08, color: text }}>
              Opérationnel en <G>3 étapes</G>
            </h2>
            <p style={{ color: text2, fontSize: 16, maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>
              Pas de développeur. Pas de carte bancaire. Juste vos premiers avis.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, position: "relative" }} className="steps-grid">
            {/* Connector line */}
            <div className="step-connector" style={{
              position: "absolute", top: 52, left: "calc(16.66% + 24px)", right: "calc(16.66% + 24px)",
              height: 1, background: `linear-gradient(90deg,${border},rgba(37,99,235,0.3),${border})`,
              zIndex: 0,
            }} />
            {STEPS.map((s, i) => (
              <motion.div key={s.n} {...iv(i * 0.1)} style={{ position: "relative", zIndex: 1 }}>
                <TiltCard style={{ height: "100%" }}>
                  <div style={{
                    background: isDark ? "rgba(255,255,255,0.035)" : card,
                    border: `1px solid ${border}`, borderRadius: 20,
                    padding: "36px 32px", height: "100%", position: "relative", overflow: "hidden",
                    boxShadow: isDark ? "0 4px 32px rgba(0,0,0,0.35)" : "0 4px 24px rgba(37,99,235,0.07)",
                  }}>
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 3,
                      background: `linear-gradient(90deg,${s.ac},${s.ac}77)`, borderRadius: "20px 20px 0 0",
                    }} />
                    <div style={{
                      fontFamily: "'DM Mono',monospace", fontSize: 48, fontWeight: 400,
                      color: `${s.ac}${isDark ? "22" : "18"}`, lineHeight: 1, marginBottom: 20, letterSpacing: "-3px",
                    }}>{s.n}</div>
                    <div style={{
                      width: 46, height: 46, borderRadius: 13, background: `${s.ac}14`,
                      border: `1px solid ${s.ac}22`, display: "flex", alignItems: "center",
                      justifyContent: "center", marginBottom: 18,
                    }}>
                      <s.icon s={22} c={s.ac} />
                    </div>
                    <h3 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 10px", color: text, letterSpacing: "-0.3px" }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: text2, lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURES ── */}
      <section style={{ padding: "clamp(80px,10vw,120px) clamp(20px,6vw,80px)", background: bg2, position: "relative" }}>
        <DotGrid dark={isDark} size={20} opacity={0.45} />
        <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div {...iv()} style={{ textAlign: "center", marginBottom: "clamp(40px,5vw,64px)" }}>
            <div style={{ fontSize: 11, color: "#8B5CF6", fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 14 }}>
              FONCTIONNALITÉS
            </div>
            <h2 style={{ fontFamily: FONT_TITLE, fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 400, margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.08, color: text }}>
              Tout ce qu&apos;il faut pour <G from="#8B5CF6" to="#06B6D4">booster vos avis</G>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, alignItems: "stretch" }} className="bento-grid">
            {BENTO_FEATURES.map((f, i) => (
              <BentoCard key={i} f={f} isDark={isDark} border={border} text={text} text2={text2} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ padding: "clamp(80px,10vw,120px) 0", background: bg, overflow: "hidden", position: "relative" }}>
        <DotGrid dark={isDark} size={24} opacity={0.4} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <motion.div {...iv()} style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,56px)", padding: "0 24px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20,
              background: card, border: `1px solid ${border}`, borderRadius: 12,
              padding: "10px 20px", boxShadow: isDark ? "0 2px 16px rgba(0,0,0,0.3)" : "0 2px 12px rgba(37,99,235,0.07)",
            }}>
              <div style={{ background: "#00B67A", borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.1L12 17.2l-6.2 3.8 2.4-7.1L2 9.4h7.6L12 2z" fill="white" /></svg>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#00B67A", letterSpacing: 0.5 }}>Trustpilot</div>
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  {[...Array(5)].map((_, i) => <svg key={i} width="11" height="11" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.1L12 17.2l-6.2 3.8 2.4-7.1L2 9.4h7.6L12 2z" fill="#00B67A" /></svg>)}
                  <span style={{ fontSize: 11, color: text2, marginLeft: 2, fontWeight: 600 }}>4.9</span>
                </div>
              </div>
              <div style={{ width: 1, height: 28, background: border, margin: "0 4px" }} />
              <Ic.Shield s={13} c="#10B981" />
              <span style={{ fontSize: 12, color: text2, fontWeight: 600 }}>Avis vérifiés</span>
            </div>
            <h2 style={{ fontFamily: FONT_TITLE, fontSize: "clamp(26px,4.5vw,52px)", fontWeight: 400, margin: "0 0 12px", letterSpacing: "-0.02em", lineHeight: 1.08, color: text }}>
              500+ établissements <G>nous font confiance</G>
            </h2>
            <p style={{ color: text2, fontSize: 15, fontWeight: 500 }}>
              4.9 / 5 de note moyenne · Avis vérifiés Google
            </p>
          </motion.div>

          {/* Infinite scroll rows — top */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, zIndex: 2, pointerEvents: "none",
              background: `linear-gradient(to right,${bg},transparent)` }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, zIndex: 2, pointerEvents: "none",
              background: `linear-gradient(to left,${bg},transparent)` }} />
            <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              style={{ display: "flex", gap: 14, width: "max-content", padding: "6px 24px" }}>
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <motion.div key={i} whileHover={{ y: -5, scale: 1.01 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  style={{
                    width: 300, flexShrink: 0, background: card, border: `1px solid ${border}`,
                    borderRadius: 20, padding: "24px", cursor: "default",
                    boxShadow: isDark ? "0 4px 32px rgba(0,0,0,0.35)" : "0 2px 16px rgba(37,99,235,0.07)",
                  }}>
                  <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                    {[...Array(5)].map((_, j) => <Ic.Star key={j} s={13} />)}
                  </div>
                  <p style={{ fontSize: 14, color: text2, lineHeight: 1.8, margin: "0 0 20px", fontStyle: "italic" }}>
                    &ldquo;{t.q}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 16, borderTop: `1px solid ${border}` }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                      background: `linear-gradient(135deg,${t.color},${t.color}88)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, color: "#fff", fontSize: 13, letterSpacing: "0.5px",
                      boxShadow: `0 4px 12px ${t.color}44`,
                    }}>{t.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: text }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: text3 }}>{t.role}</div>
                    </div>
                    <Ic.Google s={16} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Trust badges */}
          <motion.div {...iv(0.1)} className="trust-badges" style={{ display: "grid", gridTemplateColumns: "repeat(4,auto)", justifyContent: "center", gap: 12, marginTop: 40, padding: "0 24px" }}>
            {[
              { icon: Ic.Shield, label: "RGPD Conforme",   sub: "Données hébergées en France" },
              { icon: Ic.Lock,   label: "SSL / HTTPS",     sub: "Connexion 100% sécurisée" },
              { icon: Ic.Check,  label: "Sans engagement", sub: "Résiliez à tout moment" },
              { icon: Ic.Zap,    label: "99.9% uptime",    sub: "Infrastructure Vercel / Atlas" },
            ].map((b, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 20px", borderRadius: 14, border: `1px solid ${border}`,
                background: card, boxShadow: isDark ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 8px rgba(37,99,235,0.06)",
              }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <b.icon s={16} c="#10B981" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: text }}>{b.label}</div>
                  <div style={{ fontSize: 11, color: text3 }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "clamp(80px,10vw,130px) clamp(20px,6vw,80px)", background: bg2, position: "relative" }}>
        <DotGrid dark={isDark} size={22} opacity={0.5} />

        {/* Radial glow center */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: "80%", height: "60%", pointerEvents: "none",
          background: isDark
            ? "radial-gradient(ellipse,rgba(37,99,235,0.08) 0%,transparent 70%)"
            : "radial-gradient(ellipse,rgba(37,99,235,0.04) 0%,transparent 70%)",
          filter: "blur(60px)",
        }} />

        <div style={{ maxWidth: 1020, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div {...iv()} style={{ textAlign: "center", marginBottom: "clamp(48px,6vw,72px)" }}>
            <div style={{ fontSize: 11, color: "#F59E0B", fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 14 }}>TARIFS</div>
            <h2 style={{ fontFamily: FONT_TITLE, fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 400, margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.08, color: text }}>
              Simple. <G from="#F59E0B" to="#EF4444">Transparent.</G> Sans surprise.
            </h2>
            <p style={{ color: text2, fontSize: 16, maxWidth: 360, margin: "0 auto" }}>
              14 jours gratuits sur tous les plans. Sans carte bancaire.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, alignItems: "start" }} className="pricing-grid">
            {PLANS.map((plan, i) => (
              <TiltCard key={plan.id}>
                <motion.div {...iv(i * 0.1)}
                  style={{
                    borderRadius: 24, padding: "36px 32px", position: "relative",
                    display: "flex", flexDirection: "column",
                    ...(plan.highlight ? {
                      background: isDark
                        ? "linear-gradient(145deg,rgba(37,99,235,0.18),rgba(6,182,212,0.1))"
                        : "linear-gradient(145deg,#0F172A,#1e2d4a)",
                      border: "1px solid rgba(37,99,235,0.4)",
                      boxShadow: "0 0 0 1px rgba(37,99,235,0.12),0 24px 56px rgba(37,99,235,0.28)",
                    } : {
                      background: isDark ? "rgba(255,255,255,0.038)" : card,
                      border: `1px solid ${border}`,
                      boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.35)" : "0 2px 16px rgba(37,99,235,0.07)",
                    }),
                  }}>
                  {plan.highlight && (
                    <>
                      {/* Glassmorphism glow for highlight card */}
                      <div style={{
                        position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
                        width: 200, height: 120, borderRadius: "50%",
                        background: "radial-gradient(circle,rgba(37,99,235,0.35),transparent 70%)",
                        filter: "blur(32px)", pointerEvents: "none",
                      }} />
                      <div style={{
                        position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                        background: "linear-gradient(135deg,#2563EB,#06B6D4)", color: "#fff",
                        fontWeight: 800, fontSize: 11, padding: "4px 20px", borderRadius: 100,
                        whiteSpace: "nowrap", letterSpacing: "0.5px",
                        boxShadow: "0 4px 14px rgba(37,99,235,0.45)",
                      }}>LE PLUS POPULAIRE</div>
                    </>
                  )}

                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color: plan.highlight ? "#60A5FA" : text3, marginBottom: 16 }}>
                    {plan.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 4 }}>
                    <span style={{ fontFamily: FONT_TITLE, fontSize: 52, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1, color: plan.highlight ? "#F5F5F7" : text }}>
                      {plan.price}
                    </span>
                    <span style={{ fontSize: 18, color: plan.highlight ? "#6E6E73" : text2, marginLeft: 2 }}>€</span>
                    <span style={{ fontSize: 13, color: plan.highlight ? "#6E6E73" : text3, marginLeft: 2 }}>/mois</span>
                  </div>
                  <p style={{ color: plan.highlight ? "#6E6E73" : text3, fontSize: 13, margin: "0 0 24px", lineHeight: 1.5 }}>
                    {plan.desc}
                  </p>
                  <div style={{ height: 1, background: plan.highlight ? "rgba(255,255,255,0.09)" : border, marginBottom: 22 }} />
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                    {plan.features.map(feat => (
                      <li key={feat} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: plan.highlight ? "#A1A1A6" : text2 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                          background: plan.highlight ? "rgba(37,99,235,0.18)" : "rgba(16,185,129,0.1)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Ic.Check s={11} c={plan.highlight ? "#60A5FA" : "#10B981"} />
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <FluidBtn href={plan.href} variant={plan.highlight ? "primary" : "ghost"}
                    isDark={plan.highlight || isDark}
                    style={{ justifyContent: "center", borderRadius: 100 }}>
                    {plan.cta}
                  </FluidBtn>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        background: "#060C1E", padding: "clamp(100px,12vw,160px) clamp(20px,6vw,80px)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(99,102,241,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.08) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }} />
          <div style={{
            position: "absolute", left: "-60%", right: "-60%", top: "40%", bottom: "-60%",
            backgroundImage: "linear-gradient(rgba(99,102,241,0.13) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.13) 1px,transparent 1px)",
            backgroundSize: "80px 80px",
            transform: "perspective(520px) rotateX(72deg)", transformOrigin: "50% 0%",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom,#060C1E 0%,transparent 20%,transparent 70%,#060C1E 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 70% 50% at 50% 50%,rgba(37,99,235,0.13),transparent)",
          }} />
          {/* Floating pills in CTA */}
          <ElegantShape width={260} height={62} rotate={-16}
            gradient="linear-gradient(135deg,rgba(37,99,235,0.3),rgba(99,102,241,0.15))"
            top="10%" left="3%" delay={0} opacity={0.9} />
          <ElegantShape width={180} height={48} rotate={14}
            gradient="linear-gradient(135deg,rgba(6,182,212,0.25),rgba(139,92,246,0.12))"
            top="18%" right="5%" delay={0.1} opacity={0.85} />
        </div>

        <div style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <motion.div {...iv(0)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.22)",
            borderRadius: 100, padding: "6px 18px", marginBottom: 28,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3B82F6", animation: "pulse-dot 1.4s infinite" }} />
            <span style={{ color: "#93C5FD", fontWeight: 700, fontSize: 12, letterSpacing: "0.5px" }}>500+ ÉTABLISSEMENTS ACTIFS</span>
          </motion.div>
          <motion.h2 {...iv(0.06)} style={{
            fontFamily: FONT_TITLE, fontSize: "clamp(32px,5.5vw,72px)", fontWeight: 400,
            margin: "0 0 20px", lineHeight: 1.06, letterSpacing: "-0.02em", color: "#F5F5F7",
          }}>
            Prêt à transformer vos clients en <G>ambassadeurs ?</G>
          </motion.h2>
          <motion.p {...iv(0.12)} style={{ color: "#6E6E73", fontSize: 17, marginBottom: 44, lineHeight: 1.75 }}>
            Rejoignez 500+ établissements. Aucune carte bancaire requise.<br />
            <strong style={{ color: "#A1A1A6" }}>Résultats visibles dès la première semaine.</strong>
          </motion.p>
          <motion.div {...iv(0.18)} style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <FluidBtn href="/register" size="lg" isDark={true}>
              Commencer gratuitement <Ic.Arrow />
            </FluidBtn>
            <FluidBtn href="/login" variant="ghost" size="lg" isDark={true}
              style={{ color: "#A1A1A6", borderColor: "rgba(255,255,255,0.15)" }}>
              Voir la démo
            </FluidBtn>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#040710", borderTop: "1px solid rgba(99,102,241,0.1)" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          padding: "clamp(28px,4vw,44px) clamp(20px,6vw,80px)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
        }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height: 30, objectFit: "contain" }} />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[["Connexion","/login"],["Créer un compte","/register"],["Dashboard","/dashboard"]].map(([label, href]) => (
              <Link key={label} href={href} style={{ color: "#52525B", textDecoration: "none", fontSize: 13, fontWeight: 500, padding: "6px 12px", borderRadius: 8 }}>{label}</Link>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#374151" }}>© 2026 VisiumBoost — Tous droits réservés</span>
            <Link href="/mentions-legales" style={{ fontSize: 12, color: "#52525B", textDecoration: "none", borderBottom: "1px solid #374151", paddingBottom: 1 }}>Mentions légales</Link>
          </div>
        </div>
      </footer>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { transition: background-color 0.4s ease, color 0.4s ease; }
        html { scroll-behavior: smooth; }

        /* Grids — desktop defaults */
        .hero-grid    { grid-template-columns: 1fr 1fr; }
        .steps-grid   { grid-template-columns: repeat(3,1fr); }
        .pricing-grid { grid-template-columns: repeat(3,1fr); }
        .stats-grid   { grid-template-columns: repeat(4,1fr); }
        .bento-grid   { grid-template-columns: repeat(3,1fr); }
        .nav-links         { display: flex; }
        .nav-right-desktop { display: flex; }
        .nav-right-mobile  { display: none !important; }

        /* Tablet — ≤ 1024 */
        @media (max-width: 1024px) {
          .hero-grid  { grid-template-columns: 1fr !important; }
          .bento-grid { grid-template-columns: repeat(2,1fr) !important; }
          .bento-wide { grid-column: span 2 !important; }
          .pricing-grid { grid-template-columns: repeat(2,1fr) !important; }
        }

        /* Mobile — ≤ 768 */
        @media (max-width: 768px) {
          .nav-links          { display: none !important; }
          .nav-right-desktop  { display: none !important; }
          .nav-right-mobile   { display: flex !important; }

          .steps-grid   { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .stats-grid   { grid-template-columns: repeat(2,1fr) !important; }
          .bento-grid   { grid-template-columns: 1fr !important; }
          .bento-wide   { grid-column: span 1 !important; }
          .step-connector { display: none !important; }

          /* Hero adjustments */
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-wheel-wrap { display: none !important; }

          /* Buttons — full width stack on mobile */
          .hero-btns { flex-direction: column !important; align-items: stretch !important; }
          .hero-btns a, .hero-btns button { justify-content: center !important; width: 100% !important; }

          /* Trust badges — 2 cols */
          .trust-badges { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }

          /* Section padding reduction */
          section { padding-left: 18px !important; padding-right: 18px !important; }
        }

        /* Small phones — ≤ 480 */
        @media (max-width: 480px) {
          .stats-grid   { grid-template-columns: repeat(2,1fr) !important; }
          .trust-badges { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
        }

        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.6)} }
      `}</style>
    </div>
  );
}
