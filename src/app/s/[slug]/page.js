import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Entreprise from "@/lib/models/Entreprise";
import User from "@/lib/models/User";
import PlayClient from "./PlayClient";
import { isAccessAllowed } from "@/lib/utils";

// Server component — fetch data by slug
export async function generateMetadata({ params }) {
  const { slug } = params;
  try {
    await connectDB();
    const e = await Entreprise.findOne({ slug }).lean();
    if (!e) return { title: "Page introuvable — VisiumBoost" };
    return {
      title: `${e.nom} — Tournez la roue !`,
      description: e.cta_text,
    };
  } catch {
    return { title: "VisiumBoost" };
  }
}

function WheelBlocked({ nom, couleur }) {
  const c = couleur || "#2563EB";
  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#F8FAFC", fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: "24px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: "48px 36px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)", textAlign: "center",
        maxWidth: 420, width: "100%",
        border: "1.5px solid #E2E8F0",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: `${c}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: "0 0 10px", letterSpacing: "-0.3px" }}>
          Roue indisponible
        </h2>
        <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.65, margin: "0 0 8px" }}>
          La roue de <strong style={{ color: "#0F172A" }}>{nom}</strong> n&apos;est pas accessible pour le moment.
        </p>
        <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
          Veuillez contacter l&apos;établissement — il doit activer son abonnement VisiumBoost pour que la roue soit disponible.
        </p>
      </div>
    </div>
  );
}

export default async function SubdomainPage({ params }) {
  const { slug } = params;

  let entreprise = null;
  try {
    await connectDB();
    entreprise = await Entreprise.findOne({ slug: slug.toLowerCase(), active: true }).lean();
    if (entreprise) {
      // Track scan
      await Entreprise.updateOne({ _id: entreprise._id }, { $inc: { totalScans: 1 } });
    }
  } catch (err) {
    console.error("SubdomainPage fetch error:", err);
  }

  if (!entreprise) {
    notFound();
  }

  // Check owner trial / subscription access
  let ownerBlocked = false;
  try {
    const owner = await User.findById(entreprise.userId).select("plan trialEndsAt role").lean();
    ownerBlocked = !isAccessAllowed(owner);
  } catch {
    ownerBlocked = false;
  }

  if (ownerBlocked) {
    return <WheelBlocked nom={entreprise.nom} couleur={entreprise.couleur_principale} />;
  }

  // Serialize for client
  const data = {
    _id:  entreprise._id.toString(),
    nom:  entreprise.nom,
    slug: entreprise.slug,
    logo: entreprise.logo || "",
    couleur_principale: entreprise.couleur_principale || "#6C5CE7",
    couleur_secondaire: entreprise.couleur_secondaire || "#00B894",
    lien_avis: entreprise.lien_avis || "",
    cta_text:  entreprise.cta_text  || "Laissez-nous un avis et tentez votre chance !",
    rewards: (entreprise.rewards || []).map((r) => ({
      id: r.id || r._id?.toString(),
      name: r.name,
      probability: r.probability,
    })),
    // Theme — new nested object, falls back to legacy flat fields in PlayClient
    theme: entreprise.theme || {},
    // Legacy flat fields (backwards compat)
    wheel_segment_colors: entreprise.wheel_segment_colors || [],
    wheel_border_color:   entreprise.wheel_border_color   || "",
    wheel_center_color:   entreprise.wheel_center_color   || "",
    wheel_center_logo:    entreprise.wheel_center_logo    || "",
    wheel_font:           entreprise.wheel_font           || "",
    wheel_size:           entreprise.wheel_size           || 0,
    page_bg:              entreprise.page_bg              || "",
    page_bg_type:         entreprise.page_bg_type         || "",
    page_bg_gradient:     entreprise.page_bg_gradient     || "",
    page_banner:          entreprise.page_banner          || "",
    page_title:           entreprise.page_title           || "",
    page_welcome:         entreprise.page_welcome         || "",
    page_btn_color:       entreprise.page_btn_color       || "",
    page_btn_text:        entreprise.page_btn_text        || "",
    page_thanks:          entreprise.page_thanks          || "",
    page_text_color:      entreprise.page_text_color      || "",
  };

  return <PlayClient entreprise={data} />;
}
