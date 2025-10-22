import { Router } from "express";
import notificationController from "../Controllers/notificationContoller.js";
import check_auth from "../Middlewares/check_authentification.js";

const route = Router();

route.get("/", check_auth, notificationController.getUserNotifications);
route.patch(
  "/:id/seen",
  check_auth,
  notificationController.markNotificationSeen
);
route.patch("/seen-all", check_auth, notificationController.markAllSeen);

export default route;
