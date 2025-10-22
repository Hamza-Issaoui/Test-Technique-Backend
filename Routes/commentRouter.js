
import { Router } from "express";
import commentController from "../Controllers/commentController.js";
import check_auth from "../Middlewares/check_authentification.js";

const route = Router();

route.post("/", check_auth, commentController.createComment);
route.get("/:articleId", commentController.getCommentsByArticle);

export default route;
