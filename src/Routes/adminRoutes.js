
import express from "express";
import * as adminController from "../controllers/adminController.js";
import { authenticate, isAdmin } from "../MiddleWare/auth.js";

const router = express.Router();

router.use(authenticate, isAdmin);

router.get("/stats", adminController.getStats);

router.get("/users", adminController.getUsers);
router.patch("/users/:id/role", adminController.updateRole);
router.delete("/users/:id", adminController.deleteUser);

router.get("/feedbacks", adminController.getFeedbacks);
router.delete("/feedbacks/:id", adminController.deleteFeedback);

export default router;
