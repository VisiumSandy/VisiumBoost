"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

const E = [0.22, 1, 0.36, 1];

// ─── Theme ───────────────────────────────────────────────────────────
const T = {
  light: {
    bg:"#FFFFFF", bg2:"#F8F9FC", bg3:"#F1F5F9",
    text:"#09090B", text2:"#71717A", text3:"#A1A1AA",
    border:"#E4E4E7", border2:"#F4F4F5",
    card:"#FFFFFF", cardBg:"rgba(0,0,0,0.02)",
    navBg:"rgba(255,255,255,0.88)",
    accent:"#2563EB", accentHex:"37,99,235",
    badge:"#EFF6FF", badgeBorder:"rgba(37,99,235,0.25)", badgeText:"#1D4ED8",
    shadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 24px rgba(0,0,0,0.05)",
    shadowLg:"0 20px 60px rgba(0,0,0,0.1)",
    step:"#F8F9FC",
    footerBg:"#09090B", footerText:"#A1A1AA",
    ctaBg:"#09090B",
  },
  dark: {
    bg:"#09090B", bg2:"#111113", bg3:"#18181B",
    text:"#FAFAFA", text2:"#A1A1AA", text3:"#71717A",
    border:"rgba(255,255,255,0.08)", border2:"rgba(255,255,255,0.04)",
    card:"rgba(255,255,255,0.03)", cardBg:"rgba(255,255,255,0.025)",
    navBg:"rgba(9,9,11,0.88)",
    accent:"#3B82F6", accentHex:"59,130,246",
    badge:"rgba(59,130,246,0.1)", badgeBorder:"rgba(59,130,246,0.3)", badgeText:"#93C5FD",
    shadow:"0 1px 3px rgba(0,0,0,0.2),0 8px 24px rgba(0,0,0,0.3)",
    shadowLg:"0 20px 60px rgba(0,0,0,0.5)",
    step:"rgba(255,255,255,0.025)",
    footerBg:"#050507", footerText:"#52525B",
    ctaBg:"#050507",
  },
};

