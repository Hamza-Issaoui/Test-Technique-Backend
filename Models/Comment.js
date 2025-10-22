import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

  articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },

  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  content: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  
  path: { type: String, default: "" }, 
}, { timestamps: true });

commentSchema.index({ articleId: 1, parentId: 1, createdAt: 1 });

export default mongoose.model("Comment", commentSchema);