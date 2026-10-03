import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const contacts = await prisma.contact.findMany({
    include: { records: true, familyMembers: true },
  });

  res.json({ contacts });
});

router.post("/create", async (req, res) => {
  const { firstName, lastName, email, phone, organizationId } = req.body;

  if (!firstName || !lastName || !organizationId) {
    return res.status(400).json({ error: "First name, last name, and organizationId are required" });
  }

  const contact = await prisma.contact.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      organizationId,
    },
  });

  res.status(201).json({ contact });
});

export default router;
