import Comment from "../Models/Comment.js";
import Article from "../Models/Article.js";
import Notification from "../Models/Notification.js";
import { io } from "../Sockets/socketHandler.js";
import sanitizeHtml from "sanitize-html";

const commentController = {
  /**
   * Create a new comment or reply on an article.
   * @param {Object} req - Request body containing articleId, content, and optional parentId
   * @param {Object} res - Response object
   */
  createComment: async (req, res) => {
    try {
      const { articleId, content, parentId } = req.body;
      const authorId = req.user.id;

      const safeContent = sanitizeHtml(content, {
        allowedTags: [],
        allowedAttributes: {},
      });

      let path = "root";
      if (parentId) {
        const parent = await Comment.findById(parentId);
        if (!parent)
          return res.status(404).json({ message: "Parent comment not found" });
        path = `${parent.path}/${parentId}`;
      }

      const comment = await Comment.create({
        articleId,
        authorId,
        content: safeContent,
        parentId,
        path,
      });

      // notification pour l'auteur de l'article
      const article = await Article.findById(articleId).populate("author");
      if (article && article.author._id.toString() !== authorId.toString()) {
        let message = "";
        if (!parentId) {
          message = `${req.user.user.firstname} ${req.user.user.lastname} a commenté votre article.`;
        } else {
          message = `${req.user.user.firstname} ${req.user.user.lastname} a répondu à votre commentaire.`;
        }

        const notif = await Notification.create({
          userId: article.author._id,
          type: parentId ? "reply" : "comment",
          payload: {
            articleId,
            commentId: comment._id,
            from: authorId,
            message,
          },
        });

        io.to(`user:${article.author._id}`).emit("user-notification", notif);
      }

      // broadcast new comment to article room
      io.to(`article:${articleId}`).emit("newComment", comment);

      res.status(201).json(comment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating comment" });
    }
  },

  /**
   * Get all comments for a specific article.
   * @param {Object} req - Request params containing articleId
   * @param {Object} res - Response object
   */
  getCommentsByArticle: async (req, res) => {
    try {
      const { articleId } = req.params;

      // Fetch all comments for the article
      const comments = await Comment.find({ articleId })
        .sort({ createdAt: 1 })
        .lean();

      // Create a map to hold comments by their _id
      const commentMap = {};
      comments.forEach((comment) => {
        comment.children = []; // prepare children array
        commentMap[comment._id] = comment;
      });

      // Build nested structure
      const rootComments = [];
      comments.forEach((comment) => {
        if (comment.parentId) {
          // If it has a parent, push into parent's children array
          const parent = commentMap[comment.parentId];
          if (parent) parent.children.push(comment);
        } else {
          // If no parent, it's a root comment
          rootComments.push(comment);
        }
      });

      res.json(rootComments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching comments" });
    }
  },
};
export default commentController;
