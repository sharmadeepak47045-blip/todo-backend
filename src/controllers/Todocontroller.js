import Task from "../Models/task.js";


export const getTodos = async (req, res) => {
  try {
    const todos = await Task.find({ userId: req.user._id });
    res.status(200).json({ message: "Todos fetched", todos });
  } catch (err) {
    res.status(500).json({ message: "Error fetching todos", err });
  }
};


export const addTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const todo = await Task.create({ title, userId: req.user._id });
    res.status(201).json({ message: "Todo added", todo });
  } catch (err) {
    res.status(500).json({ message: "Error adding todo", err });
  }
};

export const editTodo = async (req, res) => {
  try {
    const updatedTodo = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title: req.body.title },
      { new: true }
    );

    if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });

    res.status(200).json({ message: "Todo updated", updatedTodo });
  } catch (err) {
    res.status(500).json({ message: "Error updating todo", err });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deletedTodo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting todo", err });
  }
};

export const deleteAllTodos  = async (req, res) => {
  try {
    await Task.deleteMany({ userId: req.user._id });
    res.status(200).json({ message: "All todos deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting all todos", err });
  }
};


export const updateTodoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body; 

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        message: "completed must be true or false",
      });
    }

    const todo = await Task.findOneAndUpdate(
      { _id: id, userId: req.user._id }, 
      { completed },                    
      { new: true }                     
    );

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.status(200).json({ message: "Todo status updated", todo });

  } catch (err) {
    console.error("updateTodoStatus error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


