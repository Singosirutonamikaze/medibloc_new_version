import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  validationMiddleware,
  validationSchemas,
} from "../middleware/validation.middleware";

const router = Router();
const controller = new NotificationController();

router.use(authMiddleware);

router.get("/", controller.getAllNotifications);

router.get("/user/:userId", controller.getUserNotifications);

router.post(
  "/",
  validationMiddleware(validationSchemas.createNotification),
  controller.createNotification,
);

router.get("/:id", controller.getNotificationById);

router.put("/:id/read", controller.markAsRead);

router.put("/user/:userId/read-all", controller.markAllAsRead);

router.delete("/:id", controller.deleteNotification);

export default router;
