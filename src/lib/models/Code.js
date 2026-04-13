import mongoose from "mongoose";

const CodeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    code: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

CodeSchema.index({ userId: 1, used: 1 });

export default mongoose.models.Code || mongoose.model("Code", CodeSchema);
