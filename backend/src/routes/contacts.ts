import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const organizationId = typeof req.query.organizationId === "string" ? req.query.organizationId : undefined;
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const where = organizationId ? { organizationId } : {};

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      include: {
        records: {
          select: { id: true, status: true },
        },
        familyMembers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            relationship: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contact.count({ where }),
  ]);

  res.json({
    contacts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
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
