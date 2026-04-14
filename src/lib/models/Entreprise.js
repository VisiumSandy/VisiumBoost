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
    couleur_principale: { type: String, default: "#3B82F6" },
    couleur_secondaire: { type: String, default: "#0EA5E9" },
    lien_avis: { type: String, default: "" },
    cta_text: { type: String, default: "Laissez-nous un avis et tentez votre chance !" },
    rewards: {
      type: [RewardSchema],
      default: [],
    },
    totalScans: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

EntrepriseSchema.index({ userId: 1 });

export default mongoose.models.Entreprise || mongoose.model("Entreprise", EntrepriseSchema);
