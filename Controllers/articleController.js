import Article from "../Models/Article.js";
import fs from "fs";
import path from "path";

const articleController = {
/**
 * Create a new article
 */
createArticle : async (req, res) => {
  try {
    const { title, content, tags, author } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: "Le titre et le contenu sont requis." });
    }

    if (!author) {
      return res.status(400).json({ message: "L'auteur est requis." });
    }

    // Handle uploaded image path
    let imagePath = null;
    if (req.file) {
      imagePath = path.posix.join("/uploads/articles", req.file.filename);
    }

    const formattedTags = tags
      ? tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
      : [];

    const newArticle = await Article.create({
      title,
      content,
      tags: formattedTags,
      image: imagePath,
      author,
    });

    return res.status(201).json({
      message: "Article créé avec succès",
      article: newArticle,
    });
  } catch (error) {
    console.error("❌ Erreur création article:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la création de l'article.",
      error: error.message,
    });
  }
},

/**
 * Get all articles
 */
getArticles : async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
  
      const query = search
        ? { title: { $regex: search, $options: "i" } }
        : {};
  
      const articles = await Article.find(query)
        .select("title image tags author createdAt")
        .populate("author", "name role")
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .lean();
  
      res.status(200).json(articles);
    } catch (error) {
      res.status(500).json({ message: "Erreur de récupération", error });
    }
  },

  /**
 * Get a single article by ID
 */
  updateArticle : async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, tags , author} = req.body;
  
      const article = await Article.findById(id).populate("author");
  
      if (!article) {
        return res.status(404).json({ message: "Article introuvable" });
      }
  
      // Vérification des permissions
      const allowedRoles = ["Rédacteur", "Editeur", "Admin"];

      if (!allowedRoles.includes(req.user.user.role)) {
        return res.status(403).json({ message: "Non autorisé à modifier cet article" });
      }

      // Si c'est un rédacteur, il ne peut modifier que ses propres articles
      if (
        req.user.user.role === "Rédacteur" &&
        article.author._id.toString() !== req.user.id
      ) {
        return res.status(403).json({ message: "Non autorisé à modifier cet article" });
      }
  
      // Préparer les champs à mettre à jour
      const updateFields = {};
      if (title) updateFields.title = title;
      if (content) updateFields.content = content;
      if (tags) updateFields.tags = tags.split(",").map((t) => t.trim());
  
      // Gestion de l’image
      if (req.file) {
        // Supprimer l’ancienne image si elle existe
        if (article.image) {
          const oldImagePath = path.join(process.cwd(), "uploads", "articles", path.basename(article.image));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
  
        // Nouvelle image
        updateFields.image = path.join("/uploads/articles", req.file.filename);
      }
  
      // Mise à jour de l’article
      const updatedArticle = await Article.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
      ).lean();
  
      res.status(200).json({
        message: "Article mis à jour avec succès",
        article: updatedArticle,
      });
    } catch (error) {
      console.error("Erreur mise à jour article:", error);
      res.status(500).json({
        message: "Erreur lors de la mise à jour de l’article",
        error: error.message,
      });
    }
  },

/**
 * Get a single article by ID
 */
 getArticleById : async (req, res) => {
  try {
    const article = await Article.findById({
      _id: req.params.id,
    }).populate("author", "name avatar");
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: "Error fetching article" });
  }
},

/**
 * Delete an article (only by Admin)
 */
 deleteArticle : async (req, res) => {
    try {
      const { id } = req.params;
      if (req.user.user.role !== "Admin") {
        return res.status(403).json({ message: "Seul un Admin peut supprimer" });
      }
  
      await Article.findByIdAndDelete(id);
  
      res.status(200).json({ message: "Article supprimé" });
    } catch (error) {
      res.status(500).json({ message: "Erreur suppression", error });
    }
  },
}; 
export default articleController;
