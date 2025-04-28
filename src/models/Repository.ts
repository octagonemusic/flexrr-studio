import mongoose from "mongoose";

const RepositorySchema = new mongoose.Schema({
  name: String,
  description: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

export const Repository = mongoose.models.Repository || mongoose.model("Repository", RepositorySchema);