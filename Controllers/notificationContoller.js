import Notification from "../Models/Notification.js";

const notificationController = {
/**
 * Get all notifications for a user
 */
 getUserNotifications : async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50); // limit to last 50 for performance
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
},

/**
 * Mark a single notification as seen
 */
 markNotificationSeen : async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findById(id);
    if (!notif) return res.status(404).json({ message: "Notification not found" });

    if (notif.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notif.seen = true;
    await notif.save();
    res.json({ message: "Notification marked as seen" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating notification" });
  }
},

/**
 * Mark all notifications as seen
 */
 markAllSeen : async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.updateMany({ userId }, { seen: true });
    res.json({ message: "All notifications marked as seen" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating notifications" });
  }
}
};

export default notificationController;