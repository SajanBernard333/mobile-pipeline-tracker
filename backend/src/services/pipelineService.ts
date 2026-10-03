import { prisma } from "../lib/prisma.js";

export async function getPipelineSummary() {
  const records = await prisma.record.findMany({
    select: {
      status: true,
      followUpLevel: true,
      contentShared: true,
      readyForGoodNews: true,
    },
  });

  const totals = {
    total: records.length,
    freshContacts: records.filter((record) => record.status === "active").length,
    followUp: records.filter((record) => record.followUpLevel).length,
    contentShared: records.filter((record) => record.contentShared).length,
    readyForGoodNews: records.filter((record) => record.readyForGoodNews).length,
  };

  return totals;
}
