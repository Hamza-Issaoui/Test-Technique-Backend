import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    content: { type: String, required: true },
    image: { type: String },
    tags: [{ type: String, index: true }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index composé pour optimiser la recherche par auteur et tags
articleSchema.index({ author: 1, tags: 1 });

export default mongoose.model("Article", articleSchema);
