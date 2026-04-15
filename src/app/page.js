"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring, animate } from "framer-motion";

const E = [0.22, 1, 0.36, 1];
const FONT_TITLE  = "'Special Gothic Expanded One','DM Sans',system-ui,sans-serif";
const FONT_BODY   = "'DM Sans',system-ui,sans-serif";
const FONT_ITALIC = "'DM Sans',system-ui,sans-serif";

// Accent span — italic DM Sans + blue gradient
const G = ({ children }) => (
  <span style={{
    fontFamily: FONT_ITALIC,
    fontStyle: "italic",
    fontWeight: 700,
    background: "linear-gradient(135deg,#2563EB 0%,#38BDF8 55%,#818CF8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "inline",
  }}>{children}</span>
);

// ─── Icons ───────────────────────────────────────────────────────────────────
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
  Buildings: ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="9" width="13" height="13"/><path d="M8 9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/><rect x="16" y="13" width="5" height="9"/></svg>,
  Arrow:     ({s=16,c="#fff"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Lock:      ({s=14,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Target:    ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill={c}/></svg>,
};

// ─── Trustpilot SVG ───────────────────────────────────────────────────────────
const TrustpilotLogo = ({h=22}) => (
  <svg height={h} viewBox="0 0 116 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 0L18.09 11.09H30L20.45 17.95L24.05 29.04L14.5 22.18L4.95 29.04L8.55 17.95L-1 11.09H10.91L14.5 0Z" fill="#00B67A"/>
    <rect x="36" y="8" width="6" height="14" rx="1" fill="#00B67A"/>
    <text x="46" y="21" fontFamily="'DM Sans',sans-serif" fontSize="14" fontWeight="700" fill="#191919">Trustpilot</text>
  </svg>
);

// ─── Wheel segments ───────────────────────────────────────────────────────────
const SEG = [
  ["#3B82F6","Café offert"],["#8B5CF6","−20%"],["#06B6D4","Dessert"],
  ["#F59E0B","−10%"],["#10B981","Boisson"],["#EF4444","−30%"],
  ["#6366F1","Menu"],["#F97316","Pizza"],
];
const CONIC = SEG.map(([c],i,a)=>`${c} ${(i/a.length)*100}% ${((i+1)/a.length)*100}%`).join(",");

// ─── 3D Hero Wheel ────────────────────────────────────────────────────────────
function HeroWheel3D() {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [won, setWon] = useState(null);
  const rafRef = useRef(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWon(null);
    const target = 1440 + Math.floor(Math.random() * 360);
    const start = Date.now();
    const dur = 3200;
    const startA = angle;
    const ease = t => 1 - Math.pow(1 - t, 4);
    const tick = () => {
      const t = Math.min((Date.now() - start) / dur, 1);
      const cur = startA + target * ease(t);
      setAngle(cur);
      if (t < 1) { rafRef.current = requestAnimationFrame(tick); }
      else {
        const norm = ((cur % 360) + 360) % 360;
        const idx  = Math.floor(((360 - norm + 360/SEG.length/2) % 360) / (360/SEG.length)) % SEG.length;
        setWon(SEG[idx][1]);
        setSpinning(false);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <motion.div
      initial={{ opacity:0, x:60, rotateY:-15 }}
      animate={{ opacity:1, x:0, rotateY:0 }}
      transition={{ duration:1, ease:E, delay:0.3 }}
      style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}
    >
      {/* Glow */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        width:360, height:360, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 70%)",
        filter:"blur(48px)", pointerEvents:"none" }}/>

      {/* 3D tilt wrapper */}
      <motion.div
        animate={{ rotateX:[3,7,3], rotateY:[-8,-3,-8] }}
        transition={{ duration:6, repeat:Infinity, ease:"easeInOut" }}
        style={{ transformStyle:"preserve-3d", perspective:900,
          filter:"drop-shadow(0 40px 60px rgba(37,99,235,0.3)) drop-shadow(0 8px 24px rgba(0,0,0,0.35))",
          position:"relative" }}
      >
        {/* Wheel */}
        <div
          onClick={spin}
          style={{ width:300, height:300, borderRadius:"50%", cursor: spinning ? "wait" : "pointer",
            background:`conic-gradient(${CONIC})`,
            transform:`rotate(${angle}deg)`,
            boxShadow:"inset 0 0 60px rgba(0,0,0,0.3), 0 0 0 8px rgba(255,255,255,0.06)",
            position:"relative", transition: spinning ? "none" : undefined }}
        >
          {SEG.map((_,i) => (
            <div key={i} style={{ position:"absolute", top:"50%", left:"50%", width:"50%", height:2,
              background:"rgba(255,255,255,0.25)", transformOrigin:"0 50%",
              transform:`rotate(${(i/SEG.length)*360}deg)` }}/>
          ))}
          {SEG.map(([,name],i) => {
            const angleDeg = (i / SEG.length) * 360 + (360 / SEG.length / 2);
            const rad = (angleDeg - 90) * Math.PI / 180;
            const r = 105;
            return (
              <div key={i} style={{
                position:"absolute", top:`calc(50% + ${r*Math.sin(rad)}px)`,
                left:`calc(50% + ${r*Math.cos(rad)}px)`,
                transform:`translate(-50%,-50%) rotate(${angleDeg}deg)`,
                fontSize:9, fontWeight:800, color:"rgba(255,255,255,0.92)",
                whiteSpace:"nowrap", textShadow:"0 1px 3px rgba(0,0,0,0.5)",
                pointerEvents:"none",
              }}>{name}</div>
            );
          })}
          {/* Hub */}
          <div style={{ position:"absolute", top:"50%", left:"50%", width:44, height:44,
            borderRadius:"50%", background:"#fff", transform:"translate(-50%,-50%)",
            boxShadow:"0 4px 20px rgba(0,0,0,0.3), 0 0 0 3px rgba(37,99,235,0.4)", zIndex:2,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:14, height:14, borderRadius:"50%", background:"#2563EB" }}/>
          </div>
        </div>

        {/* Arrow pointer */}
        <div style={{ position:"absolute", top:"50%", left:-22, transform:"translateY(-50%)",
          width:0, height:0, borderTop:"12px solid transparent", borderBottom:"12px solid transparent",
          borderLeft:"24px solid #F59E0B",
          filter:"drop-shadow(0 2px 6px rgba(245,158,11,0.7))", zIndex:5 }}/>
      </motion.div>

      {/* Win toast */}
      {won && (
        <motion.div initial={{opacity:0,y:10,scale:0.9}} animate={{opacity:1,y:0,scale:1}}
          transition={{duration:0.4, ease:E}}
          style={{ background:"rgba(10,10,20,0.9)", backdropFilter:"blur(16px)",
            border:"1.5px solid rgba(245,158,11,0.4)", borderRadius:16,
            padding:"14px 24px", textAlign:"center" }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", fontWeight:700, letterSpacing:1, marginBottom:4 }}>VOUS AVEZ GAGNÉ</div>
          <div style={{ fontSize:20, fontWeight:900, color:"#F59E0B" }}>{won} 🎉</div>
        </motion.div>
      )}
      {!won && !spinning && (
        <button onClick={spin} style={{
          padding:"12px 32px", borderRadius:100, border:"none",
          background:"linear-gradient(135deg,#2563EB,#06B6D4)",
          color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer",
          boxShadow:"0 8px 24px rgba(37,99,235,0.4)",
          fontFamily:FONT_BODY,
        }}>
          Tourner la démo
        </button>
      )}
      {spinning && (
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.5)", fontWeight:600 }}>La roue tourne…</div>
      )}
    </motion.div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix="", duration=1.8 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now()-start)/(duration*1000), 1);
          const eased = 1 - Math.pow(1-p, 3);
          setVal(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold:0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── TiltCard ─────────────────────────────────────────────────────────────────
function TiltCard({ children, style, className }) {
  const ref = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rx = useSpring(useTransform(y,[-120,120],[8,-8]),{stiffness:300,damping:28});
  const ry = useSpring(useTransform(x,[-120,120],[-8,8]),{stiffness:300,damping:28});
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(e.clientX-r.left-r.width/2); y.set(e.clientY-r.top-r.height/2);
  };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={()=>{x.set(0);y.set(0);}}
      style={{ rotateX:rx, rotateY:ry, transformStyle:"preserve-3d", ...style }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Fluid button ─────────────────────────────────────────────────────────────
function FluidBtn({ href, children, variant="primary", size="md", style:ext={} }) {
  const [hov, setHov] = useState(false);
  const pad = size==="lg" ? "18px 44px" : "13px 28px";
  const fs  = size==="lg" ? 17 : 15;
  const base = variant==="primary" ? {
    background: hov ? "linear-gradient(135deg,#1D51CE,#0599BF)" : "linear-gradient(135deg,#2563EB,#06B6D4)",
    color:"#fff",
    boxShadow: hov ? "0 20px 56px rgba(37,99,235,0.55)" : "0 8px 28px rgba(37,99,235,0.38)",
    border:"none",
  } : {
    background: hov ? `rgba(37,99,235,0.08)` : "transparent",
    color: hov ? "#2563EB" : "#374151",
    border:"1.5px solid",
    borderColor: hov ? "rgba(37,99,235,0.4)" : "rgba(0,0,0,0.14)",
    boxShadow:"none",
  };
  return (
    <Link href={href} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"inline-flex", alignItems:"center", gap:8, padding:pad,
        borderRadius:100, textDecoration:"none", fontWeight:700, fontSize:fs,
        fontFamily:FONT_BODY, letterSpacing:"-0.2px",
        transition:"all 0.25s cubic-bezier(0.4,0,0.2,1)",
        cursor:"pointer", ...base, ...ext }}>
      {children}
    </Link>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { n:500, suffix:"+", label:"Établissements actifs", color:"#2563EB" },
  { n:4.9, suffix:"★", label:"Note Google moyenne",   color:"#F59E0B", float:true },
  { n:98,  suffix:"%", label:"Taux de satisfaction",  color:"#10B981" },
  { n:5,   suffix:"min", label:"Temps de setup",      color:"#8B5CF6" },
];

const FEATURES = [
  { icon:Ic.Target,   ac:"#2563EB", title:"Roue 100% personnalisable", desc:"Couleurs, récompenses, logo, probabilités. Votre marque, votre expérience.", big:true },
  { icon:Ic.Shield,   ac:"#7C3AED", title:"Anti-fraude",               desc:"Codes uniques à usage unique. Seuls les vrais clients jouent." },
  { icon:Ic.BarChart, ac:"#0891B2", title:"Analytics temps réel",      desc:"Scans, conversions, ROI en un coup d'œil." },
  { icon:Ic.QrCode,   ac:"#059669", title:"QR Code intégré",           desc:"Générez et téléchargez un QR imprimable en un clic." },
  { icon:Ic.Buildings,ac:"#DC2626", title:"Multi-établissements",      desc:"Un dashboard pour tous vos sites." },
  { icon:Ic.Zap,      ac:"#D97706", title:"Setup en 5 minutes",        desc:"Aucune compétence technique requise. Guidé pas à pas." },
];

const STEPS = [
  { n:"01", ac:"#2563EB", icon:Ic.Zap,      title:"Créez votre roue",    desc:"Configurez couleurs, récompenses et probabilités en quelques clics." },
  { n:"02", ac:"#8B5CF6", icon:Ic.QrCode,   title:"Affichez le QR code", desc:"Imprimez ou affichez le QR généré. Posez-le en caisse ou sur vos tables." },
  { n:"03", ac:"#10B981", icon:Ic.BarChart,  title:"Récoltez les avis",   desc:"Vos clients jouent après un avis Google. Les avis arrivent en continu." },
];

const TESTIMONIALS = [
  { q:"En 3 semaines, j'ai doublé mes avis Google. Mes clients adorent tourner la roue.", name:"Marie D.", role:"Restauratrice, Lyon",       avatar:"MD", color:"#3B82F6" },
  { q:"La mise en place a pris 10 minutes. 15 nouveaux avis chaque semaine sans rien faire.", name:"Karim B.", role:"Gérant café, Paris",    avatar:"KB", color:"#8B5CF6" },
  { q:"Notre note Google est passée de 3.8 à 4.7 en 6 semaines. Absolument magique.", name:"Youssef A.", role:"Food truck, Toulouse",       avatar:"YA", color:"#06B6D4" },
  { q:"Mes clients reviennent plus souvent depuis la roue. C'est un vrai boost fidélité.", name:"Sophie M.", role:"Salon de coiffure, Bordeaux", avatar:"SM", color:"#10B981" },
  { q:"ROI incroyable : 200 avis en 2 mois pour 29€/mois. Je ne peux plus m'en passer.", name:"Thomas R.", role:"Pizzeria, Marseille",       avatar:"TR", color:"#F59E0B" },
  { q:"Interface simple, résultats impressionnants. Je le recommande à tous mes collègues.", name:"Isabelle V.", role:"Brasserie, Nantes",    avatar:"IV", color:"#EF4444" },
];

const PLANS = [
  { id:"free",    name:"Essentiel", price:"9,99", desc:"Après votre essai gratuit",  features:["1 établissement","100 scans/mois","Roue personnalisée","Codes anti-fraude","Support email"],                     cta:"Démarrer l'essai", href:"/register" },
  { id:"starter", name:"Starter",  price:"29",   desc:"Pour les indépendants",      features:["3 établissements","500 scans/mois","Analytics avancés","URL personnalisée","Support prioritaire"], cta:"Essai 14 jours gratuit", href:"/register", highlight:true },
  { id:"pro",     name:"Pro",      price:"79",   desc:"Pour les chaînes & agences", features:["Établissements illimités","Scans illimités","API access","White label","Account manager dédié"],   cta:"Nous contacter",         href:"/register" },
];

const SLIDER_IMGS = Array.from({length:10},(_,i)=>`/images/slider/slider${i+1}.png`);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);
  const { scrollY } = useScroll();
  const navShadow = useTransform(scrollY,[0,60],["rgba(0,0,0,0)","rgba(0,0,0,0.07)"]);

  const iv = (delay=0) => ({
    initial:{opacity:0, y:28},
    whileInView:{opacity:1, y:0},
    viewport:{once:true, amount:0.1},
    transition:{duration:0.65, ease:E, delay},
  });

  const bg    = isDark ? "#090912" : "#FAFAFA";
  const bg2   = isDark ? "#0F0F1A" : "#F3F4F6";
  const text  = isDark ? "#F5F5F7" : "#0F172A";
  const text2 = isDark ? "#A1A1A6" : "#6B7280";
  const text3 = isDark ? "#52525B" : "#9CA3AF";
  const card  = isDark ? "rgba(255,255,255,0.04)" : "#FFFFFF";
  const border= isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const navBg = isDark ? "rgba(9,9,18,0.92)"  : "rgba(250,250,250,0.88)";

  return (
    <div style={{ fontFamily:FONT_BODY, background:bg, color:text, minHeight:"100vh", overflowX:"hidden" }}>

      {/* ── NAV ── */}
      <motion.nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 clamp(20px,5vw,72px)", height:62,
        backdropFilter:"blur(24px) saturate(180%)",
        WebkitBackdropFilter:"blur(24px) saturate(180%)",
        background:navBg,
        borderBottom:`1px solid ${border}`,
      }}>
        <Link href="/" style={{ textDecoration:"none" }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height:34, objectFit:"contain" }}/>
        </Link>

        <div className="nav-links" style={{ display:"flex", alignItems:"center", gap:4 }}>
          {[["Fonctionnalités","#features"],["Tarifs","#pricing"],["Témoignages","#testimonials"]].map(([l,h])=>(
            <a key={l} href={h} style={{ padding:"7px 14px", borderRadius:8, textDecoration:"none",
              color:text2, fontWeight:500, fontSize:14 }}>{l}</a>
          ))}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={()=>setIsDark(d=>!d)} style={{
            width:36, height:36, borderRadius:9, border:`1px solid ${border}`,
            background:"transparent", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            {isDark ? <Ic.Sun s={16}/> : <Ic.Moon s={16}/>}
          </button>
          <Link href="/login" style={{ padding:"8px 16px", borderRadius:9, textDecoration:"none",
            color:text2, fontWeight:500, fontSize:14 }}>Se connecter</Link>
          <FluidBtn href="/register" size="sm">Essai gratuit</FluidBtn>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight:"100dvh", paddingTop:100,
        display:"flex", alignItems:"center",
        padding:"100px clamp(20px,6vw,80px) 80px",
        background: isDark
          ? "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(37,99,235,0.12) 0%, transparent 70%)"
          : "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(37,99,235,0.06) 0%, transparent 70%)",
        position:"relative", overflow:"hidden",
      }}>
        {/* Dot grid */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:`radial-gradient(${isDark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)"} 1px,transparent 1px)`,
          backgroundSize:"28px 28px" }}/>

        <div style={{ maxWidth:1200, margin:"0 auto", width:"100%",
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:"clamp(40px,6vw,80px)", alignItems:"center" }}
          className="hero-grid">

          {/* LEFT — Text */}
          <div>
            {/* Badge */}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,ease:E}}
              style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:28,
                background: isDark ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.07)",
                border:`1px solid ${isDark?"rgba(59,130,246,0.3)":"rgba(37,99,235,0.2)"}`,
                borderRadius:100, padding:"6px 18px 6px 8px" }}>
              <span style={{ background:"#2563EB", borderRadius:100, padding:"3px 10px",
                fontSize:11, fontWeight:800, color:"#fff", letterSpacing:"0.3px" }}>NOUVEAU</span>
              <span style={{ color: isDark?"#93C5FD":"#1D4ED8", fontWeight:600, fontSize:13 }}>
                14 jours d&apos;essai gratuit — sans CB
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1 initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:E,delay:0.06}}
              style={{ fontFamily:FONT_TITLE, fontSize:"clamp(38px,5.5vw,72px)",
                fontWeight:400, lineHeight:1.06, letterSpacing:"-0.02em",
                margin:"0 0 24px", color:text }}>
              La roue qui <G>transforme</G>
              <br/>vos clients en <G>avis</G>
            </motion.h1>

            <motion.p initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.65,ease:E,delay:0.12}}
              style={{ fontSize:"clamp(15px,1.6vw,18px)", lineHeight:1.75, color:text2,
                margin:"0 0 36px", maxWidth:480 }}>
              Gamifiez l&apos;expérience client. Chaque avis Google déclenche un tour de roue —
              vos clients jouent, vos avis explosent.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,ease:E,delay:0.18}}
              style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:40 }}>
              <FluidBtn href="/register" variant="primary" size="lg">
                Commencer gratuitement <Ic.Arrow/>
              </FluidBtn>
              <FluidBtn href="/login" variant="ghost" size="lg">
                Voir la démo
              </FluidBtn>
            </motion.div>

            {/* Trust row */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.6,delay:0.28}}
              style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ display:"flex", gap:-6 }}>
                  {["#3B82F6","#8B5CF6","#10B981","#F59E0B","#EF4444"].map((c,i)=>(
                    <div key={i} style={{ width:28, height:28, borderRadius:"50%", border:`2px solid ${isDark?"#090912":"#FAFAFA"}`,
                      background:`linear-gradient(135deg,${c},${c}bb)`,
                      marginLeft: i>0 ? -8 : 0, zIndex:5-i,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:10, fontWeight:800, color:"#fff" }}>
                      {["M","K","Y","S","T"][i]}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize:13, color:text2, fontWeight:600 }}>500+ clients actifs</span>
              </div>
              <div style={{ width:1, height:18, background:border }}/>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                {[...Array(5)].map((_,i)=><Ic.Star key={i} s={13}/>)}
                <span style={{ fontSize:13, color:text2, fontWeight:600 }}>4.9 / 5</span>
              </div>
              <div style={{ width:1, height:18, background:border }}/>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <Ic.Google s={16}/>
                <span style={{ fontSize:13, color:text2, fontWeight:600 }}>Google Reviews</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — 3D Wheel */}
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
            <HeroWheel3D/>
          </div>
        </div>
      </section>

      {/* ── BRAND SLIDER STRIP ── */}
      <div style={{ borderTop:`1px solid ${border}`, borderBottom:`1px solid ${border}`,
        background:bg2, padding:"28px 0", overflow:"hidden", position:"relative" }}>
        {/* fade edges */}
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:120, zIndex:2, pointerEvents:"none",
          background:`linear-gradient(to right,${bg2},transparent)` }}/>
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:120, zIndex:2, pointerEvents:"none",
          background:`linear-gradient(to left,${bg2},transparent)` }}/>

        <motion.div
          animate={{ x:["0%","-50%"] }}
          transition={{ duration:28, repeat:Infinity, ease:"linear" }}
          style={{ display:"flex", alignItems:"center", gap:56, width:"max-content" }}
        >
          {[...SLIDER_IMGS,...SLIDER_IMGS].map((src,i) => (
            <img
              key={i}
              src={src}
              alt={`partenaire ${(i%10)+1}`}
              style={{
                height:48,
                width:"auto",
                maxWidth:160,
                objectFit:"contain",
                flexShrink:0,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* ── STATS ── */}
      <section style={{ background:bg, padding:"clamp(64px,8vw,100px) clamp(20px,6vw,80px)" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1,
            borderRadius:24, overflow:"hidden",
            border:`1px solid ${border}`,
            boxShadow: isDark ? "0 4px 32px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.06)" }}
            className="stats-grid">
            {STATS.map((s,i) => (
              <motion.div key={s.label} {...iv(i*0.08)}
                style={{ padding:"clamp(28px,4vw,44px) clamp(20px,3vw,36px)",
                  background:card, textAlign:"center",
                  borderRight: i<3 ? `1px solid ${border}` : "none",
                  position:"relative", overflow:"hidden" }}>
                {/* Glow accent */}
                <div style={{ position:"absolute", top:-40, left:"50%", transform:"translateX(-50%)",
                  width:120, height:120, borderRadius:"50%",
                  background:`radial-gradient(circle,${s.color}22,transparent 70%)`,
                  pointerEvents:"none" }}/>
                <div style={{ fontFamily:FONT_TITLE, fontSize:"clamp(32px,4vw,52px)",
                  fontWeight:400, color:s.color, lineHeight:1, marginBottom:8, letterSpacing:"-0.02em" }}>
                  {s.float
                    ? <span>{s.n}{s.suffix}</span>
                    : <Counter to={s.n} suffix={s.suffix}/>
                  }
                </div>
                <div style={{ fontSize:13, color:text3, fontWeight:500 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="features" style={{ padding:"clamp(80px,10vw,130px) clamp(20px,6vw,80px)", background:bg2 }}>
        <div style={{ maxWidth:1060, margin:"0 auto" }}>
          <motion.div {...iv()} style={{ textAlign:"center", marginBottom:"clamp(48px,6vw,72px)" }}>
            <div style={{ fontSize:11, color:"#2563EB", fontWeight:800, letterSpacing:"2.5px",
              textTransform:"uppercase", marginBottom:14 }}>COMMENT ÇA MARCHE</div>
            <h2 style={{ fontFamily:FONT_TITLE, fontSize:"clamp(28px,4.5vw,56px)", fontWeight:400,
              margin:"0 0 16px", letterSpacing:"-0.02em", lineHeight:1.08, color:text }}>
              Opérationnel en <G>3 étapes</G>
            </h2>
            <p style={{ color:text2, fontSize:16, maxWidth:400, margin:"0 auto", lineHeight:1.7 }}>
              Pas de développeur. Pas de carte bancaire. Juste vos premiers avis.
            </p>
          </motion.div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }} className="steps-grid">
            {STEPS.map((s,i) => (
              <motion.div key={s.n} {...iv(i*0.1)}>
                <TiltCard style={{ height:"100%" }}>
                  <div style={{ background:card, border:`1px solid ${border}`, borderRadius:20,
                    padding:"36px 32px", height:"100%", position:"relative", overflow:"hidden",
                    boxShadow: isDark?"0 4px 24px rgba(0,0,0,0.3)":"0 4px 16px rgba(0,0,0,0.05)" }}>
                    {/* Accent top bar */}
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
                      background:`linear-gradient(90deg,${s.ac},${s.ac}88)`, borderRadius:"20px 20px 0 0" }}/>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:48, fontWeight:400,
                      color:`${s.ac}20`, lineHeight:1, marginBottom:20, letterSpacing:"-3px" }}>{s.n}</div>
                    <div style={{ width:46, height:46, borderRadius:13, background:`${s.ac}14`,
                      border:`1px solid ${s.ac}22`, display:"flex", alignItems:"center",
                      justifyContent:"center", marginBottom:18 }}>
                      <s.icon s={22} c={s.ac}/>
                    </div>
                    <h3 style={{ fontSize:19, fontWeight:800, margin:"0 0 10px",
                      color:text, letterSpacing:"-0.3px" }}>{s.title}</h3>
                    <p style={{ fontSize:14, color:text2, lineHeight:1.75, margin:0 }}>{s.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ── */}
      <section style={{ padding:"clamp(80px,10vw,130px) clamp(20px,6vw,80px)", background:bg }}>
        <div style={{ maxWidth:1080, margin:"0 auto" }}>
          <motion.div {...iv()} style={{ textAlign:"center", marginBottom:"clamp(40px,5vw,64px)" }}>
            <div style={{ fontSize:11, color:"#8B5CF6", fontWeight:800, letterSpacing:"2.5px",
              textTransform:"uppercase", marginBottom:14 }}>FONCTIONNALITÉS</div>
            <h2 style={{ fontFamily:FONT_TITLE, fontSize:"clamp(28px,4.5vw,56px)", fontWeight:400,
              margin:0, letterSpacing:"-0.02em", lineHeight:1.08, color:text }}>
              Tout en un, <G>rien à configurer</G>
            </h2>
          </motion.div>

          <div className="bento-grid">
            {FEATURES.map((f,i) => (
              <TiltCard key={f.title} className={i===0?"bento-big":""}>
                <motion.div {...iv(i*0.07)}
                  style={{ background: i===0 ? (isDark?"#111827":"#0F172A") : card,
                    border:`1px solid ${i===0?"rgba(255,255,255,0.08)":border}`,
                    borderRadius:20, padding:f.big?"44px 48px":"32px",
                    height:"100%", position:"relative", overflow:"hidden",
                    boxShadow: isDark?"0 4px 24px rgba(0,0,0,0.3)":"0 2px 16px rgba(0,0,0,0.05)",
                    cursor:"default" }}>
                  <div style={{ position:"absolute", top:-60, right:-60, width:180, height:180,
                    borderRadius:"50%", background:`radial-gradient(circle,${f.ac}${i===0?"22":"12"},transparent 70%)`,
                    pointerEvents:"none" }}/>
                  <div style={{ width:f.big?52:44, height:f.big?52:44, borderRadius:f.big?16:13,
                    background:`${f.ac}18`, border:`1px solid ${f.ac}28`,
                    display:"flex", alignItems:"center", justifyContent:"center", marginBottom:f.big?22:16 }}>
                    <f.icon s={f.big?26:20} c={f.ac}/>
                  </div>
                  <h3 style={{ fontSize:f.big?21:16, fontWeight:800, margin:"0 0 10px",
                    letterSpacing:"-0.3px", color:i===0?"#F5F5F7":text }}>{f.title}</h3>
                  <p style={{ fontSize:f.big?15:13, color:i===0?"#6E6E73":text2, lineHeight:1.75, margin:0 }}>{f.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ padding:"clamp(80px,10vw,120px) 0", background:bg2, overflow:"hidden" }}>
        <motion.div {...iv()} style={{ textAlign:"center", marginBottom:"clamp(36px,5vw,56px)", padding:"0 24px" }}>
          {/* Trustpilot badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:20,
            background:card, border:`1px solid ${border}`, borderRadius:12,
            padding:"10px 20px", boxShadow: isDark?"0 2px 16px rgba(0,0,0,0.3)":"0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ background:"#00B67A", borderRadius:6, width:28, height:28,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.1L12 17.2l-6.2 3.8 2.4-7.1L2 9.4h7.6L12 2z" fill="white"/></svg>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:800, color:"#00B67A", letterSpacing:0.5 }}>Trustpilot</div>
              <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                {[...Array(5)].map((_,i)=>(
                  <svg key={i} width="11" height="11" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.1L12 17.2l-6.2 3.8 2.4-7.1L2 9.4h7.6L12 2z" fill="#00B67A"/></svg>
                ))}
                <span style={{ fontSize:11, color:text2, marginLeft:2, fontWeight:600 }}>4.9</span>
              </div>
            </div>
            <div style={{ width:1, height:28, background:border, margin:"0 4px" }}/>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <Ic.Shield s={13} c="#10B981"/>
              <span style={{ fontSize:12, color:text2, fontWeight:600 }}>Avis vérifiés</span>
            </div>
          </div>

          <h2 style={{ fontFamily:FONT_TITLE, fontSize:"clamp(26px,4.5vw,52px)", fontWeight:400,
            margin:"0 0 12px", letterSpacing:"-0.02em", lineHeight:1.08, color:text }}>
            500+ établissements <G>nous font confiance</G>
          </h2>
          <p style={{ color:text2, fontSize:15, fontWeight:500 }}>
            4.9 / 5 de note moyenne · Avis vérifiés Google
          </p>
        </motion.div>

        {/* Scrolling row */}
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute",left:0,top:0,bottom:0,width:120,zIndex:2,pointerEvents:"none",
            background:`linear-gradient(to right,${isDark?"#0F0F1A":bg2},transparent)` }}/>
          <div style={{ position:"absolute",right:0,top:0,bottom:0,width:120,zIndex:2,pointerEvents:"none",
            background:`linear-gradient(to left,${isDark?"#0F0F1A":bg2},transparent)` }}/>

          <motion.div animate={{x:["0%","-50%"]}} transition={{duration:44,repeat:Infinity,ease:"linear"}}
            style={{ display:"flex", gap:16, width:"max-content", padding:"12px 24px" }}>
            {[...TESTIMONIALS,...TESTIMONIALS].map((t2,i) => (
              <motion.div key={i} whileHover={{y:-5}} transition={{type:"spring",stiffness:300,damping:22}}
                style={{ width:300, flexShrink:0, background:card, border:`1px solid ${border}`,
                  borderRadius:20, padding:"24px", cursor:"default",
                  boxShadow: isDark?"0 4px 24px rgba(0,0,0,0.3)":"0 2px 16px rgba(0,0,0,0.06)" }}>
                {/* Stars */}
                <div style={{ display:"flex", gap:2, marginBottom:14 }}>
                  {[...Array(5)].map((_,j)=><Ic.Star key={j} s={13}/>)}
                </div>
                <p style={{ fontSize:14, color:text2, lineHeight:1.8, margin:"0 0 20px",
                  fontStyle:"italic" }}>&ldquo;{t2.q}&rdquo;</p>
                <div style={{ display:"flex", alignItems:"center", gap:10,
                  paddingTop:16, borderTop:`1px solid ${border}` }}>
                  {/* Avatar with initials */}
                  <div style={{ width:38, height:38, borderRadius:"50%", flexShrink:0,
                    background:`linear-gradient(135deg,${t2.color},${t2.color}88)`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:800, color:"#fff", fontSize:13, letterSpacing:"0.5px",
                    boxShadow:`0 4px 12px ${t2.color}44` }}>
                    {t2.avatar}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:text }}>{t2.name}</div>
                    <div style={{ fontSize:11, color:text3 }}>{t2.role}</div>
                  </div>
                  <Ic.Google s={16}/>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trust badges row */}
        <motion.div {...iv(0.1)} style={{ display:"flex", justifyContent:"center", gap:16, flexWrap:"wrap",
          marginTop:40, padding:"0 24px" }}>
          {[
            { icon:Ic.Shield, label:"RGPD Conforme", sub:"Données hébergées en France" },
            { icon:Ic.Lock,   label:"SSL / HTTPS",   sub:"Connexion 100% sécurisée" },
            { icon:Ic.Check,  label:"Sans engagement",sub:"Résiliez à tout moment" },
            { icon:Ic.Zap,    label:"99.9% uptime",   sub:"Infrastructure Vercel / Atlas" },
          ].map((b,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10,
              padding:"12px 20px", borderRadius:14, border:`1px solid ${border}`,
              background:card,
              boxShadow: isDark?"0 2px 12px rgba(0,0,0,0.2)":"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ width:34, height:34, borderRadius:10, background:`rgba(16,185,129,0.1)`,
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <b.icon s={16} c="#10B981"/>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:text }}>{b.label}</div>
                <div style={{ fontSize:11, color:text3 }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding:"clamp(80px,10vw,130px) clamp(20px,6vw,80px)", background:bg }}>
        <div style={{ maxWidth:1020, margin:"0 auto" }}>
          <motion.div {...iv()} style={{ textAlign:"center", marginBottom:"clamp(48px,6vw,72px)" }}>
            <div style={{ fontSize:11, color:"#F59E0B", fontWeight:800, letterSpacing:"2.5px",
              textTransform:"uppercase", marginBottom:14 }}>TARIFS</div>
            <h2 style={{ fontFamily:FONT_TITLE, fontSize:"clamp(28px,4.5vw,56px)", fontWeight:400,
              margin:"0 0 14px", letterSpacing:"-0.02em", lineHeight:1.08, color:text }}>
              Simple. <G>Transparent.</G> Sans surprise.
            </h2>
            <p style={{ color:text2, fontSize:16, maxWidth:360, margin:"0 auto" }}>
              14 jours gratuits sur tous les plans. Sans carte bancaire.
            </p>
          </motion.div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, alignItems:"start" }}
            className="pricing-grid">
            {PLANS.map((plan,i) => (
              <TiltCard key={plan.id}>
                <motion.div {...iv(i*0.1)}
                  style={{ borderRadius:22, padding:"36px 32px", position:"relative",
                    display:"flex", flexDirection:"column",
                    ...(plan.highlight ? {
                      background: isDark ? "#111827" : "#0F172A",
                      border:"1px solid rgba(37,99,235,0.35)",
                      boxShadow:"0 0 0 1px rgba(37,99,235,0.1),0 24px 56px rgba(37,99,235,0.2)",
                    }:{
                      background:card,
                      border:`1px solid ${border}`,
                      boxShadow: isDark?"0 4px 20px rgba(0,0,0,0.25)":"0 2px 12px rgba(0,0,0,0.05)",
                    }) }}>

                  {plan.highlight && (
                    <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)",
                      background:"linear-gradient(135deg,#2563EB,#06B6D4)", color:"#fff",
                      fontWeight:800, fontSize:11, padding:"4px 20px", borderRadius:100,
                      whiteSpace:"nowrap", letterSpacing:"0.5px",
                      boxShadow:"0 4px 14px rgba(37,99,235,0.45)" }}>
                      LE PLUS POPULAIRE
                    </div>
                  )}

                  <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase",
                    letterSpacing:"1.5px", color:plan.highlight?"#60A5FA":text3, marginBottom:16 }}>
                    {plan.name}
                  </div>

                  <div style={{ display:"flex", alignItems:"baseline", gap:2, marginBottom:4 }}>
                    <span style={{ fontFamily:FONT_TITLE, fontSize:52, fontWeight:400,
                      letterSpacing:"-0.02em", lineHeight:1, color:plan.highlight?"#F5F5F7":text }}>
                      {plan.price}
                    </span>
                    <span style={{ fontSize:18, color:plan.highlight?"#6E6E73":text2, marginLeft:2 }}>€</span>
                    <span style={{ fontSize:13, color:plan.highlight?"#6E6E73":text3, marginLeft:2 }}>/mois</span>
                  </div>
                  <p style={{ color:plan.highlight?"#6E6E73":text3, fontSize:13, margin:"0 0 24px", lineHeight:1.5 }}>
                    {plan.desc}
                  </p>

                  <div style={{ height:1, background:plan.highlight?"rgba(255,255,255,0.07)":border, marginBottom:22 }}/>

                  <ul style={{ listStyle:"none", padding:0, margin:"0 0 28px",
                    display:"flex", flexDirection:"column", gap:12, flex:1 }}>
                    {plan.features.map(feat => (
                      <li key={feat} style={{ display:"flex", alignItems:"center", gap:10,
                        fontSize:14, color:plan.highlight?"#A1A1A6":text2 }}>
                        <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0,
                          background:plan.highlight?"rgba(37,99,235,0.15)":"rgba(16,185,129,0.1)",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <Ic.Check s={11} c={plan.highlight?"#60A5FA":"#10B981"}/>
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <FluidBtn href={plan.href} variant={plan.highlight?"primary":"ghost"}
                    style={{ justifyContent:"center", borderRadius:100 }}>
                    {plan.cta}
                  </FluidBtn>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: isDark?"#0B0B14":"#0F172A",
        padding:"clamp(100px,12vw,160px) clamp(20px,6vw,80px)",
        position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          background:"radial-gradient(ellipse 70% 50% at 50% 50%,rgba(37,99,235,0.14),transparent)" }}/>
        <div style={{ position:"absolute", inset:0,
          backgroundImage:"radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize:"28px 28px", pointerEvents:"none" }}/>

        <div style={{ textAlign:"center", position:"relative", zIndex:1, maxWidth:680, margin:"0 auto" }}>
          <motion.div {...iv(0)} style={{ display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(37,99,235,0.12)", border:"1px solid rgba(37,99,235,0.22)",
            borderRadius:100, padding:"6px 18px", marginBottom:28 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#3B82F6",
              boxShadow:"0 0 8px #3B82F6", animation:"pulse-dot 1.4s infinite" }}/>
            <span style={{ color:"#93C5FD", fontWeight:700, fontSize:12, letterSpacing:"0.5px" }}>
              500+ ÉTABLISSEMENTS ACTIFS
            </span>
          </motion.div>

          <motion.h2 {...iv(0.06)} style={{ fontFamily:FONT_TITLE,
            fontSize:"clamp(32px,5.5vw,72px)", fontWeight:400,
            margin:"0 0 20px", lineHeight:1.06, letterSpacing:"-0.02em", color:"#F5F5F7" }}>
            Prêt à transformer vos clients en <G>ambassadeurs ?</G>
          </motion.h2>

          <motion.p {...iv(0.12)} style={{ color:"#6E6E73", fontSize:17, marginBottom:44, lineHeight:1.75 }}>
            Rejoignez 500+ établissements. Aucune carte bancaire requise.<br/>
            <strong style={{ color:"#A1A1A6" }}>Résultats visibles dès la première semaine.</strong>
          </motion.p>

          <motion.div {...iv(0.18)} style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <FluidBtn href="/register" size="lg">
              Commencer gratuitement <Ic.Arrow/>
            </FluidBtn>
            <FluidBtn href="/login" variant="ghost" size="lg"
              style={{ color:"#A1A1A6", borderColor:"rgba(255,255,255,0.15)" }}>
              Voir la démo
            </FluidBtn>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: isDark?"#060609":"#0F172A",
        borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto",
          padding:"clamp(28px,4vw,44px) clamp(20px,6vw,80px)",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          flexWrap:"wrap", gap:16 }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height:30, objectFit:"contain" }}/>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {[["Connexion","/login"],["Créer un compte","/register"],["Dashboard","/dashboard"]].map(([label,href])=>(
              <Link key={label} href={href} style={{ color:"#52525B", textDecoration:"none",
                fontSize:13, fontWeight:500, padding:"6px 12px", borderRadius:8 }}>{label}</Link>
            ))}
          </div>
          <div style={{ fontSize:12, color:"#374151" }}>© 2026 VisiumBoost — Tous droits réservés</div>
        </div>
      </footer>

      <style>{`
        * { box-sizing:border-box; }
        body { transition:background-color 0.4s ease,color 0.4s ease; }
        .hero-grid    { grid-template-columns:1fr 1fr; }
        .bento-grid   { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        .bento-big    { grid-column:1/3; }
        .steps-grid   { grid-template-columns:repeat(3,1fr); }
        .pricing-grid { grid-template-columns:repeat(3,1fr); }
        .stats-grid   { grid-template-columns:repeat(4,1fr); }
        .nav-links    { display:flex; }
        @media(max-width:1024px){
          .hero-grid    { grid-template-columns:1fr !important; }
          .split-grid   { grid-template-columns:1fr !important; }
        }
        @media(max-width:860px){
          .steps-grid   { grid-template-columns:1fr !important; }
          .pricing-grid { grid-template-columns:1fr !important; }
          .stats-grid   { grid-template-columns:repeat(2,1fr) !important; }
          .nav-links    { display:none !important; }
        }
        @media(max-width:600px){
          .bento-grid   { grid-template-columns:1fr !important; }
          .bento-big    { grid-column:1 !important; }
          .stats-grid   { grid-template-columns:repeat(2,1fr) !important; }
        }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.6)} }
      `}</style>
    </div>
  );
}
