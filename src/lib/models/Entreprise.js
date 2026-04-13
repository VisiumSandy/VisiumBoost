import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  probability: { type: Number, required: true },
});

const EntrepriseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    nom: { type: String, required: true, trim: true },
    logo: { type: String, default: "" },
    couleur_principale: { type: String, default: "#6C5CE7" },
    couleur_secondaire: { type: String, default: "#00B894" },
    lien_avis: { type: String, default: "" },
    cta_text: { type: String, default: "Laissez-nous un avis et tentez votre chance !" },
    rewards: {
      type: [RewardSchema],
      default: [
        { id: "r1", name: "10% de réduction", probability: 40 },
        { id: "r2", name: "Dessert offert", probability: 25 },
        { id: "r3", name: "Café gratuit", probability: 20 },
        { id: "r4", name: "Cadeau surprise", probability: 5 },
        { id: "r5", name: "Tentez encore", probability: 10 },
      ],
    },
    totalScans: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Unique index on slug
EntrepriseSchema.index({ slug: 1 }, { unique: true });
EntrepriseSchema.index({ userId: 1 });

export default mongoose.models.Entreprise || mongoose.model("Entreprise", EntrepriseSchema);
