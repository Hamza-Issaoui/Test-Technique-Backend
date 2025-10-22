import { Router } from "express";
import articleController from "../Controllers/articleController.js";
import check_auth from "../Middlewares/check_authentification.js";
import upload from "../Middlewares/upload.js";

const route = Router();

route.post("/", check_auth, upload.single("image"), articleController.createArticle);
route.get("", articleController.getArticles);
route.get("/:id", articleController.getArticleById);
route.put("/:id", check_auth, upload.single("image"), articleController.updateArticle);

route.delete("/:id", check_auth, articleController.deleteArticle);

export default route;
