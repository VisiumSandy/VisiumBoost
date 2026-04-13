import mongoose from "mongoose";

const WheelConfigSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    googleLink: { type: String, default: "" },
    primaryColor: { type: String, default: "#6C5CE7" },
    secondaryColor: { type: String, default: "#00B894" },
    ctaText: { type: String, default: "Laissez-nous un avis et tentez votre chance !" },
    logoUrl: { type: String, default: "" },
    rewards: {
      type: [
        {
          id: String,
          name: String,
          prob: Number,
        },
      ],
      default: [
        { id: "r1", name: "10% de réduction", prob: 40 },
        { id: "r2", name: "Dessert offert", prob: 25 },
        { id: "r3", name: "Café gratuit", prob: 20 },
        { id: "r4", name: "Cadeau surprise", prob: 5 },
        { id: "r5", name: "Tentez encore", prob: 10 },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.models.WheelConfig || mongoose.model("WheelConfig", WheelConfigSchema);
