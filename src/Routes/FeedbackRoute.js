import express from "express"
import { createFeedback } from "../controllers/FeedbackController.js"

const router = express.Router();
router.post("/create",createFeedback);
export default router;