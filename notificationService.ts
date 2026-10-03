import { prisma } from "../lib/prisma.js";

export type NotificationType =
  | "contact_due"
  | "contact_overdue"
  | "contact_pending"
  | "ready_for_good_news"
  | "travel_details_ready"
  | "good_news_attended"
  | "three_month_completion"
  | "task_reminder";

export interface NotificationPayload {
  recipientId: string;
  organizationId: string;
  recordId?: string;
  type: NotificationType;
  title: string;
  message: string;
  deliveryMethod: "email" | "sms" | "in_app";
}

/**
 * Generate and send notifications based on contact status and pipeline events
 */
export async function generateNotifications() {
  console.log("[Notifications] Starting notification generation...");

  const records = await prisma.record.findMany({
    include: {
      contact: true,
      assignedTo: true,
      organization: true,
    },
  });

  const now = new Date();
  const notifications: NotificationPayload[] = [];

  for (const record of records) {
    if (!record.assignedToId || !record.assignedTo) continue;

    const daysSinceUpdate = Math.floor(
      (now.getTime() - new Date(record.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Rule 1: Contact is due (7 days without contact)
    if (daysSinceUpdate === 7) {
      notifications.push({
        recipientId: record.assignedToId,
        organizationId: record.organizationId,
        recordId: record.id,
        type: "contact_due",
        title: "Follow-up Due",
        message: `${record.contact.firstName} ${record.contact.lastName} is due for follow-up contact.`,
        deliveryMethod: "in_app",
      });
    }

    // Rule 2: Contact is overdue (14 days without contact)
    if (daysSinceUpdate === 14) {
      notifications.push({
        recipientId: record.assignedToId,
        organizationId: record.organizationId,
        recordId: record.id,
        type: "contact_overdue",
        title: "Follow-up Overdue",
        message: `${record.contact.firstName} ${record.contact.lastName} is now overdue for contact.`,
        deliveryMethod: "email",
      });
    }

    // Rule 3: Contact is pending (30+ days without contact)
    if (daysSinceUpdate === 30) {
      notifications.push({
        recipientId: record.assignedToId,
        organizationId: record.organizationId,
        recordId: record.id,
        type: "contact_pending",
        title: "Critical: Contact Pending",
        message: `${record.contact.firstName} ${record.contact.lastName} has been pending for 30+ days. Immediate action required.`,
        deliveryMethod: "email",
      });
    }

    // Rule 4: Ready for Good News confirmation
    if (record.readyForGoodNews && !record.attendedGoodNews) {
      const goodNewsDetail = await prisma.goodNewsDetail.findFirst({
        where: { recordId: record.id, status: "confirmed" },
      });

      if (goodNewsDetail && goodNewsDetail.date) {
        const daysUntilEvent = Math.floor(
          (new Date(goodNewsDetail.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilEvent === 3) {
          notifications.push({
            recipientId: record.assignedToId,
            organizationId: record.organizationId,
            recordId: record.id,
            type: "ready_for_good_news",
            title: "Good News Reminder",
            message: `Reminder: ${record.contact.firstName} is scheduled for Good News in 3 days.`,
            deliveryMethod: "in_app",
          });
        }
      }
    }

    // Rule 5: Travel details are ready for manager review
    if (record.readyForGoodNews) {
      const travelDetail = await prisma.travelDetail.findFirst({
        where: { recordId: record.id, sentToManager: false },
      });

      if (travelDetail) {
        notifications.push({
          recipientId: record.assignedToId,
          organizationId: record.organizationId,
          recordId: record.id,
          type: "travel_details_ready",
          title: "Travel Details Ready",
          message: `Travel details for ${record.contact.firstName} are ready for manager review.`,
          deliveryMethod: "email",
        });
      }
    }
  }

  // Save notifications to database
  for (const notification of notifications) {
    try {
      await prisma.notification.create({
        data: {
          organizationId: notification.organizationId,
          recipientId: notification.recipientId,
          notificationType: notification.type,
          title: notification.title,
          message: notification.message,
          deliveryMethod: notification.deliveryMethod,
          recordId: notification.recordId,
          isRead: false,
          sentAt: new Date(),
        },
      });

      console.log(`[Notifications] Created ${notification.type} notification for ${notification.recipientId}`);
    } catch (error) {
      console.error(`[Notifications] Error creating notification:`, error);
    }
  }

  return notifications;
}

/**
 * Get unread notifications for a user
 */
export async function getUserNotifications(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: {
      recipientId: userId,
      isRead: false,
    },
    orderBy: { sentAt: "desc" },
    take: 50,
  });

  return notifications;
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  const notification = await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return notification;
}
