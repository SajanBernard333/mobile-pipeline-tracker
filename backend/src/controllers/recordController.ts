import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

function computeContactStatus(updatedAt: Date | null | undefined) {
  if (!updatedAt) return "active";

  const diffDays = Math.floor(
    (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays >= 30) return "pending";
  if (diffDays >= 14) return "overdue";
  if (diffDays >= 7) return "due";

  return "active";
}

export async function getRecords(req: Request, res: Response) {
  const { organizationId } = req.query;

  if (!organizationId || typeof organizationId !== "string") {
    return res.status(400).json({ error: "organizationId is required" });
  }

  const records = await prisma.record.findMany({
    where: { organizationId },
    include: {
      contact: true,
      currentStage: true,
      assignedTo: true,
      tasks: true,
      notes: { orderBy: { createdAt: "desc" } },
      contentShares: { include: { content: true } },
      goodNewsDetails: true,
      travelDetails: true,
    },
  });

  const recordsWithStatus = records.map((record) => ({
    ...record,
    computedStatus: computeContactStatus(record.updatedAt),
  }));

  return res.json({ records: recordsWithStatus });
}

export async function getRecordById(req: Request, res: Response) {
  const { id } = req.params;

  const record = await prisma.record.findUnique({
    where: { id },
    include: {
      contact: { include: { familyMembers: true } },
      currentStage: true,
      assignedTo: true,
      tasks: true,
      notes: { orderBy: { createdAt: "desc" } },
      contentShares: { include: { content: true } },
      goodNewsDetails: true,
      travelDetails: true,
    },
  });

  if (!record) {
    return res.status(404).json({ error: "Record not found" });
  }

  return res.json({
    record: {
      ...record,
      computedStatus: computeContactStatus(record.updatedAt),
    },
  });
}

export async function createRecord(req: Request, res: Response) {
  const { organizationId, contactId, pipelineId, currentStageId, assignedToId, title } = req.body;

  if (!organizationId || !contactId || !pipelineId || !currentStageId) {
    return res.status(400).json({
      error: "organizationId, contactId, pipelineId, and currentStageId are required",
    });
  }

  const record = await prisma.record.create({
    data: {
      organizationId,
      contactId,
      pipelineId,
      currentStageId,
      assignedToId,
      title: title || "New Contact",
      status: "active",
      followUpLevel: "FU1",
    },
    include: {
      contact: true,
      currentStage: true,
      assignedTo: true,
    },
  });

  return res.status(201).json({ record });
}

export async function moveToNextStage(req: Request, res: Response) {
  const { recordId, nextStageId, notes } = req.body;

  if (!recordId || !nextStageId) {
    return res.status(400).json({ error: "recordId and nextStageId are required" });
  }

  const record = await prisma.record.findUnique({
    where: { id: recordId },
    include: { currentStage: true },
  });

  if (!record) {
    return res.status(404).json({ error: "Record not found" });
  }

  await prisma.recordStageHistory.create({
    data: {
      recordId,
      fromStageId: record.currentStageId,
      toStageId: nextStageId,
      notes,
    },
  });

  const updatedRecord = await prisma.record.update({
    where: { id: recordId },
    data: {
      currentStageId: nextStageId,
      updatedAt: new Date(),
    },
    include: { currentStage: true, contact: true },
  });

  return res.json({ record: updatedRecord });
}

export async function updateFollowUpLevel(req: Request, res: Response) {
  const { recordId, level } = req.body;

  if (!recordId || !level) {
    return res.status(400).json({ error: "recordId and level are required" });
  }

  const validLevels = ["FU1", "FU2", "FU3", "FU4", "FU5"];
  if (!validLevels.includes(level)) {
    return res.status(400).json({ error: "Invalid follow-up level" });
  }

  const record = await prisma.record.update({
    where: { id: recordId },
    data: {
      followUpLevel: level,
      updatedAt: new Date(),
    },
  });

  return res.json({ record });
}

export async function shareContent(req: Request, res: Response) {
  const { recordId, contentIds, sharedById } = req.body;

  if (!recordId || !Array.isArray(contentIds) || contentIds.length === 0) {
    return res.status(400).json({
      error: "recordId and contentIds array are required",
    });
  }

  const contentShares = await Promise.all(
    contentIds.map((contentId: string) =>
      prisma.contentShare.create({
        data: {
          recordId,
          contentId,
          sharedById,
          status: "shared",
        },
        include: { content: true },
      })
    )
  );

  const record = await prisma.record.update({
    where: { id: recordId },
    data: {
      contentShared: true,
      updatedAt: new Date(),
    },
  });

  return res.json({ record, contentShares });
}

export async function confirmReadinessForGoodNews(req: Request, res: Response) {
  const { recordId, goodNewsDate, attendanceType } = req.body;

  if (!recordId) {
    return res.status(400).json({ error: "recordId is required" });
  }

  const record = await prisma.record.findUnique({
    where: { id: recordId },
    include: { contact: { include: { familyMembers: true } } },
  });

  if (!record) {
    return res.status(404).json({ error: "Record not found" });
  }

  if (!record.contentShared) {
    return res.status(400).json({
      error: "Content must be shared before confirming readiness",
    });
  }

  const goodNewsDetail = await prisma.goodNewsDetail.create({
    data: {
      recordId,
      status: "confirmed",
      date: goodNewsDate ? new Date(goodNewsDate) : new Date(),
      attendanceType,
      confirmedAt: new Date(),
    },
  });

  const travelDetail = await prisma.travelDetail.create({
    data: {
      recordId,
      goodNewsDetailId: goodNewsDetail.id,
      contactName: `${record.contact.firstName} ${record.contact.lastName}`,
      familyMembers: record.contact.familyMembers.map((familyMember) => ({
        name: `${familyMember.firstName} ${familyMember.lastName || ""}`.trim(),
        relationship: familyMember.relationship,
        isPrimary: familyMember.isPrimaryContact,
      })),
      departureLocation: "To be determined",
      arrivalLocation: "Good News Event Location",
      departureDate: goodNewsDate ? new Date(goodNewsDate) : new Date(),
    },
  });

  const updatedRecord = await prisma.record.update({
    where: { id: recordId },
    data: {
      readyForGoodNews: true,
      updatedAt: new Date(),
    },
  });

  return res.json({
    record: updatedRecord,
    goodNewsDetail,
    travelDetail,
  });
}

export async function sendTravelDetailsToManager(req: Request, res: Response) {
  const { travelDetailId, managerId } = req.body;

  if (!travelDetailId || !managerId) {
    return res.status(400).json({
      error: "travelDetailId and managerId are required",
    });
  }

  const travelDetail = await prisma.travelDetail.update({
    where: { id: travelDetailId },
    data: {
      sentToManager: true,
      sentAt: new Date(),
    },
  });

  console.log(`Travel details sent to manager ${managerId}`);

  return res.json({ travelDetail });
}

export async function recordGoodNewsAttendance(req: Request, res: Response) {
  const { recordId, attendancePeriod } = req.body;

  if (!recordId) {
    return res.status(400).json({ error: "recordId is required" });
  }

  const record = await prisma.record.update({
    where: { id: recordId },
    data: {
      attendedGoodNews: true,
      goodNewsPeriod: attendancePeriod || "during week",
      updatedAt: new Date(),
    },
  });

  const fellowshipTracking = await prisma.fellowshipTracking.create({
    data: {
      recordId,
      goodNewsAttendedDate: new Date(),
      status: "in_progress",
    },
  });

  return res.json({ record, fellowshipTracking });
}

export async function markThreeMonthCompletion(req: Request, res: Response) {
  const { recordId } = req.body;

  if (!recordId) {
    return res.status(400).json({ error: "recordId is required" });
  }

  const record = await prisma.record.update({
    where: { id: recordId },
    data: {
      completedThreeMonths: true,
      status: "completed",
      updatedAt: new Date(),
    },
  });

  await prisma.fellowshipTracking.updateMany({
    where: { recordId },
    data: {
      status: "completed",
      threeMonthCompletionDate: new Date(),
    },
  });

  return res.json({ record });
}
