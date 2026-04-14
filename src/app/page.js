"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion, useScroll, useTransform, useMotionValue, useSpring,
} from "framer-motion";

// ─── Easing ───────────────────────────────────────────────────────────
const E = [0.22, 1, 0.36, 1];
const inViewProp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, ease: E, delay },
});

// ─── SVG Icons ────────────────────────────────────────────────────────
const Ic = {
  Zap: ({ s=22, c="#3B82F6" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={c}/>
    </svg>
  ),
  Phone: ({ s=22, c="#8B5CF6" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.5"/>
    </svg>
  ),
  TrendUp: ({ s=22, c="#06B6D4" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  Target: ({ s=22, c="#3B82F6" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill={c}/>
    </svg>
  ),
  Shield: ({ s=22, c="#8B5CF6" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10" stroke={c} strokeWidth="2"/>
    </svg>
  ),
  BarChart: ({ s=22, c="#06B6D4" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Link: ({ s=22, c="#F59E0B" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  QrCode: ({ s=22, c="#10B981" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
      <line x1="17" y1="17" x2="20" y2="17"/><line x1="20" y1="14" x2="20" y2="17"/>
    </svg>
  ),
  Buildings: ({ s=22, c="#EF4444" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="13" height="13"/><path d="M8 9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/>
      <rect x="16" y="13" width="5" height="9"/><line x1="8" y1="13" x2="8" y2="13"/>
      <line x1="12" y1="13" x2="12" y2="13"/><line x1="8" y1="17" x2="8" y2="17"/><line x1="12" y1="17" x2="12" y2="17"/>
    </svg>
  ),
  Star: ({ s=16, c="#F59E0B" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  Google: ({ s=20 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  Trustpilot: ({ s=20 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#00B67A"/>
      <path d="M12 3l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 17.5l-6.2 4.5 2.4-7.3L2 9.2h7.6L12 3z" fill="white"/>
    </svg>
  ),
  MapPin: ({ s=16, c="#64748B" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Check: ({ s=16, c="#10B981" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

// ─── Wheel ────────────────────────────────────────────────────────────
const SEG = [
  ["#3B82F6","Café"],["#8B5CF6","−20%"],["#06B6D4","Dessert"],
  ["#F59E0B","−10%"],["#10B981","Boisson"],["#EF4444","−30%"],
  ["#6366F1","Menu"],["#F97316","Pizza"],
];
function WheelMockup() {
  const n = SEG.length;
  const conic = SEG.map(([c],i)=>`${c} ${(i/n)*100}% ${((i+1)/n)*100}%`).join(",");
  return (
    <motion.div animate={{ y:[0,-18,0] }} transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}
      style={{ position:"relative", width:300, height:300, filter:"drop-shadow(0 40px 80px rgba(59,130,246,0.45))" }}>
      <motion.div animate={{ rotate:360 }} transition={{ duration:28, repeat:Infinity, ease:"linear" }}
        style={{ width:"100%", height:"100%", borderRadius:"50%", background:`conic-gradient(${conic})`, position:"relative",
          boxShadow:"0 0 0 8px rgba(255,255,255,0.08), inset 0 0 40px rgba(0,0,0,0.35)" }}>
        {SEG.map((_,i)=>(
          <div key={i} style={{ position:"absolute", top:"50%", left:"50%", width:"50%", height:2,
            background:"rgba(255,255,255,0.25)", transformOrigin:"0 50%", transform:`rotate(${(i/n)*360}deg)` }}/>
        ))}
        <div style={{ position:"absolute", top:"50%", left:"50%", width:32, height:32, borderRadius:"50%",
          background:"linear-gradient(135deg,#fff,#e2e8f0)", transform:"translate(-50%,-50%)",
          boxShadow:"0 4px 16px rgba(0,0,0,0.4)", zIndex:2 }}/>
      </motion.div>
      <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", width:0, height:0,
        borderLeft:"11px solid transparent", borderRight:"11px solid transparent", borderTop:"26px solid #F59E0B",
        filter:"drop-shadow(0 2px 6px rgba(245,158,11,0.7))", zIndex:5 }}/>
    </motion.div>
  );
}

// ─── Float card ───────────────────────────────────────────────────────
function FloatCard({ delay=0, children, style }) {
  return (
    <motion.div initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5, delay, ease:E }}>
      <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:3+delay*0.4, repeat:Infinity, ease:"easeInOut", delay:delay*0.3 }}
        style={{ position:"absolute", background:"rgba(10,10,30,0.85)", backdropFilter:"blur(24px)",
          border:"1px solid rgba(255,255,255,0.13)", borderRadius:18, padding:"14px 20px",
          boxShadow:"0 12px 40px rgba(0,0,0,0.4)", zIndex:10, ...style }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

// ─── 3D Tilt ──────────────────────────────────────────────────────────
function TiltCard({ children, style, className }) {
  const ref = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rx = useSpring(useTransform(y,[-120,120],[8,-8]),{stiffness:300,damping:28});
  const ry = useSpring(useTransform(x,[-120,120],[-8,8]),{stiffness:300,damping:28});
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(e.clientX - r.left - r.width/2); y.set(e.clientY - r.top - r.height/2);
  };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={()=>{x.set(0);y.set(0);}}
      style={{ rotateX:rx, rotateY:ry, transformStyle:"preserve-3d", ...style }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Orb ──────────────────────────────────────────────────────────────
function Orb({ style }) {
  return <div style={{ position:"absolute", borderRadius:"50%", filter:"blur(90px)", pointerEvents:"none", animation:"orbPulse 7s ease-in-out infinite", ...style }}/>;
}

// ─── 3D Side decoration ────────────────────────────────────────────────
function SideDecor({ side="left", children, scrollY, inputRange, outputRange, rotate=12, style }) {
  const y   = useTransform(scrollY, inputRange, outputRange);
  const rot = useTransform(scrollY, inputRange, [rotate, -rotate]);
  return (
    <motion.div style={{ position:"absolute", [side]: side==="left"?-20:-20, y, rotateY: side==="left"? rot : useTransform(rot, v=>-v),
      transformStyle:"preserve-3d", perspective:800, zIndex:0, ...style }} className="side-decor">
      <div style={{ background:"rgba(255,255,255,0.025)", backdropFilter:"blur(16px)",
        border:"1px solid rgba(255,255,255,0.08)", borderRadius:20,
        boxShadow:"0 20px 60px rgba(0,0,0,0.4)", padding:"18px 22px" }}>
        {children}
      </div>
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────
const STEPS = [
  { icon: Ic.Zap,      accent:"rgba(59,130,246,0.18)",  n:"01", title:"Créez en 5 min",     desc:"Configurez votre roue, couleurs et récompenses. Aucune compétence technique requise." },
  { icon: Ic.Phone,    accent:"rgba(139,92,246,0.18)",  n:"02", title:"Affichez le QR code", desc:"Imprimez le QR code généré automatiquement. Caisse, table, vitrine — n'importe où." },
  { icon: Ic.TrendUp,  accent:"rgba(6,182,212,0.18)",   n:"03", title:"Récoltez les avis",   desc:"Vos clients jouent après avoir laissé un avis Google. Les avis arrivent en continu." },
];

const FEATURES = [
  { Icon:Ic.Target,   accent:"#3B82F6", title:"Roue 100% personnalisable", desc:"Couleurs, récompenses, logo, probabilités. Votre marque, votre expérience. Chaque détail configurable en quelques secondes depuis votre dashboard.", big:true },
  { Icon:Ic.Shield,   accent:"#8B5CF6", title:"Anti-fraude intégré",       desc:"Codes uniques à usage unique. Seuls les vrais clients qui ont posté un avis peuvent jouer." },
  { Icon:Ic.BarChart, accent:"#06B6D4", title:"Analytics temps réel",      desc:"Scans, conversions et ROI visibles en un coup d'œil." },
  { Icon:Ic.Link,     accent:"#F59E0B", title:"URL personnalisée",         desc:"votre-resto.visium-boost.fr — prête à l'emploi, sans config." },
  { Icon:Ic.QrCode,   accent:"#10B981", title:"QR Code intégré",           desc:"Générez et téléchargez un QR code imprimable en un clic." },
  { Icon:Ic.Buildings,accent:"#EF4444", title:"Multi-établissements",      desc:"Un seul dashboard pour gérer tous vos sites." },
];

const TESTIMONIALS = [
  { q:"En 3 semaines, j'ai doublé mes avis Google. Mes clients adorent tourner la roue après leur repas.", name:"Marie D.",    role:"Restauratrice, Lyon" },
  { q:"La mise en place a pris 10 minutes. 15 nouveaux avis chaque semaine sans rien faire.",             name:"Karim B.",    role:"Gérant café, Paris" },
  { q:"Mes clients reviennent plus souvent depuis la roue. C'est un vrai boost pour la fidélité.",       name:"Sophie M.",   role:"Salon de coiffure, Bordeaux" },
  { q:"ROI incroyable : 200 avis en 2 mois pour 29€/mois. Je ne peux plus m'en passer.",                 name:"Thomas R.",   role:"Pizzeria, Marseille" },
  { q:"Interface simple, résultats impressionnants. Je le recommande à tous mes collègues.",              name:"Isabelle V.", role:"Brasserie, Nantes" },
  { q:"Notre note Google est passée de 3.8 à 4.7 en 6 semaines. Absolument magique.",                    name:"Youssef A.",  role:"Food truck, Toulouse" },
];
const T_COLORS = ["#3B82F6","#8B5CF6","#06B6D4","#F59E0B","#10B981","#EF4444"];

const PLANS = [
  { id:"free",    name:"Gratuit",  price:"0",  desc:"Pour tester",              features:["1 établissement","50 scans/mois","Analytics basiques","Support email"],                                             cta:"Commencer gratuitement", href:"/register" },
  { id:"starter", name:"Starter", price:"29", desc:"Pour les indépendants",    features:["3 établissements","500 scans/mois","Analytics avancés","URL personnalisée","Support prioritaire"],               cta:"Essai 14 jours gratuit",  href:"/register", highlight:true },
  { id:"pro",     name:"Pro",     price:"79", desc:"Pour les chaînes & agences",features:["Établissements illimités","Scans illimités","API access","White label","Account manager dédié"],                 cta:"Nous contacter",          href:"/register" },
];

// ─── Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { scrollY } = useScroll();
  const navBg     = useTransform(scrollY,[0,80],["rgba(5,5,16,0)","rgba(5,5,16,0.95)"]);
  const navBorder = useTransform(scrollY,[0,80],["rgba(255,255,255,0)","rgba(255,255,255,0.08)"]);

  // Parallax ranges for side decorations
  const sd1y = useTransform(scrollY,[400,1400],[60,-120]);
  const sd2y = useTransform(scrollY,[400,1400],[-40,140]);
  const sd3y = useTransform(scrollY,[1200,2400],[60,-120]);
  const sd4y = useTransform(scrollY,[1200,2400],[-60,100]);
  const sd5y = useTransform(scrollY,[2400,3800],[80,-160]);
  const sd6y = useTransform(scrollY,[2400,3800],[-40,120]);

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background:"#050510", color:"#F8FAFC", overflowX:"hidden" }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <motion.nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 clamp(20px,5vw,64px)", height:68,
        background:navBg, backdropFilter:"blur(20px)",
        borderBottom:"1px solid", borderColor:navBorder }}>
        <Link href="/" style={{ textDecoration:"none" }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height:42, objectFit:"contain" }}/>
        </Link>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Link href="/login" style={{ padding:"9px 20px", borderRadius:10, textDecoration:"none", color:"#64748B", fontWeight:600, fontSize:14 }}>
            Connexion
          </Link>
          <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
            <Link href="/register" style={{ display:"block", padding:"10px 22px", borderRadius:10, textDecoration:"none",
              background:"linear-gradient(135deg,#3B82F6,#06B6D4)", color:"#fff", fontWeight:700, fontSize:14,
              boxShadow:"0 4px 20px rgba(59,130,246,0.4)" }}>
              Commencer gratuitement
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ minHeight:"100dvh", display:"flex", alignItems:"center",
        padding:"120px clamp(20px,6vw,80px) 80px", position:"relative", overflow:"hidden" }}>
        <Orb style={{ width:700, height:700, top:"-15%", left:"-8%",  background:"radial-gradient(circle,rgba(59,130,246,0.14),transparent 70%)" }}/>
        <Orb style={{ width:500, height:500, bottom:"-5%", right:"8%", background:"radial-gradient(circle,rgba(139,92,246,0.12),transparent 70%)" }}/>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:"radial-gradient(rgba(255,255,255,0.055) 1px,transparent 1px)", backgroundSize:"32px 32px" }}/>

        <div style={{ maxWidth:1200, margin:"0 auto", width:"100%",
          display:"flex", alignItems:"center", justifyContent:"space-between", gap:60, flexWrap:"wrap" }}>

          {/* Left text */}
          <div style={{ flex:"1 1 420px", maxWidth:620 }}>
            <motion.div {...inViewProp(0)} style={{ marginBottom:28 }}>
              <span style={{ display:"inline-flex", alignItems:"center", gap:8,
                background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.3)",
                borderRadius:100, padding:"6px 16px", color:"#93C5FD", fontWeight:600, fontSize:13 }}>
                <motion.span animate={{ scale:[1,1.4,1] }} transition={{ duration:1.4, repeat:Infinity }}
                  style={{ width:8, height:8, borderRadius:"50%", background:"#3B82F6", display:"inline-block" }}/>
                500+ établissements actifs
              </span>
            </motion.div>

            <motion.h1 {...inViewProp(0.08)} style={{ fontSize:"clamp(40px,5.5vw,74px)", fontWeight:900,
              lineHeight:1.1, margin:"0 0 24px", letterSpacing:"-2px", color:"#F8FAFC" }}>
              Transformez chaque<br/>client en{" "}
              <span style={{ background:"linear-gradient(135deg,#60A5FA 0%,#06B6D4 50%,#8B5CF6 100%)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                ambassadeur<br/>Google
              </span>
            </motion.h1>

            <motion.p {...inViewProp(0.16)} style={{ color:"#64748B", fontSize:18, lineHeight:1.8, margin:"0 0 40px", maxWidth:500 }}>
              La roue de la fortune gamifiée qui booste vos avis Google{" "}
              <strong style={{ color:"#94A3B8" }}>automatiquement</strong>.
              Configurez en 5 minutes, récoltez des avis à vie.
            </motion.p>

            <motion.div {...inViewProp(0.24)} style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:52 }}>
              <motion.div whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.97 }}>
                <Link href="/register" style={{ display:"block", padding:"16px 34px", borderRadius:14, textDecoration:"none",
                  background:"linear-gradient(135deg,#3B82F6,#06B6D4)", color:"#fff", fontWeight:700, fontSize:16,
                  boxShadow:"0 8px 32px rgba(59,130,246,0.5)" }}>
                  Commencer gratuitement →
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.97 }}>
                <Link href="/login" style={{ display:"block", padding:"16px 34px", borderRadius:14, textDecoration:"none",
                  background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)",
                  color:"#94A3B8", fontWeight:600, fontSize:16 }}>
                  Se connecter
                </Link>
              </motion.div>
            </motion.div>

            <motion.div {...inViewProp(0.3)} style={{ display:"flex", gap:36, flexWrap:"wrap",
              paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
              {[["500+","Établissements"],["4.9★","Note moyenne"],["98%","Satisfaction"],["<5min","Setup"]].map(([v,l])=>(
                <div key={l}>
                  <div style={{ fontSize:26, fontWeight:800, color:"#F8FAFC", letterSpacing:"-0.5px" }}>{v}</div>
                  <div style={{ fontSize:12, color:"#475569", marginTop:2, fontWeight:500 }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — wheel + cards */}
          <motion.div initial={{ opacity:0, scale:0.75 }} animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.9, ease:E, delay:0.3 }}
            style={{ flex:"1 1 300px", display:"flex", justifyContent:"center", alignItems:"center", position:"relative", minHeight:400 }}>
            <WheelMockup/>
            <FloatCard delay={0.6} style={{ top:"2%", left:"-8%", minWidth:160 }}>
              <div style={{ fontSize:10, color:"#475569", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Dernier avis</div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#3B82F6,#06B6D4)",
                  display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#fff", fontSize:13, flexShrink:0 }}>M</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#F8FAFC" }}>Marie D.</div>
                  <div style={{ display:"flex", gap:1 }}>{[...Array(5)].map((_,i)=><Ic.Star key={i} s={12}/>)}</div>
                </div>
              </div>
            </FloatCard>
            <FloatCard delay={0.9} style={{ bottom:"8%", left:"-14%", minWidth:140 }}>
              <div style={{ fontSize:10, color:"#475569", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Ce mois-ci</div>
              <div style={{ fontSize:30, fontWeight:900, color:"#10B981", letterSpacing:"-1px" }}>+47</div>
              <div style={{ fontSize:11, color:"#64748B" }}>avis Google</div>
            </FloatCard>
            <FloatCard delay={1.2} style={{ bottom:"18%", right:"-6%", minWidth:150 }}>
              <div style={{ fontSize:10, color:"#475569", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Cadeau gagné</div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:10, background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Ic.Star s={18}/>
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:"#F8FAFC" }}>−20%</div>
                  <div style={{ fontSize:11, color:"#64748B" }}>prochaine visite</div>
                </div>
              </div>
            </FloatCard>
          </motion.div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────── */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)",
        overflow:"hidden", padding:"18px 0", background:"rgba(255,255,255,0.015)" }}>
        <motion.div animate={{ x:["0%","-50%"] }} transition={{ duration:28, repeat:Infinity, ease:"linear" }}
          style={{ display:"flex", width:"max-content" }}>
          {[...Array(2)].flatMap((_,r)=>
            ["Restaurants","Cafés","Salons de coiffure","Brasseries","Restaurants japonais","Traiteurs","Boutiques","Fitness","Pâtisseries","Hôtels"].map(item=>(
              <span key={`${r}-${item}`} style={{ fontSize:13, fontWeight:600, color:"#334155", padding:"0 32px", borderRight:"1px solid rgba(255,255,255,0.05)" }}>
                {item}
              </span>
            ))
          )}
        </motion.div>
      </div>

      {/* ── TRUST BAR ────────────────────────────────────────── */}
      <section style={{ padding:"64px clamp(20px,6vw,80px)", background:"#080814" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <motion.div {...inViewProp()} style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ color:"#475569", fontSize:13, fontWeight:600, letterSpacing:1 }}>
              Reconnu et approuvé par les professionnels
            </div>
          </motion.div>
          <motion.div {...inViewProp(0.1)} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"clamp(24px,5vw,72px)", flexWrap:"wrap" }}>

            {/* Google Reviews */}
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Ic.Google s={24}/>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#94A3B8" }}>Google Reviews</div>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  {[...Array(5)].map((_,i)=><Ic.Star key={i} s={13}/>)}
                  <span style={{ fontSize:12, color:"#64748B", marginLeft:2, fontWeight:600 }}>4.9/5</span>
                </div>
              </div>
            </div>

            <div style={{ width:1, height:40, background:"rgba(255,255,255,0.07)" }}/>

            {/* Trustpilot */}
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Ic.Trustpilot s={26}/>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#94A3B8" }}>Trustpilot</div>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  {[...Array(5)].map((_,i)=><Ic.Star key={i} s={13} c="#00B67A"/>)}
                  <span style={{ fontSize:12, color:"#64748B", marginLeft:2, fontWeight:600 }}>Excellent</span>
                </div>
              </div>
            </div>

            <div style={{ width:1, height:40, background:"rgba(255,255,255,0.07)" }}/>

            {/* Stat */}
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:900, color:"#F8FAFC", letterSpacing:"-1px" }}>500+</div>
              <div style={{ fontSize:12, color:"#475569", fontWeight:600 }}>Établissements actifs</div>
            </div>

            <div style={{ width:1, height:40, background:"rgba(255,255,255,0.07)" }}/>

            {/* Certified */}
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Ic.Shield s={22} c="#10B981"/>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#94A3B8" }}>Données sécurisées</div>
                <div style={{ fontSize:12, color:"#64748B" }}>RGPD · SSL · Anti-fraude</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section style={{ padding:"100px clamp(20px,6vw,80px)", background:"#050510", position:"relative", overflow:"hidden" }}>
        {/* 3D left decoration */}
        <motion.div style={{ position:"absolute", left:-30, top:"15%", y:sd1y, rotateY:20,
          transformStyle:"preserve-3d", perspective:800 }} className="side-decor">
          <div style={{ background:"rgba(59,130,246,0.06)", backdropFilter:"blur(16px)",
            border:"1px solid rgba(59,130,246,0.15)", borderRadius:20, padding:"20px 24px", width:180 }}>
            <div style={{ fontSize:11, color:"#475569", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Avis en direct</div>
            {[["S","Sophie M."],["K","Karim B."]].map(([init,name])=>(
              <div key={name} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#3B82F6,#8B5CF6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:"#fff" }}>{init}</div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:"#94A3B8" }}>{name}</div>
                  <div style={{ display:"flex", gap:1 }}>{[...Array(5)].map((_,i)=><Ic.Star key={i} s={9}/>)}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3D right decoration */}
        <motion.div style={{ position:"absolute", right:-30, top:"40%", y:sd2y, rotateY:-20,
          transformStyle:"preserve-3d", perspective:800 }} className="side-decor">
          <div style={{ background:"rgba(139,92,246,0.06)", backdropFilter:"blur(16px)",
            border:"1px solid rgba(139,92,246,0.15)", borderRadius:20, padding:"20px 24px", width:160 }}>
            <div style={{ fontSize:11, color:"#475569", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Setup rapide</div>
            <div style={{ fontSize:36, fontWeight:900, color:"#8B5CF6", letterSpacing:"-2px" }}>5min</div>
            <div style={{ fontSize:12, color:"#64748B" }}>configuration</div>
          </div>
        </motion.div>

        <div style={{ maxWidth:1000, margin:"0 auto", position:"relative", zIndex:1 }}>
          <motion.div {...inViewProp()} style={{ textAlign:"center", marginBottom:72 }}>
            <div style={{ color:"#3B82F6", fontWeight:700, fontSize:11, letterSpacing:2.5, textTransform:"uppercase", marginBottom:14 }}>Comment ça marche</div>
            <h2 style={{ fontSize:"clamp(28px,4vw,50px)", fontWeight:900, margin:"0 0 16px", letterSpacing:"-1.5px" }}>Simple comme bonjour</h2>
            <p style={{ color:"#64748B", fontSize:16, maxWidth:440, margin:"0 auto", lineHeight:1.75 }}>
              De la configuration à vos premiers avis en moins de 10 minutes.
            </p>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:20 }}>
            {STEPS.map((s,i)=>(
              <motion.div key={s.n} {...inViewProp(i*0.15)} whileHover={{ y:-8, scale:1.02 }}
                transition={{ type:"spring", stiffness:280, damping:22 }}
                style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)",
                  borderRadius:24, padding:"38px 32px", position:"relative", overflow:"hidden", cursor:"default" }}>
                <div style={{ position:"absolute", top:-50, right:-50, width:160, height:160, borderRadius:"50%",
                  background:`radial-gradient(circle,${s.accent},transparent 70%)` }}/>
                <div style={{ fontSize:60, fontWeight:900, color:"rgba(255,255,255,0.04)", lineHeight:1, marginBottom:20, letterSpacing:"-3px" }}>{s.n}</div>
                <div style={{ marginBottom:14 }}><s.icon s={28}/></div>
                <h3 style={{ fontSize:19, fontWeight:800, margin:"0 0 12px", color:"#F8FAFC" }}>{s.title}</h3>
                <p style={{ fontSize:14, color:"#64748B", lineHeight:1.8, margin:0 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ───────────────────────────────────── */}
      <section style={{ padding:"100px clamp(20px,6vw,80px)", background:"#080814", position:"relative", overflow:"hidden" }}>
        {/* 3D left */}
        <motion.div style={{ position:"absolute", left:-30, top:"30%", y:sd3y, rotateY:18,
          transformStyle:"preserve-3d", perspective:800 }} className="side-decor">
          <div style={{ background:"rgba(6,182,212,0.06)", backdropFilter:"blur(16px)",
            border:"1px solid rgba(6,182,212,0.15)", borderRadius:20, padding:"20px 24px", width:170 }}>
            <div style={{ fontSize:11, color:"#475569", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Conversions</div>
            <div style={{ display:"flex", gap:4, alignItems:"flex-end", marginBottom:6 }}>
              {[40,60,45,75,55,90,70].map((h,i)=>(
                <div key={i} style={{ width:12, background:`rgba(6,182,212,${0.3+h/150})`, borderRadius:3, height:h*0.5 }}/>
              ))}
            </div>
            <div style={{ fontSize:22, fontWeight:800, color:"#06B6D4" }}>+234%</div>
            <div style={{ fontSize:11, color:"#64748B" }}>vs mois dernier</div>
          </div>
        </motion.div>

        {/* 3D right */}
        <motion.div style={{ position:"absolute", right:-30, top:"20%", y:sd4y, rotateY:-18,
          transformStyle:"preserve-3d", perspective:800 }} className="side-decor">
          <div style={{ background:"rgba(245,158,11,0.06)", backdropFilter:"blur(16px)",
            border:"1px solid rgba(245,158,11,0.15)", borderRadius:20, padding:"20px 24px", width:160 }}>
            <div style={{ fontSize:11, color:"#475569", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>URL active</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#F59E0B", fontFamily:"monospace", wordBreak:"break-all" }}>
              cafe-martin.<br/>visium-boost.fr
            </div>
          </div>
        </motion.div>

        <div style={{ maxWidth:1080, margin:"0 auto", position:"relative", zIndex:1 }}>
          <motion.div {...inViewProp()} style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ color:"#8B5CF6", fontWeight:700, fontSize:11, letterSpacing:2.5, textTransform:"uppercase", marginBottom:14 }}>Fonctionnalités</div>
            <h2 style={{ fontSize:"clamp(28px,4vw,50px)", fontWeight:900, margin:"0 0 16px", letterSpacing:"-1.5px" }}>Tout ce dont vous avez besoin</h2>
            <p style={{ color:"#64748B", fontSize:16, maxWidth:440, margin:"0 auto" }}>Un outil complet, pensé pour les commerçants.</p>
          </motion.div>
          <div className="bento-grid">
            {FEATURES.map((f,i)=>(
              <TiltCard key={f.title} className={i===0?"bento-big":""}>
                <motion.div {...inViewProp(i*0.07)} whileHover={{ borderColor:`${f.accent}45` }}
                  style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)",
                    borderRadius:22, padding:f.big?"40px 44px":"28px 28px", height:"100%",
                    position:"relative", overflow:"hidden", transition:"border-color 0.3s" }}>
                  <div style={{ position:"absolute", top:-70, right:-70, width:220, height:220, borderRadius:"50%",
                    background:`radial-gradient(circle,${f.accent}18,transparent 70%)` }}/>
                  <div style={{ width:f.big?52:44, height:f.big?52:44, borderRadius:f.big?16:12,
                    background:`${f.accent}18`, border:`1px solid ${f.accent}35`,
                    display:"flex", alignItems:"center", justifyContent:"center", marginBottom:f.big?22:16 }}>
                    <f.Icon s={f.big?26:21} c={f.accent}/>
                  </div>
                  <h3 style={{ fontSize:f.big?22:16, fontWeight:800, margin:"0 0 10px", color:"#F8FAFC" }}>{f.title}</h3>
                  <p style={{ fontSize:f.big?15:13, color:"#64748B", lineHeight:1.75, margin:0 }}>{f.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section style={{ padding:"100px 0", background:"#050510", overflow:"hidden" }}>
        <motion.div {...inViewProp()} style={{ textAlign:"center", marginBottom:64, padding:"0 24px" }}>
          <div style={{ color:"#06B6D4", fontWeight:700, fontSize:11, letterSpacing:2.5, textTransform:"uppercase", marginBottom:14 }}>Témoignages</div>
          <h2 style={{ fontSize:"clamp(28px,4vw,50px)", fontWeight:900, margin:"0 0 20px", letterSpacing:"-1.5px" }}>Ils nous font confiance</h2>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
            {[...Array(5)].map((_,i)=><Ic.Star key={i} s={20}/>)}
            <span style={{ color:"#64748B", fontSize:14, fontWeight:600, marginLeft:4 }}>4.9 / 5 · 500+ établissements</span>
          </div>
        </motion.div>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:140, background:"linear-gradient(to right,#050510,transparent)", zIndex:2, pointerEvents:"none" }}/>
          <div style={{ position:"absolute", right:0, top:0, bottom:0, width:140, background:"linear-gradient(to left,#050510,transparent)", zIndex:2, pointerEvents:"none" }}/>
          <motion.div animate={{ x:["0%","-50%"] }} transition={{ duration:36, repeat:Infinity, ease:"linear" }}
            style={{ display:"flex", gap:20, width:"max-content", padding:"8px 20px" }}>
            {[...TESTIMONIALS,...TESTIMONIALS].map((t,i)=>(
              <motion.div key={i} whileHover={{ scale:1.03, y:-4 }} transition={{ type:"spring", stiffness:300, damping:22 }}
                style={{ width:320, flexShrink:0, background:"rgba(255,255,255,0.03)",
                  border:"1px solid rgba(255,255,255,0.07)", borderRadius:22, padding:"28px 30px", cursor:"default" }}>
                <div style={{ display:"flex", gap:2, marginBottom:16 }}>{[...Array(5)].map((_,j)=><Ic.Star key={j} s={15}/>)}</div>
                <p style={{ fontSize:14, color:"#CBD5E1", lineHeight:1.8, margin:"0 0 22px", fontStyle:"italic" }}>
                  &ldquo;{t.q}&rdquo;
                </p>
                <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                  <div style={{ width:38, height:38, borderRadius:"50%",
                    background:`linear-gradient(135deg,${T_COLORS[i%6]},${T_COLORS[(i+2)%6]})`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:900, color:"#fff", fontSize:14, flexShrink:0 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13, color:"#F8FAFC" }}>{t.name}</div>
                    <div style={{ fontSize:12, color:"#475569", display:"flex", alignItems:"center", gap:4 }}>
                      <Ic.MapPin s={12}/>{t.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section style={{ padding:"100px clamp(20px,6vw,80px)", background:"#080814", position:"relative", overflow:"hidden" }}>
        {/* 3D left */}
        <motion.div style={{ position:"absolute", left:-30, top:"25%", y:sd5y, rotateY:16,
          transformStyle:"preserve-3d", perspective:800 }} className="side-decor">
          <div style={{ background:"rgba(16,185,129,0.06)", backdropFilter:"blur(16px)",
            border:"1px solid rgba(16,185,129,0.15)", borderRadius:20, padding:"20px 24px", width:168 }}>
            <div style={{ fontSize:11, color:"#475569", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Revenu généré</div>
            <div style={{ fontSize:32, fontWeight:900, color:"#10B981", letterSpacing:"-1.5px" }}>+2 400€</div>
            <div style={{ fontSize:11, color:"#64748B" }}>grâce aux nouveaux clients</div>
          </div>
        </motion.div>

        {/* 3D right */}
        <motion.div style={{ position:"absolute", right:-30, top:"55%", y:sd6y, rotateY:-16,
          transformStyle:"preserve-3d", perspective:800 }} className="side-decor">
          <div style={{ background:"rgba(59,130,246,0.06)", backdropFilter:"blur(16px)",
            border:"1px solid rgba(59,130,246,0.15)", borderRadius:20, padding:"20px 24px", width:160 }}>
            <div style={{ fontSize:11, color:"#475569", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Note Google</div>
            <div style={{ display:"flex", gap:2, marginBottom:4 }}>{[...Array(5)].map((_,i)=><Ic.Star key={i} s={16}/>)}</div>
            <div style={{ fontSize:26, fontWeight:900, color:"#F8FAFC" }}>4.9</div>
            <div style={{ fontSize:11, color:"#64748B" }}>↑ depuis 3.7</div>
          </div>
        </motion.div>

        <div style={{ maxWidth:1020, margin:"0 auto", position:"relative", zIndex:1 }}>
          <motion.div {...inViewProp()} style={{ textAlign:"center", marginBottom:72 }}>
            <div style={{ color:"#F59E0B", fontWeight:700, fontSize:11, letterSpacing:2.5, textTransform:"uppercase", marginBottom:14 }}>Tarifs</div>
            <h2 style={{ fontSize:"clamp(28px,4vw,50px)", fontWeight:900, margin:"0 0 16px", letterSpacing:"-1.5px" }}>Simple et transparent</h2>
            <p style={{ color:"#64748B", fontSize:16, maxWidth:380, margin:"0 auto" }}>Sans engagement. Annulez quand vous voulez.</p>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20, alignItems:"center" }}>
            {PLANS.map((plan,i)=>(
              <TiltCard key={plan.id}>
                <motion.div {...inViewProp(i*0.1)} whileHover={{ y:-10 }} transition={{ type:"spring", stiffness:280, damping:22 }}
                  style={{ borderRadius:26, padding:"40px 34px", position:"relative", overflow:"hidden",
                    ...(plan.highlight?{
                      background:"linear-gradient(145deg,#0F172A,#1a1440)",
                      border:"1px solid rgba(59,130,246,0.5)",
                      boxShadow:"0 0 0 1px rgba(59,130,246,0.15),0 32px 80px rgba(59,130,246,0.2)",
                    }:{
                      background:"rgba(255,255,255,0.025)",
                      border:"1px solid rgba(255,255,255,0.07)",
                    }) }}>
                  {plan.highlight && (
                    <>
                      <div style={{ position:"absolute", top:-80, left:"50%", transform:"translateX(-50%)", width:240, height:160, background:"radial-gradient(ellipse,rgba(59,130,246,0.28),transparent 70%)" }}/>
                      <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)",
                        background:"linear-gradient(135deg,#3B82F6,#06B6D4)", color:"#fff", fontWeight:700, fontSize:11,
                        padding:"4px 22px", borderRadius:100, whiteSpace:"nowrap", letterSpacing:0.5 }}>
                        ⚡ Le plus populaire
                      </div>
                    </>
                  )}
                  <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1.2, color:plan.highlight?"#60A5FA":"#475569", marginBottom:10 }}>{plan.name}</div>
                  <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:5 }}>
                    <span style={{ fontSize:56, fontWeight:900, color:"#F8FAFC", letterSpacing:"-2px", lineHeight:1 }}>{plan.price}€</span>
                    <span style={{ color:"#475569", fontSize:15 }}>/mois</span>
                  </div>
                  <p style={{ color:"#475569", fontSize:13, margin:"0 0 28px" }}>{plan.desc}</p>
                  <ul style={{ listStyle:"none", padding:0, margin:"0 0 34px", display:"flex", flexDirection:"column", gap:11 }}>
                    {plan.features.map(feat=>(
                      <li key={feat} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:plan.highlight?"#CBD5E1":"#64748B" }}>
                        <Ic.Check s={16} c={plan.highlight?"#3B82F6":"#10B981"}/>{feat}
                      </li>
                    ))}
                  </ul>
                  <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
                    <Link href={plan.href} style={{ display:"block", textAlign:"center", padding:"15px", borderRadius:14,
                      textDecoration:"none", fontWeight:700, fontSize:14,
                      ...(plan.highlight?{
                        background:"linear-gradient(135deg,#3B82F6,#06B6D4)", color:"#fff",
                        boxShadow:"0 8px 28px rgba(59,130,246,0.45)",
                      }:{
                        background:"transparent", color:"#3B82F6", border:"1.5px solid rgba(59,130,246,0.4)",
                      }) }}>
                      {plan.cta}
                    </Link>
                  </motion.div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section style={{ padding:"130px clamp(20px,6vw,80px)", position:"relative", overflow:"hidden", background:"#050510" }}>
        <Orb style={{ width:700, height:700, top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"radial-gradient(circle,rgba(59,130,246,0.14),transparent 70%)" }}/>
        <Orb style={{ width:400, height:400, top:"10%", right:"5%", background:"radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%)" }}/>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.045) 1px,transparent 1px)", backgroundSize:"24px 24px", pointerEvents:"none" }}/>
        <div style={{ textAlign:"center", position:"relative", zIndex:1, maxWidth:720, margin:"0 auto" }}>
          <motion.div {...inViewProp()} style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:"uppercase", color:"#3B82F6", marginBottom:20 }}>
            Rejoindre la communauté
          </motion.div>
          <motion.h2 {...inViewProp(0.1)} style={{ fontSize:"clamp(32px,5vw,64px)", fontWeight:900,
            margin:"0 0 22px", lineHeight:1.12, letterSpacing:"-2px", color:"#F8FAFC" }}>
            Prêt à booster vos{" "}
            <span style={{ background:"linear-gradient(135deg,#60A5FA,#06B6D4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              avis Google
            </span>{" "}?
          </motion.h2>
          <motion.p {...inViewProp(0.18)} style={{ color:"#64748B", fontSize:17, marginBottom:44, lineHeight:1.8 }}>
            Rejoignez 500+ établissements qui récoltent des avis chaque jour.<br/>
            <strong style={{ color:"#94A3B8" }}>Aucune carte bancaire requise.</strong>
          </motion.p>
          <motion.div {...inViewProp(0.26)}>
            <motion.div whileHover={{ scale:1.06, y:-4 }} whileTap={{ scale:0.97 }} style={{ display:"inline-block" }}>
              <Link href="/register" style={{ display:"inline-block", padding:"20px 48px", borderRadius:18,
                background:"linear-gradient(135deg,#3B82F6,#06B6D4)", color:"#fff", textDecoration:"none",
                fontWeight:800, fontSize:17, boxShadow:"0 16px 48px rgba(59,130,246,0.55)", letterSpacing:"-0.3px" }}>
                Commencer gratuitement — Aucune CB
              </Link>
            </motion.div>
          </motion.div>
          {/* Mini trust indicators */}
          <motion.div {...inViewProp(0.34)} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:24, marginTop:36, flexWrap:"wrap" }}>
            {[
              [Ic.Shield,"Données RGPD"],
              [Ic.Check,"Sans engagement"],
              [Ic.Star,"4.9/5 Google"],
            ].map(([Icon,label],i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <Icon s={14} c="#475569"/><span style={{ fontSize:13, color:"#475569", fontWeight:600 }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background:"#020208", padding:"44px clamp(20px,6vw,80px)", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth:1080, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20 }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height:36, objectFit:"contain" }}/>
          <div style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
            {[["Connexion","/login"],["Créer un compte","/register"],["Dashboard","/dashboard"]].map(([label,href])=>(
              <Link key={label} href={href} style={{ color:"#334155", textDecoration:"none", fontSize:14, fontWeight:500 }}>{label}</Link>
            ))}
          </div>
          <div style={{ fontSize:13, color:"#1E293B" }}>© 2026 VisiumBoost · Tous droits réservés</div>
        </div>
      </footer>

      <style>{`
        @keyframes orbPulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.75;transform:scale(1.15)} }
        .bento-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .bento-big  { grid-column:1/3; }
        .side-decor { display:none; }
        @media(min-width:1280px) { .side-decor { display:block; } }
        @media(max-width:900px) {
          .bento-grid { grid-template-columns:repeat(2,1fr); }
          .bento-big  { grid-column:1/-1; }
        }
        @media(max-width:560px) {
          .bento-grid { grid-template-columns:1fr; }
          .bento-big  { grid-column:1; }
        }
      `}</style>
    </div>
  );
}
