import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { generateNotifications, getUserNotifications, markNotificationAsRead } from "../services/notificationService.js";

const router = Router();

/**
 * GET /api/notifications/generate
 * Trigger notification generation for all contacts
 */
router.post("/generate", async (_req, res) => {
  try {
    const notifications = await generateNotifications();
    res.json({ success: true, count: notifications.length, notifications });
  } catch (error) {
    console.error("Error generating notifications:", error);
    res.status(500).json({ error: "Failed to generate notifications" });
  }
});

/**
 * GET /api/notifications/:userId
 * Get unread notifications for a specific user
 */
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await getUserNotifications(userId);
    res.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

/**
 * PUT /api/notifications/:notificationId/read
 * Mark a notification as read
 */
router.put("/:notificationId/read", async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await markNotificationAsRead(notificationId);
    res.json({ notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

export default router;