// ─── Icons ────────────────────────────────────────────────────────────
const Ic = {
  Sun: ({s=20,c="#71717A"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: ({s=20,c="#71717A"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={c} fillOpacity="0.2"/></svg>,
  Target: ({s=22,c}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill={c}/></svg>,
  Shield: ({s=22,c}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  BarChart: ({s=22,c}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  Link2: ({s=22,c}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  QrCode: ({s=22,c}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><line x1="17" y1="17" x2="20" y2="17"/><line x1="20" y1="14" x2="20" y2="17"/></svg>,
  Buildings: ({s=22,c}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="9" width="13" height="13"/><path d="M8 9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/><rect x="16" y="13" width="5" height="9"/></svg>,
  Zap: ({s=22,c}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  Phone: ({s=22,c}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>,
  TrendUp: ({s=22,c}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Star: ({s=14,c="#F59E0B"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Check: ({s=15,c="#10B981"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Google: ({s=20}) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
  Trustpilot: ({s=20}) => <svg width={s} height={s} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#00B67A"/><path d="M12 3l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 17.5l-6.2 4.5 2.4-7.3L2 9.2h7.6L12 3z" fill="white"/></svg>,
  MapPin: ({s=12,c}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
};

// ─── Wheel segments ───────────────────────────────────────────────────
const SEG = [["#3B82F6","Café"],["#8B5CF6","−20%"],["#06B6D4","Dessert"],["#F59E0B","−10%"],["#10B981","Boisson"],["#EF4444","−30%"],["#6366F1","Menu"],["#F97316","Pizza"]];
const CONIC = SEG.map(([c],i,a)=>`${c} ${(i/a.length)*100}% ${((i+1)/a.length)*100}%`).join(",");

// ─── 3D Phone Mockup ──────────────────────────────────────────────────
function Phone3D({ isDark }) {
  const ph = isDark ? "#1E293B" : "#0F172A";
  const phB = isDark ? "#334155" : "#1a2744";
  return (
    <motion.div
      animate={{ rotateX:[6,10,6], rotateY:[-18,-12,-18] }}
      transition={{ duration:7, repeat:Infinity, ease:"easeInOut" }}
      style={{ transformStyle:"preserve-3d", perspective:1000,
        filter:"drop-shadow(0 60px 40px rgba(37,99,235,0.25)) drop-shadow(0 10px 20px rgba(0,0,0,0.35))" }}
    >
      <div style={{ width:210, height:440, borderRadius:46, background:`linear-gradient(145deg,${ph},${phB})`,
        border:`2px solid ${isDark?"#334155":"#1E3A5F"}`, position:"relative", overflow:"hidden",
        boxShadow:`inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.4), 18px 0 36px rgba(0,0,0,0.25)` }}>
        {/* Left edge highlight */}
        <div style={{ position:"absolute", left:0, top:0, width:2, height:"100%",
          background:"linear-gradient(to bottom,rgba(255,255,255,0.18),rgba(255,255,255,0.06),transparent)" }}/>
        {/* Dynamic island */}
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
          width:76, height:26, background:ph, borderRadius:"0 0 14px 14px", zIndex:20 }}/>
        {/* Screen */}
        <div style={{ position:"absolute", top:26, left:4, right:4, bottom:4, borderRadius:42,
          background:"#fff", overflow:"hidden", display:"flex", flexDirection:"column" }}>
          {/* App header */}
          <div style={{ background:"#1E3A8A", padding:"14px 14px 10px", textAlign:"center" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)", fontWeight:600, marginBottom:2 }}>Café Martin</div>
            <div style={{ fontSize:12, color:"#fff", fontWeight:800 }}>Laissez un avis</div>
          </div>
          {/* Mini wheel */}
          <div style={{ display:"flex", justifyContent:"center", padding:"14px 0 8px", flex:1 }}>
            <div style={{ position:"relative" }}>
              <motion.div animate={{ rotate:360 }} transition={{ duration:22, repeat:Infinity, ease:"linear" }}
                style={{ width:110, height:110, borderRadius:"50%", background:`conic-gradient(${CONIC})`,
                  boxShadow:"0 4px 20px rgba(0,0,0,0.18)", position:"relative" }}>
                {SEG.map((_,i)=>(
                  <div key={i} style={{ position:"absolute", top:"50%", left:"50%", width:"50%", height:1.5,
                    background:"rgba(255,255,255,0.3)", transformOrigin:"0 50%", transform:`rotate(${(i/SEG.length)*360}deg)` }}/>
                ))}
                <div style={{ position:"absolute", top:"50%", left:"50%", width:16, height:16, borderRadius:"50%",
                  background:"#fff", transform:"translate(-50%,-50%)", boxShadow:"0 2px 8px rgba(0,0,0,0.25)" }}/>
              </motion.div>
              {/* Arrow */}
              <div style={{ position:"absolute", top:-8, left:"50%", transform:"translateX(-50%)",
                width:0, height:0, borderLeft:"7px solid transparent", borderRight:"7px solid transparent",
                borderTop:"16px solid #F59E0B", filter:"drop-shadow(0 1px 3px rgba(245,158,11,0.6))", zIndex:5 }}/>
            </div>
          </div>
          {/* CTA */}
          <div style={{ margin:"0 12px 8px", padding:"9px 10px", borderRadius:9, background:"#2563EB", textAlign:"center" }}>
            <div style={{ fontSize:10, color:"#fff", fontWeight:700 }}>Laisser un avis Google</div>
          </div>
          {/* Code */}
          <div style={{ margin:"0 12px 12px", padding:"7px 10px", borderRadius:8, background:"#F8FAFC",
            border:"1px solid #E2E8F0", textAlign:"center" }}>
            <div style={{ fontSize:9, color:"#94A3B8", marginBottom:2, fontWeight:600 }}>Votre code</div>
            <div style={{ fontSize:13, fontWeight:900, color:"#0F172A", fontFamily:"monospace", letterSpacing:2 }}>WIN-A7K3</div>
          </div>
        </div>
        {/* Home indicator */}
        <div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)",
          width:56, height:3, borderRadius:2, background:"rgba(255,255,255,0.25)" }}/>
      </div>
    </motion.div>
  );
}

// ─── 3D QR Card ───────────────────────────────────────────────────────
function QRCard3D({ t }) {
  const rows = [
    [1,1,1,0,0,0,1,1,1],[1,0,1,0,1,0,1,0,1],[1,0,1,1,0,0,1,0,1],
    [0,0,0,1,0,1,0,0,0],[1,0,1,1,0,1,1,0,0],[0,1,0,1,1,0,0,1,0],
    [1,1,1,0,1,0,1,1,1],[1,0,1,0,0,0,1,0,1],[1,1,1,1,0,1,1,0,0],
  ];
  return (
    <motion.div animate={{ rotateX:[8,14,8], rotateY:[20,14,20] }}
      transition={{ duration:6, repeat:Infinity, ease:"easeInOut" }}
      style={{ transformStyle:"preserve-3d", perspective:600,
        filter:`drop-shadow(0 30px 30px ${t.bg==="#FFFFFF"?"rgba(0,0,0,0.15)":"rgba(0,0,0,0.5)"})` }}>
      <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:20,
        padding:"20px 22px", boxShadow:t.shadow }}>
        <div style={{ fontSize:10, color:t.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Scannez &amp; jouez</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(9,10px)", gap:2, marginBottom:14 }}>
          {rows.flat().map((v,i)=>(
            <div key={i} style={{ width:10, height:10, borderRadius:1.5,
              background:v ? (t.bg==="#FFFFFF"?"#0F172A":"#F8FAFC") : "transparent" }}/>
          ))}
        </div>
        <div style={{ fontSize:10, color:t.text2, fontWeight:600, textAlign:"center" }}>cafe-martin.visium-boost.fr</div>
      </div>
    </motion.div>
  );
}

// ─── 3D Review Stack ──────────────────────────────────────────────────
function ReviewStack3D({ t }) {
  const reviews = [
    { name:"Sophie M.", text:"Excellent ! La roue c'est génial.", c:"#3B82F6" },
    { name:"Karim B.", text:"15 avis en une semaine, incroyable.", c:"#8B5CF6" },
    { name:"Marie D.", text:"Mes clients adorent jouer.", c:"#10B981" },
  ];
  return (
    <div style={{ position:"relative", width:220, height:160 }}>
      {reviews.map((r,i)=>(
        <motion.div key={i}
          animate={{ y:[0,-5,0] }}
          transition={{ duration:3+i*0.5, repeat:Infinity, ease:"easeInOut", delay:i*0.6 }}
          style={{ position:"absolute", left: i*16, top: i*20, width:190, transformStyle:"preserve-3d",
            filter:`drop-shadow(0 ${10+i*4}px ${20+i*8}px ${t.bg==="#FFFFFF"?"rgba(0,0,0,0.1)":"rgba(0,0,0,0.4)"})` }}>
          <motion.div animate={{ rotateX: i===0?[3,6,3]:i===1?[5,8,5]:[2,5,2], rotateY: i===0?[-8,-5,-8]:i===1?[4,8,4]:[-6,-3,-6] }}
            transition={{ duration:4+i, repeat:Infinity, ease:"easeInOut" }}
            style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:16,
              padding:"12px 14px", boxShadow:t.shadow }}>
            <div style={{ display:"flex", gap:4, marginBottom:6 }}>
              {[...Array(5)].map((_,j)=><Ic.Star key={j} s={11}/>)}
            </div>
            <div style={{ fontSize:11, color:t.text2, lineHeight:1.5, marginBottom:8 }}>&ldquo;{r.text}&rdquo;</div>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:`linear-gradient(135deg,${r.c},${r.c}99)`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:"#fff" }}>
                {r.name[0]}
              </div>
              <div style={{ fontSize:10, fontWeight:700, color:t.text }}>{r.name}</div>
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:3 }}>
                <Ic.Google s={12}/>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── 3D Analytics Card ────────────────────────────────────────────────
function AnalyticsCard3D({ t }) {
  const bars = [28,45,35,62,50,80,68];
  return (
    <motion.div animate={{ rotateX:[-6,-10,-6], rotateY:[-16,-10,-16] }}
      transition={{ duration:7, repeat:Infinity, ease:"easeInOut" }}
      style={{ transformStyle:"preserve-3d", perspective:700,
        filter:`drop-shadow(0 30px 30px ${t.bg==="#FFFFFF"?"rgba(0,0,0,0.12)":"rgba(0,0,0,0.5)"})` }}>
      <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:20,
        padding:"20px 22px", width:200, boxShadow:t.shadow }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:10, color:t.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Avis ce mois</div>
          <div style={{ fontSize:14, fontWeight:900, color:"#10B981" }}>+234%</div>
        </div>
        <div style={{ display:"flex", gap:5, alignItems:"flex-end", height:60, marginBottom:12 }}>
          {bars.map((h,i)=>(
            <motion.div key={i}
              initial={{ height:0 }} animate={{ height:h*0.6 }}
              transition={{ delay:i*0.1, duration:0.8, ease:E }}
              style={{ flex:1, borderRadius:4, background:`rgba(${t.accentHex},${0.3+h/120})` }}/>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:22, fontWeight:900, color:t.text, letterSpacing:"-1px" }}>+47</div>
            <div style={{ fontSize:10, color:t.text3, fontWeight:600 }}>nouveaux avis</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ display:"flex", gap:2, justifyContent:"flex-end", marginBottom:2 }}>
              {[...Array(5)].map((_,i)=><Ic.Star key={i} s={11}/>)}
            </div>
            <div style={{ fontSize:10, color:t.text3, fontWeight:600 }}>note 4.9/5</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Fixed 3D Side Objects layer ─────────────────────────────────────
function SideObjects({ isDark, scrollY, t }) {
  const phoneY    = useTransform(scrollY, [0, 1200], [20, -180]);
  const phoneOp   = useTransform(scrollY, [0, 200, 900, 1200], [0, 1, 1, 0]);
  const reviewY   = useTransform(scrollY, [600, 2000], [80, -200]);
  const reviewOp  = useTransform(scrollY, [600, 900, 1700, 2000], [0, 1, 1, 0]);
  const analytY   = useTransform(scrollY, [1800, 3200], [60, -160]);
  const analytOp  = useTransform(scrollY, [1800, 2100, 3000, 3200], [0, 1, 1, 0]);
  const qrY       = useTransform(scrollY, [800, 2200], [60, -160]);
  const qrOp      = useTransform(scrollY, [800, 1100, 2000, 2200], [0, 1, 1, 0]);

  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:50, overflow:"hidden" }} className="side-layer">
      {/* Phone – right */}
      <motion.div style={{ position:"absolute", right:24, top:"12%", y:phoneY, opacity:phoneOp }} className="side-obj">
        <Phone3D isDark={isDark}/>
      </motion.div>
      {/* Review stack – left */}
      <motion.div style={{ position:"absolute", left:16, top:"36%", y:reviewY, opacity:reviewOp }} className="side-obj">
        <ReviewStack3D t={t}/>
      </motion.div>
      {/* QR – right */}
      <motion.div style={{ position:"absolute", right:24, top:"50%", y:qrY, opacity:qrOp }} className="side-obj">
        <QRCard3D t={t}/>
      </motion.div>
      {/* Analytics – left */}
      <motion.div style={{ position:"absolute", left:16, top:"68%", y:analytY, opacity:analytOp }} className="side-obj">
        <AnalyticsCard3D t={t}/>
      </motion.div>
    </div>
  );
}

// ─── TiltCard ─────────────────────────────────────────────────────────
function TiltCard({ children, style, className }) {
  const ref = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rx = useSpring(useTransform(y,[-120,120],[7,-7]),{stiffness:300,damping:28});
  const ry = useSpring(useTransform(x,[-120,120],[-7,7]),{stiffness:300,damping:28});
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

// ─── Data ─────────────────────────────────────────────────────────────
const FEATURES = [
  { Icon:Ic.Target,  ac:"#2563EB", title:"Roue 100% personnalisable", desc:"Couleurs, récompenses, logo, probabilités. Votre marque, votre expérience — configuré en quelques secondes.", big:true },
  { Icon:Ic.Shield,  ac:"#7C3AED", title:"Anti-fraude",               desc:"Codes uniques à usage unique. Seuls les vrais clients jouent." },
  { Icon:Ic.BarChart,ac:"#0891B2", title:"Analytics temps réel",      desc:"Scans, conversions, ROI en un coup d'œil." },
  { Icon:Ic.Link2,   ac:"#D97706", title:"URL personnalisée",         desc:"votre-resto.visium-boost.fr — prête à l'emploi." },
  { Icon:Ic.QrCode,  ac:"#059669", title:"QR Code intégré",           desc:"Générez et téléchargez un QR imprimable en un clic." },
  { Icon:Ic.Buildings,ac:"#DC2626",title:"Multi-établissements",      desc:"Un dashboard pour tous vos sites." },
];

const STEPS = [
  { n:"01", Icon:Ic.Zap,    ac:"#2563EB", title:"Créez en 5 min",     desc:"Configurez votre roue, couleurs et récompenses. Aucune compétence technique requise." },
  { n:"02", Icon:Ic.Phone,  ac:"#7C3AED", title:"Affichez le QR code", desc:"Imprimez le QR code généré. Posez-le en caisse ou sur vos tables." },
  { n:"03", Icon:Ic.TrendUp,ac:"#059669", title:"Récoltez les avis",   desc:"Vos clients jouent après un avis Google. Les avis arrivent en continu." },
];

const TESTIMONIALS = [
  { q:"En 3 semaines, j'ai doublé mes avis Google. Mes clients adorent tourner la roue.", name:"Marie D.", role:"Restauratrice, Lyon" },
  { q:"La mise en place a pris 10 minutes. 15 nouveaux avis chaque semaine sans rien faire.", name:"Karim B.", role:"Gérant café, Paris" },
  { q:"Mes clients reviennent plus souvent depuis la roue. C'est un vrai boost fidélité.", name:"Sophie M.", role:"Salon de coiffure, Bordeaux" },
  { q:"ROI incroyable : 200 avis en 2 mois pour 29€/mois. Je ne peux plus m'en passer.", name:"Thomas R.", role:"Pizzeria, Marseille" },
  { q:"Interface simple, résultats impressionnants. Je le recommande à tous mes collègues.", name:"Isabelle V.", role:"Brasserie, Nantes" },
  { q:"Notre note Google est passée de 3.8 à 4.7 en 6 semaines. Absolument magique.", name:"Youssef A.", role:"Food truck, Toulouse" },
];
const TC = ["#2563EB","#7C3AED","#0891B2","#D97706","#059669","#DC2626"];

const PLANS = [
  { id:"free",    name:"Gratuit", price:"0",  desc:"Pour tester",              features:["1 établissement","50 scans/mois","Analytics basiques","Support email"],                               cta:"Commencer gratuitement", href:"/register" },
  { id:"starter", name:"Starter",price:"29", desc:"Pour les indépendants",    features:["3 établissements","500 scans/mois","Analytics avancés","URL personnalisée","Support prioritaire"], cta:"Essai 14 jours gratuit",  href:"/register", highlight:true },
  { id:"pro",     name:"Pro",    price:"79", desc:"Pour les chaînes & agences",features:["Établissements illimités","Scans illimités","API access","White label","Account manager dédié"],   cta:"Nous contacter",          href:"/register" },
];

// ─── Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);
  const t = T[isDark ? "dark" : "light"];
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY,[0,60],[t.bg+"00", t.navBg]);

  const iv = (delay=0) => ({
    initial:{opacity:0, y:28},
    whileInView:{opacity:1, y:0},
    viewport:{once:true, amount:0.15},
    transition:{duration:0.65, ease:E, delay},
  });

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background:t.bg, color:t.text, minHeight:"100vh" }}>
      <SideObjects isDark={isDark} scrollY={scrollY} t={t}/>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <motion.nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 clamp(20px,5vw,64px)", height:64,
        backdropFilter:"blur(24px)",
        borderBottom:`1px solid ${t.border}`,
        background:isDark ? t.navBg : undefined,
        backgroundColor:!isDark ? t.navBg : undefined,
      }}>
        <Link href="/" style={{ textDecoration:"none" }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height:40, objectFit:"contain", filter:isDark?"none":"none" }}/>
        </Link>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={()=>setIsDark(d=>!d)}
            style={{ width:38, height:38, borderRadius:10, border:`1px solid ${t.border}`,
              background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {isDark ? <Ic.Sun s={17} c={t.text2}/> : <Ic.Moon s={17} c={t.text2}/>}
          </button>
          <Link href="/login" style={{ padding:"9px 18px", borderRadius:9, textDecoration:"none", color:t.text2, fontWeight:600, fontSize:14 }}>
            Connexion
          </Link>
          <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
            <Link href="/register" style={{ display:"block", padding:"10px 20px", borderRadius:9, textDecoration:"none",
              background:t.accent, color:"#fff", fontWeight:700, fontSize:14,
              boxShadow:`0 4px 16px rgba(${t.accentHex},0.35)` }}>
              Commencer gratuitement
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ minHeight:"100dvh", display:"flex", alignItems:"center",
        padding:"120px clamp(20px,8vw,100px) 80px", position:"relative", overflow:"hidden",
        background:t.bg }}>
        {/* Subtle gradient bg */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          background:isDark
            ? "radial-gradient(ellipse 80% 50% at 50% -10%,rgba(37,99,235,0.12),transparent)"
            : "radial-gradient(ellipse 80% 50% at 50% -10%,rgba(37,99,235,0.06),transparent)" }}/>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:`radial-gradient(${isDark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)"} 1px,transparent 1px)`,
          backgroundSize:"28px 28px" }}/>

        <div style={{ maxWidth:760, margin:"0 auto", width:"100%", position:"relative", zIndex:1 }}>
          <motion.div {...iv(0)} style={{ marginBottom:24, display:"flex", justifyContent:"center" }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:8,
              background:t.badge, border:`1px solid ${t.badgeBorder}`,
              borderRadius:100, padding:"6px 16px", color:t.badgeText, fontWeight:600, fontSize:13 }}>
              <motion.span animate={{ scale:[1,1.5,1] }} transition={{ duration:1.4, repeat:Infinity }}
                style={{ width:7, height:7, borderRadius:"50%", background:t.accent, display:"inline-block" }}/>
              500+ établissements actifs en France
            </span>
          </motion.div>

          <motion.h1 {...iv(0.07)} style={{ fontSize:"clamp(44px,6vw,80px)", fontWeight:900,
            lineHeight:1.08, margin:"0 0 24px", letterSpacing:"-2.5px", color:t.text, textAlign:"center" }}>
            Transformez chaque client en<br/>
            <span style={{ background:"linear-gradient(135deg,#2563EB,#06B6D4,#8B5CF6)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              ambassadeur Google
            </span>
          </motion.h1>

          <motion.p {...iv(0.14)} style={{ color:t.text2, fontSize:18, lineHeight:1.8,
            margin:"0 auto 44px", maxWidth:560, textAlign:"center" }}>
            La roue de la fortune gamifiée qui booste vos avis Google <strong style={{ color:t.text }}>automatiquement</strong>.
            Configurez en 5 minutes, récoltez des avis à vie.
          </motion.p>

          <motion.div {...iv(0.21)} style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", marginBottom:60 }}>
            <motion.div whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.97 }}>
              <Link href="/register" style={{ display:"block", padding:"16px 36px", borderRadius:12, textDecoration:"none",
                background:t.accent, color:"#fff", fontWeight:700, fontSize:16,
                boxShadow:`0 8px 28px rgba(${t.accentHex},0.4)` }}>
                Commencer gratuitement →
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.97 }}>
              <Link href="/login" style={{ display:"block", padding:"16px 36px", borderRadius:12, textDecoration:"none",
                background:"transparent", border:`1.5px solid ${t.border}`,
                color:t.text2, fontWeight:600, fontSize:16 }}>
                Voir une démo
              </Link>
            </motion.div>
          </motion.div>

          <motion.div {...iv(0.28)} style={{ display:"flex", gap:48, justifyContent:"center", flexWrap:"wrap",
            paddingTop:36, borderTop:`1px solid ${t.border}` }}>
            {[["500+","Établissements"],["4.9★","Note moyenne"],["98%","Satisfaction"],["<5min","Setup"]].map(([v,l])=>(
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:24, fontWeight:800, color:t.text, letterSpacing:"-0.5px" }}>{v}</div>
                <div style={{ fontSize:12, color:t.text3, marginTop:2, fontWeight:500 }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────── */}
      <section style={{ padding:"52px clamp(20px,6vw,80px)", background:t.bg2, borderTop:`1px solid ${t.border}`, borderBottom:`1px solid ${t.border}` }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <motion.div {...iv()} style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ fontSize:12, color:t.text3, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase" }}>
              Reconnu par les professionnels
            </div>
          </motion.div>
          <motion.div {...iv(0.08)} style={{ display:"flex", alignItems:"center", justifyContent:"center",
            gap:"clamp(20px,4vw,60px)", flexWrap:"wrap" }}>
            {[
              { node:<><Ic.Google s={22}/></>, label:"Google Reviews", sub:"4.9 / 5", starsC:"#F59E0B" },
              { node:<><Ic.Trustpilot s={22}/></>, label:"Trustpilot", sub:"Excellent", starsC:"#00B67A" },
            ].map((item,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:46, height:46, borderRadius:12, border:`1px solid ${t.border}`,
                  background:t.card, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {item.node}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:t.text }}>{item.label}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    {[...Array(5)].map((_,j)=><Ic.Star key={j} s={12} c={item.starsC}/>)}
                    <span style={{ fontSize:12, color:t.text3, marginLeft:2, fontWeight:600 }}>{item.sub}</span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ width:1, height:36, background:t.border }}/>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:900, color:t.text, letterSpacing:"-1px" }}>500+</div>
              <div style={{ fontSize:11, color:t.text3, fontWeight:600 }}>Établissements actifs</div>
            </div>
            <div style={{ width:1, height:36, background:t.border }}/>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:46, height:46, borderRadius:12, border:`1px solid rgba(16,185,129,0.25)`,
                background:isDark?"rgba(16,185,129,0.08)":"rgba(16,185,129,0.05)",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Ic.Shield s={22} c="#10B981"/>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:t.text }}>Données sécurisées</div>
                <div style={{ fontSize:12, color:t.text3 }}>RGPD · SSL · Anti-fraude</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section style={{ padding:"100px clamp(20px,6vw,80px)", background:t.bg }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <motion.div {...iv()} style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ color:t.accent, fontWeight:700, fontSize:11, letterSpacing:2.5, textTransform:"uppercase", marginBottom:12 }}>Comment ça marche</div>
            <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, margin:"0 0 14px", letterSpacing:"-1.5px", color:t.text }}>
              Simple comme bonjour
            </h2>
            <p style={{ color:t.text2, fontSize:16, maxWidth:420, margin:"0 auto", lineHeight:1.75 }}>
              De la configuration à vos premiers avis en moins de 10 minutes.
            </p>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:20 }}>
            {STEPS.map((s,i)=>(
              <motion.div key={s.n} {...iv(i*0.12)} whileHover={{ y:-6 }}
                transition={{ type:"spring", stiffness:300, damping:22 }}
                style={{ background:t.step, border:`1px solid ${t.border}`, borderRadius:20,
                  padding:"36px 30px", position:"relative", overflow:"hidden", cursor:"default" }}>
                <div style={{ position:"absolute", top:-40, right:-40, width:120, height:120, borderRadius:"50%",
                  background:`radial-gradient(circle,${s.ac}20,transparent 70%)` }}/>
                <div style={{ fontSize:52, fontWeight:900, color:`${s.ac}14`, lineHeight:1, marginBottom:20, letterSpacing:"-2px" }}>{s.n}</div>
                <div style={{ marginBottom:14 }}><s.Icon s={26} c={s.ac}/></div>
                <h3 style={{ fontSize:18, fontWeight:800, margin:"0 0 10px", color:t.text }}>{s.title}</h3>
                <p style={{ fontSize:14, color:t.text2, lineHeight:1.8, margin:0 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ───────────────────────────────────── */}
      <section style={{ padding:"100px clamp(20px,6vw,80px)", background:t.bg2 }}>
        <div style={{ maxWidth:1060, margin:"0 auto" }}>
          <motion.div {...iv()} style={{ textAlign:"center", marginBottom:60 }}>
            <div style={{ color:"#7C3AED", fontWeight:700, fontSize:11, letterSpacing:2.5, textTransform:"uppercase", marginBottom:12 }}>Fonctionnalités</div>
            <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, margin:"0 0 14px", letterSpacing:"-1.5px", color:t.text }}>Tout ce dont vous avez besoin</h2>
            <p style={{ color:t.text2, fontSize:16, maxWidth:400, margin:"0 auto" }}>Un outil complet, pensé pour les commerçants.</p>
          </motion.div>
          <div className="bento-grid">
            {FEATURES.map((f,i)=>(
              <TiltCard key={f.title} className={i===0?"bento-big":""}>
                <motion.div {...iv(i*0.07)} whileHover={{ boxShadow:t.shadowLg }}
                  style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:18,
                    padding:f.big?"40px 44px":"28px 28px", height:"100%",
                    position:"relative", overflow:"hidden",
                    boxShadow:t.shadow, transition:"box-shadow 0.3s ease" }}>
                  <div style={{ position:"absolute", top:-60, right:-60, width:180, height:180, borderRadius:"50%",
                    background:`radial-gradient(circle,${f.ac}12,transparent 70%)` }}/>
                  <div style={{ width:f.big?50:42, height:f.big?50:42, borderRadius:f.big?14:11,
                    background:`${f.ac}12`, border:`1px solid ${f.ac}28`,
                    display:"flex", alignItems:"center", justifyContent:"center", marginBottom:f.big?20:14 }}>
                    <f.Icon s={f.big?24:20} c={f.ac}/>
                  </div>
                  <h3 style={{ fontSize:f.big?20:15, fontWeight:800, margin:"0 0 10px", color:t.text }}>{f.title}</h3>
                  <p style={{ fontSize:f.big?15:13, color:t.text2, lineHeight:1.75, margin:0 }}>{f.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section style={{ padding:"100px 0", background:t.bg, overflow:"hidden" }}>
        <motion.div {...iv()} style={{ textAlign:"center", marginBottom:60, padding:"0 24px" }}>
          <div style={{ color:"#0891B2", fontWeight:700, fontSize:11, letterSpacing:2.5, textTransform:"uppercase", marginBottom:12 }}>Témoignages</div>
          <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, margin:"0 0 18px", letterSpacing:"-1.5px", color:t.text }}>
            Ils nous font confiance
          </h2>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {[...Array(5)].map((_,i)=><Ic.Star key={i} s={18}/>)}
            <span style={{ color:t.text3, fontSize:14, fontWeight:600, marginLeft:4 }}>4.9 / 5 · 500+ établissements</span>
          </div>
        </motion.div>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:120,
            background:`linear-gradient(to right,${t.bg},transparent)`, zIndex:2, pointerEvents:"none" }}/>
          <div style={{ position:"absolute", right:0, top:0, bottom:0, width:120,
            background:`linear-gradient(to left,${t.bg},transparent)`, zIndex:2, pointerEvents:"none" }}/>
          <motion.div animate={{ x:["0%","-50%"] }} transition={{ duration:36, repeat:Infinity, ease:"linear" }}
            style={{ display:"flex", gap:18, width:"max-content", padding:"8px 20px" }}>
            {[...TESTIMONIALS,...TESTIMONIALS].map((t2,i)=>(
              <motion.div key={i} whileHover={{ y:-4, boxShadow:t.shadowLg }} transition={{ type:"spring", stiffness:300, damping:22 }}
                style={{ width:300, flexShrink:0, background:t.card, border:`1px solid ${t.border}`,
                  borderRadius:18, padding:"26px 28px", cursor:"default", boxShadow:t.shadow }}>
                <div style={{ display:"flex", gap:2, marginBottom:14 }}>{[...Array(5)].map((_,j)=><Ic.Star key={j} s={14}/>)}</div>
                <p style={{ fontSize:13, color:t.text2, lineHeight:1.8, margin:"0 0 20px", fontStyle:"italic" }}>
                  &ldquo;{t2.q}&rdquo;
                </p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%",
                    background:`linear-gradient(135deg,${TC[i%6]},${TC[(i+2)%6]})`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:900, color:"#fff", fontSize:13, flexShrink:0 }}>
                    {t2.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13, color:t.text }}>{t2.name}</div>
                    <div style={{ fontSize:11, color:t.text3, display:"flex", alignItems:"center", gap:3 }}>
                      <Ic.MapPin s={10} c={t.text3}/>{t2.role}
                    </div>
                  </div>
                  <div style={{ marginLeft:"auto" }}><Ic.Google s={16}/></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section style={{ padding:"100px clamp(20px,6vw,80px)", background:t.bg2 }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <motion.div {...iv()} style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ color:"#D97706", fontWeight:700, fontSize:11, letterSpacing:2.5, textTransform:"uppercase", marginBottom:12 }}>Tarifs</div>
            <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, margin:"0 0 14px", letterSpacing:"-1.5px", color:t.text }}>Simple et transparent</h2>
            <p style={{ color:t.text2, fontSize:16, maxWidth:360, margin:"0 auto" }}>Sans engagement. Annulez quand vous voulez.</p>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))", gap:18, alignItems:"center" }}>
            {PLANS.map((plan,i)=>(
              <TiltCard key={plan.id}>
                <motion.div {...iv(i*0.1)} whileHover={{ y:-8 }} transition={{ type:"spring", stiffness:300, damping:22 }}
                  style={{ borderRadius:22, padding:"38px 32px", position:"relative", overflow:"hidden",
                    ...(plan.highlight ? {
                      background:isDark?"linear-gradient(145deg,#0F172A,#1a1440)":"#0F172A",
                      border:`1px solid rgba(${t.accentHex},0.4)`,
                      boxShadow:`0 0 0 1px rgba(${t.accentHex},0.15),0 32px 64px rgba(${t.accentHex},0.2)`,
                    }:{
                      background:t.card, border:`1px solid ${t.border}`, boxShadow:t.shadow,
                    }) }}>
                  {plan.highlight && (
                    <>
                      <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:220, height:140,
                        background:`radial-gradient(ellipse,rgba(${t.accentHex},0.25),transparent 70%)` }}/>
                      <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)",
                        background:`linear-gradient(135deg,${t.accent},#06B6D4)`, color:"#fff", fontWeight:700,
                        fontSize:11, padding:"3px 18px", borderRadius:100, whiteSpace:"nowrap", letterSpacing:0.5 }}>
                        ⚡ Le plus populaire
                      </div>
                    </>
                  )}
                  <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1.2,
                    color:plan.highlight?"#60A5FA":t.text3, marginBottom:10 }}>{plan.name}</div>
                  <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:5 }}>
                    <span style={{ fontSize:52, fontWeight:900, color:plan.highlight?"#F8FAFC":t.text, letterSpacing:"-2px", lineHeight:1 }}>{plan.price}€</span>
                    <span style={{ color:plan.highlight?"#475569":t.text3, fontSize:14 }}>/mois</span>
                  </div>
                  <p style={{ color:plan.highlight?"#64748B":t.text3, fontSize:13, margin:"0 0 26px" }}>{plan.desc}</p>
                  <ul style={{ listStyle:"none", padding:0, margin:"0 0 30px", display:"flex", flexDirection:"column", gap:10 }}>
                    {plan.features.map(feat=>(
                      <li key={feat} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:plan.highlight?"#CBD5E1":t.text2 }}>
                        <Ic.Check s={14} c={plan.highlight?t.accent:"#10B981"}/>{feat}
                      </li>
                    ))}
                  </ul>
                  <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
                    <Link href={plan.href} style={{ display:"block", textAlign:"center", padding:"14px", borderRadius:12,
                      textDecoration:"none", fontWeight:700, fontSize:14,
                      ...(plan.highlight?{
                        background:`linear-gradient(135deg,${t.accent},#06B6D4)`,
                        color:"#fff", boxShadow:`0 8px 24px rgba(${t.accentHex},0.4)`,
                      }:{
                        background:"transparent", color:t.accent, border:`1.5px solid ${t.accent}55`,
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

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ padding:"120px clamp(20px,6vw,80px)", background:t.ctaBg, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          background:"radial-gradient(ellipse 80% 60% at 50% 50%,rgba(37,99,235,0.12),transparent)" }}/>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize:"24px 24px", pointerEvents:"none" }}/>
        <div style={{ textAlign:"center", position:"relative", zIndex:1, maxWidth:680, margin:"0 auto" }}>
          <motion.div {...iv()} style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:"uppercase", color:t.accent, marginBottom:18 }}>
            Rejoindre la communauté
          </motion.div>
          <motion.h2 {...iv(0.1)} style={{ fontSize:"clamp(32px,5vw,62px)", fontWeight:900,
            margin:"0 0 20px", lineHeight:1.12, letterSpacing:"-2px", color:"#FAFAFA" }}>
            Prêt à booster vos{" "}
            <span style={{ background:"linear-gradient(135deg,#60A5FA,#06B6D4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              avis Google
            </span>{" "}?
          </motion.h2>
          <motion.p {...iv(0.18)} style={{ color:"#71717A", fontSize:17, marginBottom:40, lineHeight:1.8 }}>
            Rejoignez 500+ établissements qui récoltent des avis chaque jour.<br/>
            <strong style={{ color:"#A1A1AA" }}>Aucune carte bancaire requise.</strong>
          </motion.p>
          <motion.div {...iv(0.25)}>
            <motion.div whileHover={{ scale:1.05, y:-3 }} whileTap={{ scale:0.97 }} style={{ display:"inline-block" }}>
              <Link href="/register" style={{ display:"inline-block", padding:"18px 44px", borderRadius:16,
                background:`linear-gradient(135deg,${t.accent},#06B6D4)`, color:"#fff", textDecoration:"none",
                fontWeight:800, fontSize:17, boxShadow:`0 16px 48px rgba(${t.accentHex},0.5)`, letterSpacing:"-0.3px" }}>
                Commencer gratuitement — Aucune CB
              </Link>
            </motion.div>
          </motion.div>
          <motion.div {...iv(0.32)} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:24, marginTop:32, flexWrap:"wrap" }}>
            {[[Ic.Shield,"RGPD"],[Ic.Check,"Sans engagement"],[Ic.Star,"4.9/5 Google"]].map(([Icon,label],i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <Icon s={13} c="#52525B"/><span style={{ fontSize:12, color:"#52525B", fontWeight:600 }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background:t.footerBg, padding:"40px clamp(20px,6vw,80px)", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth:1060, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20 }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height:34, objectFit:"contain" }}/>
          <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
            {[["Connexion","/login"],["Créer un compte","/register"],["Dashboard","/dashboard"]].map(([label,href])=>(
              <Link key={label} href={href} style={{ color:t.footerText, textDecoration:"none", fontSize:13, fontWeight:500 }}>{label}</Link>
            ))}
          </div>
          <div style={{ fontSize:13, color:isDark?"#27272A":"#3F3F46" }}>© 2026 VisiumBoost</div>
        </div>
      </footer>

      <style>{`
        * { box-sizing:border-box; }
        body { transition: background-color 0.35s ease, color 0.35s ease; }
        .bento-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .bento-big  { grid-column:1/3; }
        .side-layer { display:none; }
        .side-obj   { display:block; }
        @media(min-width:1480px) { .side-layer { display:block; } }
        @media(max-width:920px) { .bento-grid { grid-template-columns:repeat(2,1fr); } .bento-big { grid-column:1/-1; } }
        @media(max-width:540px) { .bento-grid { grid-template-columns:1fr; } .bento-big { grid-column:1; } }
      `}</style>
    </div>
  );
}
