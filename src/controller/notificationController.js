import db from '../database/models/index.js';
const Notification  = db.Notification;

// Retrieve all notifications for the logged-in user
export const getAllNotifications = async (req, res) => {
  const userId = req.user.id;
 const { page = 1, limit = 10 } = req.query;

  try {
    const notifications= await Notification.findAndPaginateAll({
      page,
      limit,
      where: { user_id: userId },
    });
   const totalNofications = notifications.length;
    res.status(200).json({message: `Notifications retrieved successfully, total notifications: ${totalNofications}`, notifications});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving notifications' });
  }
};

// Mark a notification as read for the logged-in user
export const markNotificationAsRead = async (req, res) => {
  const notificationId = req.params.notificationId;
  const userId = req.user.id;

  try {
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.is_read = true;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};
// Mark all as read for the logged-in user
export const markAllAsRead = async (req, res) => {
  const userId = req.user.id;
  console.log(userId)
  // Find notifications that are unread and belong to this user
  try {
    const notifications = await Notification.update(
      { is_read: true },
      {
        where: {
          user_id: userId,
          is_read: false,
        },
      }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking notifications as read' });
  }
};


// Delete a notification for the logged-in user
export const deleteNotification = async (req, res) => {
  const notificationId = req.params.notificationId;
  const userId = req.user.id;
  try {
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.destroy();

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
};

export default {
    getAllNotifications,
    markNotificationAsRead,
    deleteNotification
}
