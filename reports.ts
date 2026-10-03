import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/summary", async (req, res) => {
  const { organizationId } = req.query;

  if (!organizationId || typeof organizationId !== "string") {
    return res.status(400).json({ error: "organizationId is required" });
  }

  const records = await prisma.record.findMany({
    where: { organizationId },
    include: { currentStage: true },
  });

  const stageBreakdown = {
    freshContacts: records.filter((record) => record.currentStage?.stageName === "Fresh Contacts").length,
    followUpFU1: records.filter((record) => record.followUpLevel === "FU1").length,
    followUpFU2: records.filter((record) => record.followUpLevel === "FU2").length,
    followUpFU3: records.filter((record) => record.followUpLevel === "FU3").length,
    followUpFU4: records.filter((record) => record.followUpLevel === "FU4").length,
    followUpFU5: records.filter((record) => record.followUpLevel === "FU5").length,
    contentSharing: records.filter((record) => record.contentShared).length,
    readyForGoodNews: records.filter((record) => record.readyForGoodNews).length,
    travelDetails: records.filter((record) => record.readyForGoodNews).length,
    attendedGoodNews: records.filter((record) => record.attendedGoodNews).length,
    completedThreeMonths: records.filter((record) => record.completedThreeMonths).length,
  };

  const due = records.filter((record) => {
    if (!record.updatedAt) return false;
    const diffDays = Math.floor(
      (Date.now() - new Date(record.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays >= 7 && diffDays < 14;
  }).length;

  const overdue = records.filter((record) => {
    if (!record.updatedAt) return false;
    const diffDays = Math.floor(
      (Date.now() - new Date(record.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays >= 14 && diffDays < 30;
  }).length;

  const pending = records.filter((record) => {
    if (!record.updatedAt) return false;
    const diffDays = Math.floor(
      (Date.now() - new Date(record.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays >= 30;
  }).length;

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
    include: {
      records: true,
    },
  });

  const teamReport = users.map((user) => ({
    userId: user.id,
    fullName: user.fullName,
    totalAssigned: user.records.length,
    due: user.records.filter((record) => {
      const diffDays = Math.floor(
        (Date.now() - new Date(record.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays >= 7 && diffDays < 14;
    }).length,
    overdue: user.records.filter((record) => {
      const diffDays = Math.floor(
        (Date.now() - new Date(record.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays >= 14 && diffDays < 30;
    }).length,
    pending: user.records.filter((record) => {
      const diffDays = Math.floor(
        (Date.now() - new Date(record.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays >= 30;
    }).length,
    readyForGoodNews: user.records.filter((record) => record.readyForGoodNews).length,
    completedThreeMonths: user.records.filter((record) => record.completedThreeMonths).length,
  }));

  return res.json({ teamReport });
});

router.get("/individual/:userId", async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { records: true },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const summary = {
    userId: user.id,
    fullName: user.fullName,
    totalAssigned: user.records.length,
    due: user.records.filter((record) => {
      const diffDays = Math.floor(
        (Date.now() - new Date(record.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays >= 7 && diffDays < 14;
    }).length,
    overdue: user.records.filter((record) => {
      const diffDays = Math.floor(
        (Date.now() - new Date(record.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays >= 14 && diffDays < 30;
    }).length,
    pending: user.records.filter((record) => {
      const diffDays = Math.floor(
        (Date.now() - new Date(record.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays >= 30;
    }).length,
    readyForGoodNews: user.records.filter((record) => record.readyForGoodNews).length,
    attendedGoodNews: user.records.filter((record) => record.attendedGoodNews).length,
    completedThreeMonths: user.records.filter((record) => record.completedThreeMonths).length,
  };

  return res.json({ summary });
});

export default router;
