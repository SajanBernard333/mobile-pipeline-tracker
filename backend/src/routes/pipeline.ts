import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const organizationId = typeof req.query.organizationId === "string" ? req.query.organizationId : undefined;
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const where = organizationId ? { organizationId } : {};

  const [pipelines, total] = await Promise.all([
    prisma.pipeline.findMany({
      where,
      include: { stages: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.pipeline.count({ where }),
  ]);

  res.json({
    pipelines,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

router.post("/create", async (req, res) => {
  const { name, description, organizationId } = req.body;

  if (!name || !organizationId) {
    return res.status(400).json({ error: "Name and organizationId are required" });
  }

  const pipeline = await prisma.pipeline.create({
    data: {
      name,
      description,
      organizationId,
      status: "active",
    },
  });

  res.status(201).json({ pipeline });
});

export default router;
