import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin", "client"], default: "client" },
    plan: { type: String, enum: ["free", "starter", "pro"], default: "free" },
    planExpiry: { type: Date, default: null },
    businessName: { type: String, trim: true, default: "" },
    googleLink: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    trialEndsAt: { type: Date, default: null },
    stripeCustomerId: { type: String, default: null },
    stripeSubscriptionId: { type: String, default: null },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    active: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    // Stats cached
    totalScans: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
