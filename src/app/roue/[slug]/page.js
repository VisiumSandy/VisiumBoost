import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Entreprise from "@/lib/models/Entreprise";
import RoueClient from "./RoueClient";

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

export default async function RouePage({ params }) {
  const { slug } = params;

  let entreprise = null;
  try {
    await connectDB();
    entreprise = await Entreprise.findOne({ slug: slug.toLowerCase(), active: true }).lean();
  } catch (err) {
    console.error("RouePage fetch error:", err);
  }

  if (!entreprise) notFound();

  const data = {
    _id: entreprise._id.toString(),
    nom: entreprise.nom,
    slug: entreprise.slug,
    logo: entreprise.logo || "",
    couleur_principale: entreprise.couleur_principale || "#6C5CE7",
    couleur_secondaire: entreprise.couleur_secondaire || "#00B894",
    lien_avis: entreprise.lien_avis || "",
    cta_text: entreprise.cta_text || "Laissez-nous un avis et tentez votre chance !",
    rewards: (entreprise.rewards || []).map((r) => ({
      id: r.id || r._id?.toString(),
      name: r.name,
      probability: r.probability,
    })),
  };

  return <RoueClient entreprise={data} />;
}
