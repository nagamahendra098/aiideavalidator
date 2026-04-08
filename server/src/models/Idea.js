import mongoose from "mongoose";

const IdeaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "analyzing", "done", "error"],
      default: "pending",
    },
    report: {
      problemSummary: String,
      customerPersona: String,
      marketOverview: String,
      competitors: [String],
      techStack: [String],
      riskLevel: { type: String, enum: ["Low", "Medium", "High"] },
      profitabilityScore: { type: Number, min: 0, max: 100 },
      fullAnalysis: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Idea", IdeaSchema);
