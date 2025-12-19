import User from "../Models/user.js"
import Feedback from "../Models/Feedback.js";

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalFeedbacks = await Feedback.countDocuments();
    const avgRatingAgg = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const avgRating = avgRatingAgg[0]?.avgRating || 0;

    res.json({ totalUsers, totalAdmins, totalFeedbacks, avgRating });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.json({ users });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.json({ message: "Role updated", user });
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    await Feedback.deleteMany({ userId: id });
    res.json({ message: "User and associated feedbacks deleted" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();

    // Safely populate user info
    const feedbacksWithUser = await Promise.all(
      feedbacks.map(async (fb) => {
        let user = null;
        try {
          if (fb.userId) {
            user = await User.findById(fb.userId).select("name email");
          }
        } catch (e) {
          console.warn("Invalid userId in feedback:", fb._id);
        }
        return {
          ...fb.toObject(),
          userId: user || null,
        };
      })
    );

    res.json({ feedbacks: feedbacksWithUser });
  } catch (err) {
    console.error("Get feedbacks error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await Feedback.findByIdAndDelete(id);
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    console.error("Delete feedback error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
