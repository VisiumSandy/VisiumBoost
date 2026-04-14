import mongoose from "mongoose";

const WheelConfigSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    googleLink: { type: String, default: "" },
    primaryColor: { type: String, default: "#3B82F6" },
    secondaryColor: { type: String, default: "#0EA5E9" },
    ctaText: { type: String, default: "Laissez-nous un avis et tentez votre chance !" },
    logoUrl: { type: String, default: "" },
    rewards: {
      type: [{ id: String, name: String, prob: Number }],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.WheelConfig || mongoose.model("WheelConfig", WheelConfigSchema);
