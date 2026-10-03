import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

function getDaysSince(updatedAt: Date | null | undefined, now = Date.now()) {
  if (!updatedAt) return 0;
  return Math.floor((now - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24));
}

function getDueBucket(updatedAt: Date | null | undefined) {
  const diffDays = getDaysSince(updatedAt);

  if (diffDays >= 30) return "pending";
  if (diffDays >= 14) return "overdue";
  if (diffDays >= 7) return "due";

  return "active";
}

router.get("/summary", async (req, res) => {
  const { organizationId } = req.query;

  if (!organizationId || typeof organizationId !== "string") {
    return res.status(400).json({ error: "organizationId is required" });
  }

  const records = await prisma.record.findMany({
    where: { organizationId },
    include: {
      currentStage: true,
      travelDetails: true,
    },
  });

  const stageBreakdown = {
    freshContacts: 0,
    followUpFU1: 0,
    followUpFU2: 0,
    followUpFU3: 0,
    followUpFU4: 0,
    followUpFU5: 0,
    contentSharing: 0,
    readyForGoodNews: 0,
    travelDetails: 0,
    attendedGoodNews: 0,
    completedThreeMonths: 0,
  };

  let due = 0;
  let overdue = 0;
  let pending = 0;

  for (const record of records) {
    if (record.currentStage?.stageName === "Fresh Contacts") {
      stageBreakdown.freshContacts += 1;
    }

    if (record.followUpLevel === "FU1") stageBreakdown.followUpFU1 += 1;
    if (record.followUpLevel === "FU2") stageBreakdown.followUpFU2 += 1;
    if (record.followUpLevel === "FU3") stageBreakdown.followUpFU3 += 1;
    if (record.followUpLevel === "FU4") stageBreakdown.followUpFU4 += 1;
    if (record.followUpLevel === "FU5") stageBreakdown.followUpFU5 += 1;

    if (record.contentShared) stageBreakdown.contentSharing += 1;
    if (record.readyForGoodNews) stageBreakdown.readyForGoodNews += 1;
    if (record.travelDetails.length > 0) stageBreakdown.travelDetails += 1;
    if (record.attendedGoodNews) stageBreakdown.attendedGoodNews += 1;
    if (record.completedThreeMonths) stageBreakdown.completedThreeMonths += 1;

    const bucket = getDueBucket(record.updatedAt);
    if (bucket === "due") due += 1;
    if (bucket === "overdue") overdue += 1;
    if (bucket === "pending") pending += 1;
  }

  const summary = {
    totalContacts: records.length,
    due,
    overdue,
    pending,
    readyForGoodNews: stageBreakdown.readyForGoodNews,
    attendedGoodNews: stageBreakdown.attendedGoodNews,
    completedThreeMonths: stageBreakdown.completedThreeMonths,
    stageBreakdown,
  };

  return res.json({ summary });
});

router.get("/team", async (req, res) => {
  const { organizationId } = req.query;

  if (!organizationId || typeof organizationId !== "string") {
    return res.status(400).json({ error: "organizationId is required" });
  }

  const users = await prisma.user.findMany({
    where: { organizationId },
    select: {
      id: true,
      fullName: true,
      records: {
        select: {
          updatedAt: true,
          readyForGoodNews: true,
          attendedGoodNews: true,
          completedThreeMonths: true,
        },
      },
    },
  });

  const teamReport = users.map((user) => {
    let due = 0;
    let overdue = 0;
    let pending = 0;
    let readyForGoodNews = 0;
    let completedThreeMonths = 0;

    for (const record of user.records) {
      const bucket = getDueBucket(record.updatedAt);
      if (bucket === "due") due += 1;
      if (bucket === "overdue") overdue += 1;
      if (bucket === "pending") pending += 1;
      if (record.readyForGoodNews) readyForGoodNews += 1;
      if (record.completedThreeMonths) completedThreeMonths += 1;
    }

    return {
      userId: user.id,
      fullName: user.fullName,
      totalAssigned: user.records.length,
      due,
      overdue,
      pending,
      readyForGoodNews,
      completedThreeMonths,
    };
  });

  return res.json({ teamReport });
});

router.get("/individual/:userId", async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      records: {
        select: {
          updatedAt: true,
          readyForGoodNews: true,
          attendedGoodNews: true,
          completedThreeMonths: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  let due = 0;
  let overdue = 0;
  let pending = 0;
  let readyForGoodNews = 0;
  let attendedGoodNews = 0;
  let completedThreeMonths = 0;

  for (const record of user.records) {
    const bucket = getDueBucket(record.updatedAt);
    if (bucket === "due") due += 1;
    if (bucket === "overdue") overdue += 1;
    if (bucket === "pending") pending += 1;
    if (record.readyForGoodNews) readyForGoodNews += 1;
    if (record.attendedGoodNews) attendedGoodNews += 1;
    if (record.completedThreeMonths) completedThreeMonths += 1;
  }

  const summary = {
    userId: user.id,
    fullName: user.fullName,
    totalAssigned: user.records.length,
    due,
    overdue,
    pending,
    readyForGoodNews,
    attendedGoodNews,
    completedThreeMonths,
  };

  return res.json({ summary });
});

export default router;
