"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

const E = [0.22, 1, 0.36, 1];

// ─── Theme ───────────────────────────────────────────────────────────
const T = {
  light: {
    bg:"#FAFAFA", bg2:"#F2F2F7", bg3:"#FFFFFF",
    bgDark:"#1D1D1F",
    text:"#1D1D1F", text2:"#6E6E73", text3:"#98989D",
    border:"rgba(0,0,0,0.08)", border2:"rgba(0,0,0,0.04)",
    card:"#FFFFFF", cardBg:"rgba(0,0,0,0.02)",
    navBg:"rgba(250,250,250,0.82)",
    accent:"#2563EB", accentHex:"37,99,235",
    badge:"rgba(37,99,235,0.07)", badgeBorder:"rgba(37,99,235,0.18)", badgeText:"#1D4ED8",
    shadow:"0 2px 8px rgba(0,0,0,0.05),0 12px 32px rgba(0,0,0,0.06)",
    shadowLg:"0 24px 64px rgba(0,0,0,0.12)",
    step:"#FFFFFF",
    footerBg:"#1D1D1F", footerText:"#6E6E73",
    ctaBg:"#1D1D1F",
    tile1:"#1D1D1F", tile2:"#2563EB", tile3:"#F2F2F7",
  },
  dark: {
    bg:"rgba(10,10,12,0.72)", bg2:"rgba(16,16,20,0.65)", bg3:"rgba(24,24,28,0.6)",
    bgDark:"rgba(8,8,10,0.9)",
    text:"#F5F5F7", text2:"#A1A1A6", text3:"#6E6E73",
    border:"rgba(255,255,255,0.08)", border2:"rgba(255,255,255,0.04)",
    card:"rgba(255,255,255,0.04)", cardBg:"rgba(255,255,255,0.025)",
    navBg:"rgba(10,10,12,0.92)",
    accent:"#3B82F6", accentHex:"59,130,246",
    badge:"rgba(59,130,246,0.12)", badgeBorder:"rgba(59,130,246,0.3)", badgeText:"#93C5FD",
    shadow:"0 2px 8px rgba(0,0,0,0.25),0 12px 32px rgba(0,0,0,0.3)",
    shadowLg:"0 24px 64px rgba(0,0,0,0.5)",
    step:"rgba(255,255,255,0.025)",
    footerBg:"rgba(5,5,7,0.95)", footerText:"#52525B",
    ctaBg:"rgba(6,6,8,0.9)",
    tile1:"rgba(255,255,255,0.05)", tile2:"rgba(37,99,235,0.3)", tile3:"rgba(255,255,255,0.03)",
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

// ─── Dark Mode 3D Background ──────────────────────────────────────────
function DarkBg3D() {
  const shapes = [
    { w:700, h:700, top:"-15%", left:"-12%",  color:"rgba(37,99,235,0.28)",   dur:14 },
    { w:800, h:800, top:"15%",  right:"-15%", color:"rgba(139,92,246,0.22)",  dur:18 },
    { w:600, h:600, top:"50%",  left:"5%",    color:"rgba(6,182,212,0.18)",   dur:22 },
    { w:500, h:500, top:"65%",  right:"2%",   color:"rgba(37,99,235,0.16)",   dur:16 },
    { w:550, h:550, top:"35%",  left:"35%",   color:"rgba(139,92,246,0.12)",  dur:20 },
  ];
  const geos = [
    { s:130, top:"12%", left:"5%",   border:"rgba(59,130,246,0.25)",  dur:20, delay:0,  r:0 },
    { s:90,  top:"38%", right:"4%",  border:"rgba(139,92,246,0.25)",  dur:15, delay:3,  r:1 },
    { s:65,  top:"58%", left:"12%",  border:"rgba(6,182,212,0.2)",    dur:25, delay:6,  r:2 },
    { s:110, top:"78%", right:"10%", border:"rgba(59,130,246,0.18)",  dur:18, delay:2,  r:0 },
    { s:55,  top:"22%", left:"42%",  border:"rgba(245,158,11,0.18)",  dur:22, delay:5,  r:1 },
    { s:75,  top:"68%", left:"48%",  border:"rgba(139,92,246,0.18)",  dur:19, delay:8,  r:2 },
  ];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:-1, pointerEvents:"none", overflow:"hidden" }}>
      {/* Glow orbs */}
      {shapes.map((sh, i) => (
        <motion.div key={i}
          animate={{ x:[0,i%2===0?30:-25,0], y:[0,i%2===0?-22:18,0], scale:[1,1.1,1] }}
          transition={{ duration:sh.dur, repeat:Infinity, ease:"easeInOut", delay:i*2.5 }}
          style={{ position:"absolute", width:sh.w, height:sh.h,
            top:sh.top, left:sh.left, right:sh.right,
            borderRadius:"50%",
            background:`radial-gradient(circle,${sh.color},transparent 65%)`,
            filter:"blur(80px)" }}
        />
      ))}
      {/* Perspective floor grid */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:"50%",
        backgroundImage:"linear-gradient(rgba(59,130,246,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.12) 1px,transparent 1px)",
        backgroundSize:"54px 54px",
        transform:"perspective(360px) rotateX(65deg)",
        transformOrigin:"bottom center",
        WebkitMaskImage:"linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 60%)",
        maskImage:"linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 60%)",
      }}/>
      {/* Floating geometric outlines */}
      {geos.map((g, i) => (
        <motion.div key={i}
          animate={{ y:[0,-32,0], rotate:[0, g.r===0?180:g.r===1?-180:90, 0], opacity:[0.08,0.22,0.08] }}
          transition={{ duration:g.dur, repeat:Infinity, ease:"easeInOut", delay:g.delay }}
          style={{ position:"absolute", width:g.s, height:g.s,
            top:g.top, left:g.left, right:g.right,
            borderRadius: g.r===0 ? "50%" : g.r===1 ? "18px" : "6px",
            border:`1.5px solid ${g.border}` }}
        />
      ))}
    </div>
  );
}

