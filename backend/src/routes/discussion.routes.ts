import { Router } from "express";
import { DiscussionController } from "../controllers/discussion.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  validationMiddleware,
  validationSchemas,
} from "../middleware/validation.middleware";

const router = Router();
const controller = new DiscussionController();

router.use(authMiddleware);

router.get("/", controller.getUserDiscussions);

router.post(
  "/",
  validationMiddleware(validationSchemas.createDiscussion),
  controller.getOrCreateDiscussion,
);

router.get("/:id/messages", controller.getDiscussionMessages);

router.post(
  "/:id/messages",
  validationMiddleware(validationSchemas.createMessage),
  controller.createMessage,
);

router.put("/:id/read", controller.markDiscussionMessagesAsRead);

router.delete("/:id", controller.deleteDiscussion);

export default router;
