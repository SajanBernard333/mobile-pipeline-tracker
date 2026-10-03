import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create organization
  const organization = await prisma.organization.create({
    data: {
      name: "Discipleship Pipeline Demo",
      settings: {
        timezone: "UTC",
        language: "en",
      },
    },
  });

  console.log("✓ Created organization:", organization.name);

  // Create users (team members)
  const users = await Promise.all([
    prisma.user.create({
      data: {
        organizationId: organization.id,
        fullName: "Moses Agyeman",
        email: "moses@example.com",
        phone: "+233 24 123 4567",
        role: "member",
      },
    }),
    prisma.user.create({
      data: {
        organizationId: organization.id,
        fullName: "Sarah Mensah",
        email: "sarah@example.com",
        phone: "+233 20 765 4321",
        role: "member",
      },
    }),
    prisma.user.create({
      data: {
        organizationId: organization.id,
        fullName: "Patrick Nkrumah",
        email: "patrick@example.com",
        phone: "+233 26 888 9012",
        role: "manager",
      },
    }),
    prisma.user.create({
      data: {
        organizationId: organization.id,
        fullName: "Esther Boateng",
        email: "esther@example.com",
        phone: "+233 24 445 6677",
        role: "member",
      },
    }),
    prisma.user.create({
      data: {
        organizationId: organization.id,
        fullName: "David Owusu",
        email: "david@example.com",
        phone: "+233 27 112 3444",
        role: "member",
      },
    }),
  ]);

  console.log(`✓ Created ${users.length} team members`);

  // Create pipeline
  const pipeline = await prisma.pipeline.create({
    data: {
      organizationId: organization.id,
      name: "Discipleship Pipeline",
      description: "Main pipeline for discipleship and fellowship tracking",
    },
  });

  console.log("✓ Created pipeline:", pipeline.name);

  // Create pipeline stages
  const stages = await Promise.all([
    prisma.pipelineStage.create({
      data: {
        pipelineId: pipeline.id,
        stageName: "Fresh Contacts",
        stageOrder: 1,
        color: "#3b82f6",
      },
    }),
    prisma.pipelineStage.create({
      data: {
        pipelineId: pipeline.id,
        stageName: "Follow Up FU1",
        stageOrder: 2,
        color: "#8b5cf6",
      },
    }),
    prisma.pipelineStage.create({
      data: {
        pipelineId: pipeline.id,
        stageName: "Follow Up FU2",
        stageOrder: 3,
        color: "#8b5cf6",
      },
    }),
    prisma.pipelineStage.create({
      data: {
        pipelineId: pipeline.id,
        stageName: "Follow Up FU3",
        stageOrder: 4,
        color: "#8b5cf6",
      },
    }),
    prisma.pipelineStage.create({
      data: {
        pipelineId: pipeline.id,
        stageName: "Follow Up FU4",
        stageOrder: 5,
        color: "#8b5cf6",
      },
    }),
    prisma.pipelineStage.create({
      data: {
        pipelineId: pipeline.id,
        stageName: "Follow Up FU5",
        stageOrder: 6,
        color: "#8b5cf6",
      },
    }),
    prisma.pipelineStage.create({
      data: {
        pipelineId: pipeline.id,
        stageName: "Content Sharing",
        stageOrder: 7,
        color: "#ec4899",
      },
    }),
    prisma.pipelineStage.create({
      data: {
        pipelineId: pipeline.id,
        stageName: "Ready for Good News",
        stageOrder: 8,
        color: "#f59e0b",
      },
    }),
    prisma.pipelineStage.create({
      data: {
        pipelineId: pipeline.id,
        stageName: "Travel Details",
        stageOrder: 9,
        color: "#14b8a6",
      },
    }),
    prisma.pipelineStage.create({
      data: {
        pipelineId: pipeline.id,
        stageName: "Attended Good News",
        stageOrder: 10,
        color: "#10b981",
      },
    }),
    prisma.pipelineStage.create({
      data: {
        pipelineId: pipeline.id,
        stageName: "Completed 3 Months in Fellowship",
        stageOrder: 11,
        color: "#06b6d4",
      },
    }),
  ]);

  console.log(`✓ Created ${stages.length} pipeline stages`);

  // Create content library
  const contentItems = await Promise.all([
    prisma.contentLibrary.create({
      data: {
        organizationId: organization.id,
        name: "Introduction to Christianity",
        type: "video",
        url: "https://example.com/intro-christianity",
        displayOrder: 1,
      },
    }),
    prisma.contentLibrary.create({
      data: {
        organizationId: organization.id,
        name: "The Gospel Explained",
        type: "article",
        url: "https://example.com/gospel-explained",
        displayOrder: 2,
      },
    }),
    prisma.contentLibrary.create({
      data: {
        organizationId: organization.id,
        name: "Following Jesus",
        type: "document",
        url: "https://example.com/following-jesus",
        displayOrder: 3,
      },
    }),
    prisma.contentLibrary.create({
      data: {
        organizationId: organization.id,
        name: "Prayer and Devotion",
        type: "video",
        url: "https://example.com/prayer-devotion",
        displayOrder: 4,
      },
    }),
    prisma.contentLibrary.create({
      data: {
        organizationId: organization.id,
        name: "Bible Study Guide",
        type: "document",
        url: "https://example.com/bible-study",
        displayOrder: 5,
      },
    }),
  ]);

  console.log(`✓ Created ${contentItems.length} content items`);

  // Create sample contacts with records
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        organizationId: organization.id,
        firstName: "Kwame",
        lastName: "Asante",
        email: "kwame@example.com",
        phone: "+233 50 123 4567",
        familySize: 3,
        isFamilyUnit: true,
        familyMembers: {
          create: [
            { firstName: "Ama", lastName: "Asante", relationship: "Spouse", isPrimaryContact: false },
            { firstName: "Kofi", lastName: "Asante", relationship: "Son", isPrimaryContact: false },
          ],
        },
        records: {
          create: {
            organizationId: organization.id,
            pipelineId: pipeline.id,
            currentStageId: stages[1].id,
            assignedToId: users[0].id,
            title: "Kwame Asante - Follow Up",
            followUpLevel: "FU2",
            contentShared: true,
            updatedAt: sevenDaysAgo,
          },
        },
      },
      include: { records: true },
    }),
    prisma.contact.create({
      data: {
        organizationId: organization.id,
        firstName: "Abena",
        lastName: "Mensah",
        email: "abena@example.com",
        phone: "+233 54 765 4321",
        familySize: 2,
        isFamilyUnit: true,
        familyMembers: {
          create: [{ firstName: "Yaw", lastName: "Mensah", relationship: "Husband", isPrimaryContact: false }],
        },
        records: {
          create: {
            organizationId: organization.id,
            pipelineId: pipeline.id,
            currentStageId: stages[6].id,
            assignedToId: users[1].id,
            title: "Abena Mensah - Content Sharing",
            followUpLevel: "FU3",
            contentShared: false,
            updatedAt: now,
          },
        },
      },
      include: { records: true },
    }),
    prisma.contact.create({
      data: {
        organizationId: organization.id,
        firstName: "Nana",
        lastName: "Boateng",
        email: "nana@example.com",
        phone: "+233 56 888 9012",
        familySize: 4,
        isFamilyUnit: true,
        familyMembers: {
          create: [
            { firstName: "Esi", lastName: "Boateng", relationship: "Spouse", isPrimaryContact: false },
            { firstName: "Kwesi", lastName: "Boateng", relationship: "Son", isPrimaryContact: false },
            { firstName: "Ama", lastName: "Boateng", relationship: "Daughter", isPrimaryContact: false },
          ],
        },
        records: {
          create: {
            organizationId: organization.id,
            pipelineId: pipeline.id,
            currentStageId: stages[7].id,
            assignedToId: users[2].id,
            title: "Nana Boateng - Ready for Good News",
            followUpLevel: "FU4",
            contentShared: true,
            readyForGoodNews: true,
            updatedAt: fourteenDaysAgo,
          },
        },
      },
      include: { records: true },
    }),
    prisma.contact.create({
      data: {
        organizationId: organization.id,
        firstName: "Akosua",
        lastName: "Owusu",
        email: "akosua@example.com",
        phone: "+233 57 445 6677",
        familySize: 1,
        isFamilyUnit: false,
        records: {
          create: {
            organizationId: organization.id,
            pipelineId: pipeline.id,
            currentStageId: stages[9].id,
            assignedToId: users[3].id,
            title: "Akosua Owusu - Attended Good News",
            followUpLevel: "FU5",
            contentShared: true,
            readyForGoodNews: true,
            attendedGoodNews: true,
            goodNewsPeriod: "during month",
            updatedAt: thirtyDaysAgo,
          },
        },
      },
      include: { records: true },
    }),
    prisma.contact.create({
      data: {
        organizationId: organization.id,
        firstName: "Kofi",
        lastName: "Darkwah",
        email: "kofi@example.com",
        phone: "+233 58 112 3444",
        familySize: 2,
        isFamilyUnit: true,
        familyMembers: {
          create: [{ firstName: "Ama", lastName: "Darkwah", relationship: "Spouse", isPrimaryContact: false }],
        },
        records: {
          create: {
            organizationId: organization.id,
            pipelineId: pipeline.id,
            currentStageId: stages[10].id,
            assignedToId: users[4].id,
            title: "Kofi Darkwah - 3 Months Completion",
            followUpLevel: "FU5",
            contentShared: true,
            readyForGoodNews: true,
            attendedGoodNews: true,
            completedThreeMonths: true,
            goodNewsPeriod: "during quarter",
            updatedAt: now,
          },
        },
      },
      include: { records: true },
    }),
  ]);

  console.log(`✓ Created ${contacts.length} sample contacts with records`);

  // Get the created records to add notifications
  const allRecords = await prisma.record.findMany();
  console.log(`✓ Total records in database: ${allRecords.length}`);

  console.log("\n✅ Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