// ─── Fixed 3D Side Objects layer ─────────────────────────────────────
function SideObjects({ isDark, scrollY, t }) {
  const phoneY    = useTransform(scrollY, [0, 1200], [0, -60]);
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
      <motion.div style={{ position:"absolute", right:24, top:"28%", y:phoneY, opacity:phoneOp }} className="side-obj">
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
  { id:"free",    name:"Essentiel", price:"9,99",  desc:"Après votre essai gratuit",  features:["1 établissement","100 scans/mois","Roue personnalisée","Codes anti-fraude","Support email"],                     cta:"Démarrer l'essai gratuit", href:"/register" },
  { id:"starter", name:"Starter",  price:"29",    desc:"Pour les indépendants",      features:["3 établissements","500 scans/mois","Analytics avancés","URL personnalisée","Support prioritaire"], cta:"Essai 14 jours gratuit",   href:"/register", highlight:true },
  { id:"pro",     name:"Pro",      price:"79",    desc:"Pour les chaînes & agences", features:["Établissements illimités","Scans illimités","API access","White label","Account manager dédié"],   cta:"Nous contacter",           href:"/register" },
];

// ─── Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);
  const t = T[isDark ? "dark" : "light"];
  const { scrollY } = useScroll();
  const navY    = useTransform(scrollY,[0,80],[0,0]);
  const navBdr  = useTransform(scrollY,[0,60],["rgba(0,0,0,0)","rgba(0,0,0,0.07)"]);

  const iv = (delay=0) => ({
    initial:{opacity:0, y:32},
    whileInView:{opacity:1, y:0},
    viewport:{once:true, amount:0.12},
    transition:{duration:0.7, ease:E, delay},
  });
  const il = (delay=0) => ({
    initial:{opacity:0, x:-32},
    whileInView:{opacity:1, x:0},
    viewport:{once:true, amount:0.12},
    transition:{duration:0.7, ease:E, delay},
  });

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background: isDark ? "transparent" : t.bg, color:t.text, minHeight:"100vh", position:"relative", overflowX:"hidden" }}>
      {isDark && <div style={{ position:"fixed", inset:0, zIndex:-2, background:"#0A0A0C" }}/>}
      {isDark && <DarkBg3D/>}
      <SideObjects isDark={isDark} scrollY={scrollY} t={t}/>

      {/* ── NAV ── */}
      <motion.nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 clamp(24px,5vw,72px)", height:60,
        backdropFilter:"blur(28px) saturate(180%)",
        WebkitBackdropFilter:"blur(28px) saturate(180%)",
        background:t.navBg,
        borderBottom:`1px solid`,
        borderColor:navBdr,
        transition:"border-color 0.3s",
      }}>
        <Link href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center" }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height:36, objectFit:"contain" }}/>
        </Link>

        {/* Center links */}
        <div className="nav-links" style={{ display:"flex", alignItems:"center", gap:4 }}>
          {[["Fonctionnalités","#features"],["Tarifs","#pricing"],["Témoignages","#testimonials"]].map(([l,h])=>(
            <a key={l} href={h} style={{ padding:"7px 14px", borderRadius:8, textDecoration:"none",
              color:t.text2, fontWeight:500, fontSize:14, transition:"color 0.2s" }}
              onMouseEnter={e=>e.target.style.color=t.text}
              onMouseLeave={e=>e.target.style.color=t.text2}>{l}</a>
          ))}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <button onClick={()=>setIsDark(d=>!d)} style={{
            width:36, height:36, borderRadius:9, border:`1px solid ${t.border}`,
            background:"transparent", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            {isDark ? <Ic.Sun s={16} c={t.text2}/> : <Ic.Moon s={16} c={t.text2}/>}
          </button>
          <Link href="/login" style={{ padding:"8px 16px", borderRadius:9, textDecoration:"none",
            color:t.text2, fontWeight:500, fontSize:14 }}>Se connecter</Link>
          <motion.div whileHover={{scale:1.03}} whileTap={{scale:0.97}}>
            <Link href="/register" style={{ display:"block", padding:"9px 20px", borderRadius:10,
              textDecoration:"none", background:t.text, color:isDark?"#0A0A0C":"#FAFAFA",
              fontWeight:700, fontSize:14, letterSpacing:"-0.2px" }}>
              Essai gratuit
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section style={{ minHeight:"100dvh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", textAlign:"center",
        padding:"120px clamp(20px,6vw,80px) 80px", position:"relative", overflow:"hidden",
        background:t.bg }}>

        {/* Radial glow behind text */}
        <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)",
          width:900, height:500, pointerEvents:"none",
          background:`radial-gradient(ellipse, rgba(${t.accentHex},${isDark?0.14:0.07}) 0%, transparent 70%)`,
          filter:"blur(40px)" }}/>

        {/* Dot grid */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:`radial-gradient(${isDark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)"} 1px,transparent 1px)`,
          backgroundSize:"32px 32px" }}/>

        <div style={{ position:"relative", zIndex:1, maxWidth:860, margin:"0 auto" }}>
          {/* Badge */}
          <motion.div {...iv(0)} style={{ display:"inline-flex", alignItems:"center", gap:8,
            background:t.badge, border:`1px solid ${t.badgeBorder}`,
            borderRadius:100, padding:"6px 18px 6px 8px", marginBottom:32 }}>
            <span style={{ background:t.accent, borderRadius:100, padding:"3px 10px",
              fontSize:11, fontWeight:800, color:"#fff", letterSpacing:"0.3px" }}>NOUVEAU</span>
            <span style={{ color:t.badgeText, fontWeight:600, fontSize:13 }}>14 jours d&apos;essai gratuit — sans CB</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1 {...iv(0.06)} style={{
            fontFamily:"'Special Gothic Expanded One','DM Sans',system-ui",
            fontSize:"clamp(48px,8.5vw,108px)",
            fontWeight:400,
            lineHeight:1.02,
            letterSpacing:"-0.03em",
            margin:"0 0 28px",
            color:t.text,
          }}>
            La roue qui{" "}
            <span style={{
              background:"linear-gradient(135deg,#2563EB 0%,#06B6D4 50%,#8B5CF6 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              display:"inline-block",
            }}>transforme</span>
            <br/>vos clients en avis
          </motion.h1>

          <motion.p {...iv(0.12)} style={{
            fontSize:"clamp(16px,2vw,20px)", lineHeight:1.7,
            color:t.text2, margin:"0 auto 44px", maxWidth:540, fontWeight:400,
          }}>
            Gamifiez l&apos;expérience client. Chaque avis Google déclenche un tour de roue — vos clients jouent, vos avis explosent.
          </motion.p>

          {/* CTAs */}
          <motion.div {...iv(0.18)} style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:64 }}>
            <motion.div whileHover={{scale:1.04,y:-3}} whileTap={{scale:0.97}}>
              <Link href="/register" style={{ display:"inline-flex", alignItems:"center", gap:8,
                padding:"16px 36px", borderRadius:100, textDecoration:"none",
                background:t.accent, color:"#fff", fontWeight:700, fontSize:16,
                boxShadow:`0 12px 36px rgba(${t.accentHex},0.42)`,
                letterSpacing:"-0.2px",
              }}>
                Commencer gratuitement
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{scale:1.04,y:-3}} whileTap={{scale:0.97}}>
              <Link href="/login" style={{ display:"inline-flex", alignItems:"center", gap:8,
                padding:"16px 32px", borderRadius:100, textDecoration:"none",
                background:"transparent", border:`1.5px solid ${t.border}`,
                color:t.text, fontWeight:600, fontSize:16 }}>
                Voir la démo
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust row */}
          <motion.div {...iv(0.24)} style={{ display:"flex", alignItems:"center", justifyContent:"center",
            gap:"clamp(16px,3vw,40px)", flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              {[...Array(5)].map((_,i)=><Ic.Star key={i} s={15}/>)}
              <span style={{ fontSize:13, color:t.text2, fontWeight:600 }}>4.9 / 5</span>
            </div>
            <div style={{ width:1, height:20, background:t.border }}/>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Ic.Google s={17}/>
              <span style={{ fontSize:13, color:t.text2, fontWeight:600 }}>Google Reviews</span>
            </div>
            <div style={{ width:1, height:20, background:t.border }}/>
            <span style={{ fontSize:13, color:t.text2, fontWeight:600 }}>500+ établissements actifs</span>
          </motion.div>
        </div>

        {/* Hero product visual */}
        <motion.div initial={{opacity:0,y:60,scale:0.9}} animate={{opacity:1,y:0,scale:1}}
          transition={{duration:1.1, ease:E, delay:0.3}}
          style={{ marginTop:80, position:"relative", zIndex:1, maxWidth:700, width:"100%",
            display:"flex", justifyContent:"center", alignItems:"center", gap:32, flexWrap:"wrap" }}>

          {/* Big wheel */}
          <motion.div animate={{y:[0,-14,0]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}}
            style={{ position:"relative", flexShrink:0 }}>
            <div style={{ width:240, height:240,
              filter:`drop-shadow(0 40px 60px rgba(${t.accentHex},0.3)) drop-shadow(0 8px 16px rgba(0,0,0,0.2))` }}>
              <motion.div animate={{rotate:360}} transition={{duration:28,repeat:Infinity,ease:"linear"}}
                style={{ width:"100%", height:"100%", borderRadius:"50%",
                  background:`conic-gradient(${CONIC})`,
                  boxShadow:"inset 0 0 40px rgba(0,0,0,0.25)" }}>
                {SEG.map((_,i)=>(
                  <div key={i} style={{ position:"absolute",top:"50%",left:"50%",width:"50%",height:2,
                    background:"rgba(255,255,255,0.22)",transformOrigin:"0 50%",
                    transform:`rotate(${(i/SEG.length)*360}deg)` }}/>
                ))}
                <div style={{ position:"absolute",top:"50%",left:"50%",width:28,height:28,borderRadius:"50%",
                  background:"#fff",transform:"translate(-50%,-50%)",
                  boxShadow:"0 4px 16px rgba(0,0,0,0.25)",zIndex:2 }}/>
              </motion.div>
            </div>
            <div style={{ position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",
              width:0,height:0,borderLeft:"9px solid transparent",borderRight:"9px solid transparent",
              borderTop:"22px solid #F59E0B",filter:"drop-shadow(0 2px 6px rgba(245,158,11,0.7))",zIndex:5 }}/>
          </motion.div>

          {/* Floating stat cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              { top:true, content:(
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#2563EB,#06B6D4)",
                    display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#fff",fontSize:14,flexShrink:0 }}>M</div>
                  <div>
                    <div style={{ fontSize:13,fontWeight:700,color:"#F5F5F7",marginBottom:2 }}>Marie D.</div>
                    <div style={{ display:"flex",gap:2 }}>{[...Array(5)].map((_,j)=><Ic.Star key={j} s={11}/>)}</div>
                  </div>
                  <div style={{ marginLeft:8 }}><Ic.Google s={16}/></div>
                </div>
              )},
              { content:(
                <div>
                  <div style={{ fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:4 }}>Ce mois-ci</div>
                  <div style={{ fontSize:36,fontWeight:900,color:"#10B981",letterSpacing:"-2px",lineHeight:1 }}>+47</div>
                  <div style={{ fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2 }}>nouveaux avis Google</div>
                </div>
              )},
              { content:(
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <div style={{ width:32,height:32,borderRadius:9,background:"rgba(245,158,11,0.18)",
                    display:"flex",alignItems:"center",justifyContent:"center" }}><Ic.Star s={16}/></div>
                  <div>
                    <div style={{ fontSize:14,fontWeight:800,color:"#F5F5F7" }}>−20% gagné</div>
                    <div style={{ fontSize:11,color:"rgba(255,255,255,0.4)" }}>prochaine visite</div>
                  </div>
                </div>
              )},
            ].map(({content},i)=>(
              <motion.div key={i}
                initial={{opacity:0,x:30}} animate={{opacity:1,x:0}}
                transition={{duration:0.6,delay:0.5+i*0.15,ease:E}}
                whileHover={{scale:1.03,y:-3}}
                style={{ background:"rgba(10,10,30,0.85)", backdropFilter:"blur(20px)",
                  border:"1px solid rgba(255,255,255,0.1)", borderRadius:18,
                  padding:"16px 20px", boxShadow:"0 12px 40px rgba(0,0,0,0.3)",
                  cursor:"default", minWidth:180 }}>
                {content}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── METRICS STRIP ── */}
      <section style={{ borderTop:`1px solid ${t.border}`, borderBottom:`1px solid ${t.border}`, background:t.bg2 }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid",
          gridTemplateColumns:"repeat(4,1fr)", textAlign:"center" }}>
          {[["500+","Établissements actifs"],["4.9★","Note Google moyenne"],["98%","Clients satisfaits"],["<5min","Temps de setup"]].map(([v,l],i)=>(
            <motion.div key={l} {...iv(i*0.08)}
              style={{ padding:"clamp(24px,4vw,44px) 20px",
                borderRight: i<3 ? `1px solid ${t.border}` : "none" }}>
              <div style={{ fontFamily:"'Special Gothic Expanded One','DM Sans',system-ui",
                fontSize:"clamp(28px,4vw,48px)", fontWeight:400,
                color:t.text, letterSpacing:"-0.03em", lineHeight:1, marginBottom:8 }}>{v}</div>
              <div style={{ fontSize:13, color:t.text3, fontWeight:500 }}>{l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── DARK FEATURE SPLIT ── */}
      <section style={{ background:t.bgDark, padding:"clamp(80px,10vw,140px) clamp(20px,6vw,80px)",
        position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-30%", right:"-10%", width:600, height:600, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(37,99,235,0.15),transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"-20%", left:"-5%", width:500, height:500, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%)", pointerEvents:"none" }}/>

        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid",
          gridTemplateColumns:"1fr 1fr", gap:"clamp(40px,6vw,100px)", alignItems:"center" }}
          className="split-grid">
          <div>
            <motion.div {...il(0)} style={{ display:"inline-flex", alignItems:"center", gap:8,
              background:"rgba(37,99,235,0.15)", border:"1px solid rgba(37,99,235,0.25)",
              borderRadius:100, padding:"5px 16px", marginBottom:24 }}>
              <div style={{ width:7,height:7,borderRadius:"50%",background:"#3B82F6",
                boxShadow:"0 0 8px #3B82F6" }}/>
              <span style={{ color:"#93C5FD",fontWeight:700,fontSize:12,letterSpacing:"0.5px" }}>CONÇU POUR CONVERTIR</span>
            </motion.div>

            <motion.h2 {...il(0.07)} style={{
              fontFamily:"'Special Gothic Expanded One','DM Sans',system-ui",
              fontSize:"clamp(32px,5vw,64px)", fontWeight:400,
              lineHeight:1.06, letterSpacing:"-0.03em",
              color:"#F5F5F7", margin:"0 0 24px",
            }}>
              Chaque client qui part est une opportunité manquée
            </motion.h2>

            <motion.p {...il(0.13)} style={{ color:"#A1A1A6", fontSize:17, lineHeight:1.75, margin:"0 0 40px", maxWidth:440 }}>
              VisiumBoost transforme le moment de départ en jeu. Vos clients adorent la roue, vous adorez les avis.
            </motion.p>

            <motion.div {...il(0.18)} style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                { c:"#3B82F6", t:"Roue personnalisée en 5 minutes", d:"Logo, couleurs, récompenses — votre identité, votre roue." },
                { c:"#10B981", t:"Codes anti-fraude automatiques",   d:"Chaque code est unique et ne peut être utilisé qu'une fois." },
                { c:"#8B5CF6", t:"Analytics en temps réel",          d:"Scans, conversions, avis — tout en un coup d'œil." },
              ].map((item,i)=>(
                <motion.div key={i} {...il(0.22+i*0.06)}
                  style={{ display:"flex", alignItems:"flex-start", gap:16 }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:`${item.c}18`,
                    border:`1px solid ${item.c}30`,display:"flex",alignItems:"center",
                    justifyContent:"center",flexShrink:0,marginTop:2 }}>
                    <Ic.Check s={16} c={item.c}/>
                  </div>
                  <div>
                    <div style={{ fontSize:15,fontWeight:700,color:"#F5F5F7",marginBottom:3 }}>{item.t}</div>
                    <div style={{ fontSize:13,color:"#6E6E73",lineHeight:1.6 }}>{item.d}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Phone mockup */}
          <motion.div {...iv(0.15)} style={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
            <Phone3D isDark={true}/>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="features" style={{ padding:"clamp(80px,10vw,140px) clamp(20px,6vw,80px)", background:t.bg }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <motion.div {...iv()} style={{ textAlign:"center", marginBottom:"clamp(48px,6vw,80px)" }}>
            <div style={{ fontSize:12, color:t.accent, fontWeight:700, letterSpacing:"2px",
              textTransform:"uppercase", marginBottom:16 }}>COMMENT ÇA MARCHE</div>
            <h2 style={{ fontFamily:"'Special Gothic Expanded One','DM Sans',system-ui",
              fontSize:"clamp(32px,5vw,60px)", fontWeight:400, margin:"0 0 16px",
              letterSpacing:"-0.03em", lineHeight:1.08, color:t.text }}>
              Opérationnel en 3 étapes
            </h2>
            <p style={{ color:t.text2, fontSize:17, maxWidth:420, margin:"0 auto", lineHeight:1.7 }}>
              Pas de développeur, pas de carte bancaire. Juste vos premiers avis.
            </p>
          </motion.div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }} className="steps-grid">
            {STEPS.map((s,i)=>(
              <motion.div key={s.n} {...iv(i*0.1)}
                style={{ padding:"clamp(28px,4vw,48px) clamp(24px,3vw,40px)",
                  borderRight: i<2 ? `1px solid ${t.border}` : "none",
                  borderTop:`3px solid ${i===0?s.ac:t.border}`,
                  position:"relative", background:t.bg,
                  transition:"border-top-color 0.3s" }}
                onHoverStart={e=>{}} >
                <div style={{ fontFamily:"'DM Mono',monospace",
                  fontSize:56, fontWeight:400, color:`${s.ac}18`,
                  lineHeight:1, marginBottom:24, letterSpacing:"-3px" }}>{s.n}</div>
                <div style={{ marginBottom:16 }}>
                  <div style={{ width:48,height:48,borderRadius:14,background:`${s.ac}10`,
                    border:`1px solid ${s.ac}20`,display:"flex",alignItems:"center",
                    justifyContent:"center" }}>
                    <s.Icon s={24} c={s.ac}/>
                  </div>
                </div>
                <h3 style={{ fontSize:20, fontWeight:800, margin:"0 0 10px",
                  color:t.text, letterSpacing:"-0.3px" }}>{s.title}</h3>
                <p style={{ fontSize:14, color:t.text2, lineHeight:1.75, margin:0 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES TILES ── */}
      <section style={{ padding:"clamp(80px,10vw,140px) clamp(20px,6vw,80px)", background:t.bg2 }}>
        <div style={{ maxWidth:1080, margin:"0 auto" }}>
          <motion.div {...iv()} style={{ display:"flex", alignItems:"flex-end",
            justifyContent:"space-between", marginBottom:"clamp(40px,5vw,64px)", gap:24, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:12,color:"#8B5CF6",fontWeight:700,letterSpacing:"2px",
                textTransform:"uppercase",marginBottom:14 }}>FONCTIONNALITÉS</div>
              <h2 style={{ fontFamily:"'Special Gothic Expanded One','DM Sans',system-ui",
                fontSize:"clamp(28px,4.5vw,56px)", fontWeight:400, margin:0,
                letterSpacing:"-0.03em", lineHeight:1.08, color:t.text }}>
                Tout en un, rien à configurer
              </h2>
            </div>
            <p style={{ color:t.text2, fontSize:15, maxWidth:320, lineHeight:1.7, margin:0 }}>
              Un outil complet pensé pour les restaurateurs, salons et commerçants.
            </p>
          </motion.div>

          <div className="bento-grid">
            {FEATURES.map((f,i)=>(
              <TiltCard key={f.title} className={i===0?"bento-big":""}>
                <motion.div {...iv(i*0.07)}
                  style={{ background:i===0?t.bgDark:i===1?"linear-gradient(135deg,rgba(37,99,235,0.12),rgba(139,92,246,0.08))":t.card,
                    border:`1px solid ${i===0?"rgba(255,255,255,0.08)":t.border}`,
                    borderRadius:20, padding:f.big?"44px 48px":"32px 32px",
                    height:"100%", position:"relative", overflow:"hidden",
                    boxShadow:t.shadow, cursor:"default" }}>

                  <div style={{ position:"absolute",top:-80,right:-80,width:220,height:220,
                    borderRadius:"50%",background:`radial-gradient(circle,${f.ac}${i===0?"28":"15"},transparent 70%)`,
                    pointerEvents:"none" }}/>

                  <div style={{ width:f.big?52:44,height:f.big?52:44,borderRadius:f.big?16:13,
                    background:`${f.ac}18`,border:`1px solid ${f.ac}30`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    marginBottom:f.big?22:16 }}>
                    <f.Icon s={f.big?26:21} c={f.ac}/>
                  </div>

                  <h3 style={{ fontSize:f.big?22:16,fontWeight:800,margin:"0 0 10px",letterSpacing:"-0.3px",
                    color:i===0?"#F5F5F7":t.text }}>{f.title}</h3>
                  <p style={{ fontSize:f.big?15:13,color:i===0?"#6E6E73":t.text2,lineHeight:1.75,margin:0 }}>{f.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ padding:"clamp(80px,10vw,120px) 0", background:t.bg, overflow:"hidden" }}>
        <motion.div {...iv()} style={{ textAlign:"center",marginBottom:"clamp(40px,5vw,60px)",padding:"0 24px" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginBottom:16 }}>
            {[...Array(5)].map((_,i)=><Ic.Star key={i} s={20}/>)}
          </div>
          <h2 style={{ fontFamily:"'Special Gothic Expanded One','DM Sans',system-ui",
            fontSize:"clamp(28px,4.5vw,56px)", fontWeight:400,
            margin:"0 0 14px", letterSpacing:"-0.03em", lineHeight:1.08, color:t.text }}>
            500+ établissements nous font confiance
          </h2>
          <p style={{ color:t.text2, fontSize:16, fontWeight:500 }}>
            4.9 / 5 de note moyenne sur Google Reviews
          </p>
        </motion.div>

        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute",left:0,top:0,bottom:0,width:160,zIndex:2,pointerEvents:"none",
            background:`linear-gradient(to right,${isDark?"#0A0A0C":t.bg},transparent)` }}/>
          <div style={{ position:"absolute",right:0,top:0,bottom:0,width:160,zIndex:2,pointerEvents:"none",
            background:`linear-gradient(to left,${isDark?"#0A0A0C":t.bg},transparent)` }}/>

          <motion.div animate={{x:["0%","-50%"]}} transition={{duration:40,repeat:Infinity,ease:"linear"}}
            style={{ display:"flex",gap:16,width:"max-content",padding:"12px 24px" }}>
            {[...TESTIMONIALS,...TESTIMONIALS].map((t2,i)=>(
              <motion.div key={i}
                whileHover={{y:-6,boxShadow:t.shadowLg}}
                transition={{type:"spring",stiffness:300,damping:22}}
                style={{ width:320,flexShrink:0,background:t.card,
                  border:`1px solid ${t.border}`,borderRadius:20,
                  padding:"28px 28px",cursor:"default",boxShadow:t.shadow }}>
                <div style={{ display:"flex",gap:2,marginBottom:16 }}>
                  {[...Array(5)].map((_,j)=><Ic.Star key={j} s={14}/>)}
                </div>
                <p style={{ fontSize:14,color:t.text2,lineHeight:1.8,margin:"0 0 22px",
                  fontStyle:"italic",letterSpacing:"0.1px" }}>&ldquo;{t2.q}&rdquo;</p>
                <div style={{ display:"flex",alignItems:"center",gap:12,
                  paddingTop:16,borderTop:`1px solid ${t.border}` }}>
                  <div style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,
                    background:`linear-gradient(135deg,${TC[i%6]},${TC[(i+2)%6]})`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontWeight:900,color:"#fff",fontSize:14 }}>{t2.name[0]}</div>
                  <div>
                    <div style={{ fontSize:13,fontWeight:700,color:t.text }}>{t2.name}</div>
                    <div style={{ fontSize:11,color:t.text3,display:"flex",alignItems:"center",gap:3 }}>
                      <Ic.MapPin s={10} c={t.text3}/>{t2.role}
                    </div>
                  </div>
                  <div style={{ marginLeft:"auto" }}><Ic.Google s={18}/></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding:"clamp(80px,10vw,140px) clamp(20px,6vw,80px)", background:t.bg2 }}>
        <div style={{ maxWidth:1020, margin:"0 auto" }}>
          <motion.div {...iv()} style={{ textAlign:"center",marginBottom:"clamp(48px,6vw,72px)" }}>
            <div style={{ fontSize:12,color:"#F59E0B",fontWeight:700,letterSpacing:"2px",
              textTransform:"uppercase",marginBottom:16 }}>TARIFS</div>
            <h2 style={{ fontFamily:"'Special Gothic Expanded One','DM Sans',system-ui",
              fontSize:"clamp(32px,5vw,60px)", fontWeight:400,
              margin:"0 0 16px", letterSpacing:"-0.03em", lineHeight:1.08, color:t.text }}>
              Simple, transparent, sans surprise
            </h2>
            <p style={{ color:t.text2, fontSize:16, maxWidth:380, margin:"0 auto" }}>
              14 jours gratuits sur tous les plans. Sans carte bancaire.
            </p>
          </motion.div>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,alignItems:"start" }}
            className="pricing-grid">
            {PLANS.map((plan,i)=>(
              <TiltCard key={plan.id} style={{ paddingTop: plan.highlight ? 22 : 0 }}>
                <motion.div {...iv(i*0.1)}
                  style={{ borderRadius:24,padding:"36px 32px",position:"relative",
                    display:"flex",flexDirection:"column",
                    ...(plan.highlight ? {
                      background:"#1D1D1F",
                      border:"1px solid rgba(37,99,235,0.4)",
                      boxShadow:"0 0 0 1px rgba(37,99,235,0.1),0 28px 64px rgba(37,99,235,0.2)",
                    }:{
                      background:t.card,
                      border:`1px solid ${t.border}`,
                      boxShadow:t.shadow,
                    }) }}>

                  {plan.highlight && (
                    <>
                      <div style={{ position:"absolute",top:-40,left:"50%",transform:"translateX(-50%)",
                        width:280,height:140,borderRadius:"50%",pointerEvents:"none",
                        background:"radial-gradient(ellipse,rgba(37,99,235,0.2),transparent 70%)" }}/>
                      <div style={{ position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",
                        background:"linear-gradient(135deg,#2563EB,#06B6D4)",color:"#fff",
                        fontWeight:800,fontSize:11,padding:"4px 22px",borderRadius:100,
                        whiteSpace:"nowrap",letterSpacing:"0.5px",
                        boxShadow:"0 4px 16px rgba(37,99,235,0.45)" }}>
                        LE PLUS POPULAIRE
                      </div>
                    </>
                  )}

                  <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px",
                    color:plan.highlight?"#60A5FA":t.text3,marginBottom:16 }}>{plan.name}</div>

                  <div style={{ display:"flex",alignItems:"baseline",gap:2,marginBottom:4 }}>
                    <span style={{ fontFamily:"'Special Gothic Expanded One','DM Sans',system-ui",
                      fontSize:56,fontWeight:400,letterSpacing:"-0.03em",lineHeight:1,
                      color:plan.highlight?"#F5F5F7":t.text }}>{plan.price}</span>
                    <span style={{ fontSize:20,color:plan.highlight?"#6E6E73":t.text2,marginLeft:2,fontWeight:400 }}>€</span>
                    <span style={{ fontSize:14,color:plan.highlight?"#6E6E73":t.text3,marginLeft:2 }}>/mois</span>
                  </div>
                  <p style={{ color:plan.highlight?"#6E6E73":t.text3,fontSize:13,margin:"0 0 24px",lineHeight:1.5 }}>{plan.desc}</p>

                  <div style={{ height:1,background:plan.highlight?"rgba(255,255,255,0.07)":t.border,marginBottom:22 }}/>

                  <ul style={{ listStyle:"none",padding:0,margin:"0 0 28px",
                    display:"flex",flexDirection:"column",gap:13,flex:1 }}>
                    {plan.features.map(feat=>(
                      <li key={feat} style={{ display:"flex",alignItems:"center",gap:11,fontSize:14,
                        color:plan.highlight?"#A1A1A6":t.text2 }}>
                        <div style={{ width:20,height:20,borderRadius:"50%",flexShrink:0,
                          background:plan.highlight?"rgba(37,99,235,0.15)":"rgba(16,185,129,0.1)",
                          display:"flex",alignItems:"center",justifyContent:"center" }}>
                          <Ic.Check s={12} c={plan.highlight?"#60A5FA":"#10B981"}/>
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <motion.div whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
                    <Link href={plan.href} style={{ display:"block",textAlign:"center",
                      padding:"15px 20px",borderRadius:100,textDecoration:"none",
                      fontWeight:700,fontSize:14,letterSpacing:"-0.2px",
                      ...(plan.highlight?{
                        background:"linear-gradient(135deg,#2563EB,#06B6D4)",
                        color:"#fff",boxShadow:"0 8px 24px rgba(37,99,235,0.4)",
                      }:{
                        background:"transparent",color:t.accent,
                        border:`1.5px solid rgba(${t.accentHex},0.3)`,
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

      {/* ── CTA ── */}
      <section style={{ background:t.ctaBg, padding:"clamp(100px,12vw,160px) clamp(20px,6vw,80px)",
        position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,pointerEvents:"none",
          background:"radial-gradient(ellipse 70% 60% at 50% 50%,rgba(37,99,235,0.11),transparent)" }}/>
        <div style={{ position:"absolute",inset:0,
          backgroundImage:"radial-gradient(rgba(255,255,255,0.035) 1px,transparent 1px)",
          backgroundSize:"28px 28px",pointerEvents:"none" }}/>

        <div style={{ textAlign:"center",position:"relative",zIndex:1,maxWidth:720,margin:"0 auto" }}>
          <motion.div {...iv(0.04)} style={{ display:"inline-flex",alignItems:"center",gap:8,
            background:"rgba(37,99,235,0.12)",border:"1px solid rgba(37,99,235,0.2)",
            borderRadius:100,padding:"6px 18px",marginBottom:28 }}>
            <div style={{ width:7,height:7,borderRadius:"50%",background:"#3B82F6",
              boxShadow:"0 0 8px #3B82F6",animation:"pulse-dot 1.4s infinite" }}/>
            <span style={{ color:"#93C5FD",fontWeight:700,fontSize:12,letterSpacing:"0.5px" }}>500+ ÉTABLISSEMENTS ACTIFS</span>
          </motion.div>

          <motion.h2 {...iv(0.08)} style={{
            fontFamily:"'Special Gothic Expanded One','DM Sans',system-ui",
            fontSize:"clamp(36px,6.5vw,80px)", fontWeight:400,
            margin:"0 0 22px", lineHeight:1.04, letterSpacing:"-0.03em",
            color:"#F5F5F7",
          }}>
            Prêt à transformer vos clients en{" "}
            <span style={{ background:"linear-gradient(135deg,#60A5FA,#06B6D4)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              ambassadeurs ?
            </span>
          </motion.h2>

          <motion.p {...iv(0.14)} style={{ color:"#6E6E73",fontSize:18,marginBottom:44,lineHeight:1.75 }}>
            Rejoignez 500+ établissements. Aucune carte bancaire requise.<br/>
            <strong style={{ color:"#A1A1A6" }}>Résultats visibles dès la première semaine.</strong>
          </motion.p>

          <motion.div {...iv(0.2)} style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:36 }}>
            <motion.div whileHover={{scale:1.05,y:-3}} whileTap={{scale:0.97}}>
              <Link href="/register" style={{ display:"inline-flex",alignItems:"center",gap:8,
                padding:"18px 44px",borderRadius:100,textDecoration:"none",
                background:"linear-gradient(135deg,#2563EB,#06B6D4)",color:"#fff",
                fontWeight:800,fontSize:17,letterSpacing:"-0.3px",
                boxShadow:"0 16px 48px rgba(37,99,235,0.45)" }}>
                Commencer gratuitement
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div {...iv(0.26)} style={{ display:"flex",alignItems:"center",justifyContent:"center",
            gap:28,flexWrap:"wrap" }}>
            {[[Ic.Shield,"RGPD"],[Ic.Check,"Sans engagement"],[Ic.Star,"4.9/5"]].map(([Icon,label],i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:7 }}>
                <Icon s={14} c="#52525B"/>
                <span style={{ fontSize:13,color:"#52525B",fontWeight:600 }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:t.footerBg,
        borderTop:`1px solid rgba(255,255,255,0.05)` }}>
        <div style={{ maxWidth:1100,margin:"0 auto",
          padding:"clamp(32px,4vw,52px) clamp(20px,6vw,80px)",
          display:"flex",justifyContent:"space-between",alignItems:"center",
          flexWrap:"wrap",gap:20 }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height:32,objectFit:"contain" }}/>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            {[["Connexion","/login"],["Créer un compte","/register"],["Dashboard","/dashboard"]].map(([label,href])=>(
              <Link key={label} href={href} style={{ color:t.footerText,textDecoration:"none",
                fontSize:13,fontWeight:500,padding:"6px 12px",borderRadius:8,
                transition:"color 0.2s" }}>{label}</Link>
            ))}
          </div>
          <div style={{ fontSize:13,color:"#3F3F46" }}>© 2026 VisiumBoost</div>
        </div>
      </footer>

      <style>{`
        * { box-sizing:border-box; }
        body { transition:background-color 0.4s ease, color 0.4s ease; }
        .bento-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        .bento-big  { grid-column:1/3; }
        .side-layer { display:none; }
        .side-obj   { display:block; }
        .split-grid { grid-template-columns:1fr 1fr; }
        .steps-grid { grid-template-columns:repeat(3,1fr); }
        .pricing-grid { grid-template-columns:repeat(3,1fr); }
        .nav-links  { display:flex; }
        @media(min-width:1480px) { .side-layer { display:block; } }
        @media(max-width:1024px) { .split-grid { grid-template-columns:1fr !important; } }
        @media(max-width:880px)  { .steps-grid { grid-template-columns:1fr !important; } .pricing-grid { grid-template-columns:1fr !important; } .nav-links { display:none !important; } }
        @media(max-width:720px)  { .bento-grid { grid-template-columns:1fr !important; } .bento-big { grid-column:1 !important; } }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }
      `}</style>
    </div>
  );
}
