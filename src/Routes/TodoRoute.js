import express from "express";
import {
  getTodos,
  addTodo,
  editTodo,
  deleteTodo,
  deleteAllTodos,
  updateTodoStatus,
} from "../controllers/Todocontroller.js";

import { authenticate } from "../MiddleWare/auth.js";

const router = express.Router();

// Protected routes
router.get("/todos", authenticate, getTodos);
router.post("/add", authenticate, addTodo);
router.put("/edit/:id", authenticate, editTodo);
router.delete("/delete/:id", authenticate, deleteTodo);
router.delete("/delete-all", authenticate, deleteAllTodos);

router.patch("/todos/:id", authenticate, updateTodoStatus);


export default router;
