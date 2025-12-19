import Feedback from "../Models/Feedback.js";

export const createFeedback = async (req, res) => {
  try {
    const { name, email, rating, feedback } = req.body;

    if (!name || !email || !rating || !feedback) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newFeedback = await Feedback.create({
      name,
      email,
      rating,
      feedback,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: newFeedback,
    });
  } catch (error) {
    console.log("Feedback Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
