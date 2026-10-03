import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const pipelines = await prisma.pipeline.findMany({
    include: { stages: true },
  });

  res.json({ pipelines });
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
