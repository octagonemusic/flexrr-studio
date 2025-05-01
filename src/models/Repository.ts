import mongoose from "mongoose";

const RepositorySchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    githubUrl: String,
    envVars: {
      type: Map,
      of: String,
    },
    version: {
      type: String,
      default: "1.0.0",
    },
    status: {
      type: String,
      enum: ["active", "deleted_on_github", "deleted"],
      default: "active",
    },
  },
  { timestamps: true },
);

export const Repository =
  mongoose.models.Repository || mongoose.model("Repository", RepositorySchema);
