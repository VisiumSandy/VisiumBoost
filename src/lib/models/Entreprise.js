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
    // ── Theme object (new — supersedes flat wheel_*/page_* fields) ────
    theme: { type: mongoose.Schema.Types.Mixed, default: {} },
    // ── Wheel customization (legacy flat fields, kept for backwards compat) ──────────────────────────────────────────
    wheel_segment_colors: { type: [String], default: [] },
    wheel_border_color:   { type: String,  default: "#ffffff" },
    wheel_center_color:   { type: String,  default: "#ffffff" },
    wheel_center_logo:    { type: String,  default: "" },
    wheel_font:           { type: String,  default: "DM Sans" },
    wheel_size:           { type: Number,  default: 360 },
    // ── Page customization ───────────────────────────────────────────
    page_bg:          { type: String, default: "#ffffff" },
    page_bg_type:     { type: String, default: "color" },   // "color" | "gradient"
    page_bg_gradient: { type: String, default: "" },
    page_banner:      { type: String, default: "" },
    page_title:       { type: String, default: "" },
    page_welcome:     { type: String, default: "" },
    page_btn_color:   { type: String, default: "" },
    page_btn_text:    { type: String, default: "" },
    page_thanks:      { type: String, default: "" },
    page_text_color:  { type: String, default: "#0F0F1A" },
  },
  { timestamps: true }
);

EntrepriseSchema.index({ userId: 1 });

export default mongoose.models.Entreprise || mongoose.model("Entreprise", EntrepriseSchema);
