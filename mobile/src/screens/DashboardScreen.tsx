export type ContactStatus = "active" | "due" | "overdue" | "pending";

export type FamilyMember = {
  name: string;
  relationship: string;
};

export type Contact = {
  id: string;
  name: string;
  stage: string;
  followUpLevel: string;
  status: ContactStatus;
  lastContactDays: number;
  contentShared: boolean;
  readyForGoodNews: boolean;
  attendedGoodNews: boolean;
  completedThreeMonths: boolean;
  phone: string;
  email: string;
  familyMembers: FamilyMember[];
  travelDetails: {
    departureLocation: string;
    arrivalLocation: string;
    date: string;
  };
};

export const contacts: Contact[] = [
  {
    id: "c1",
    name: "Moses Agyeman",
    stage: "Follow Up FU3",
    followUpLevel: "FU3",
    status: "due",
    lastContactDays: 8,
    contentShared: true,
    readyForGoodNews: false,
    attendedGoodNews: false,
    completedThreeMonths: false,
    phone: "+233 24 123 4567",
    email: "moses@example.com",
    familyMembers: [
      { name: "Grace Agyeman", relationship: "Spouse" },
      { name: "Kwame Agyeman", relationship: "Son" },
    ],
    travelDetails: {
      departureLocation: "Kumasi",
      arrivalLocation: "Accra",
      date: "2026-10-12",
    },
  },
  {
    id: "c2",
    name: "Sarah Mensah",
    stage: "Content Sharing",
    followUpLevel: "FU2",
    status: "active",
    lastContactDays: 4,
    contentShared: false,
    readyForGoodNews: false,
    attendedGoodNews: false,
    completedThreeMonths: false,
    phone: "+233 20 765 4321",
    email: "sarah@example.com",
    familyMembers: [{ name: "Daniel Mensah", relationship: "Brother" }],
    travelDetails: {
      departureLocation: "Tema",
      arrivalLocation: "Takoradi",
      date: "2026-10-18",
    },
  },
  {
    id: "c3",
    name: "Patrick Nkrumah",
    stage: "Ready for Good News",
    followUpLevel: "FU4",
    status: "overdue",
    lastContactDays: 16,
    contentShared: true,
    readyForGoodNews: true,
    attendedGoodNews: false,
    completedThreeMonths: false,
    phone: "+233 26 888 9012",
    email: "patrick@example.com",
    familyMembers: [
      { name: "Rebecca Nkrumah", relationship: "Spouse" },
      { name: "Esi Nkrumah", relationship: "Daughter" },
    ],
    travelDetails: {
      departureLocation: "Sunyani",
      arrivalLocation: "Cape Coast",
      date: "2026-10-20",
    },
  },
  {
    id: "c4",
    name: "Esther Boateng",
    stage: "Attended Good News",
    followUpLevel: "FU5",
    status: "pending",
    lastContactDays: 35,
    contentShared: true,
    readyForGoodNews: true,
    attendedGoodNews: true,
    completedThreeMonths: false,
    phone: "+233 24 445 6677",
    email: "esther@example.com",
    familyMembers: [{ name: "John Boateng", relationship: "Husband" }],
    travelDetails: {
      departureLocation: "Ho",
      arrivalLocation: "Koforidua",
      date: "2026-10-28",
    },
  },
  {
    id: "c5",
    name: "David Owusu",
    stage: "Completed 3 Months in Fellowship",
    followUpLevel: "FU5",
    status: "active",
    lastContactDays: 2,
    contentShared: true,
    readyForGoodNews: true,
    attendedGoodNews: true,
    completedThreeMonths: true,
    phone: "+233 27 112 3444",
    email: "david@example.com",
    familyMembers: [
      { name: "Naomi Owusu", relationship: "Spouse" },
      { name: "Nana Owusu", relationship: "Son" },
    ],
    travelDetails: {
      departureLocation: "Wa",
      arrivalLocation: "Tamale",
      date: "2026-11-02",
    },
  },
];

export const pipelineStages = [
  "Fresh Contacts",
  "Follow Up FU1",
  "Follow Up FU2",
  "Follow Up FU3",
  "Follow Up FU4",
  "Follow Up FU5",
  "Content Sharing",
  "Ready for Good News",
  "Travel Details",
  "Attended Good News",
  "Completed 3 Months in Fellowship",
];

export const reportBreakdown = [
  { label: "Fresh", value: 18 },
  { label: "Follow Up", value: 26 },
  { label: "Content", value: 30 },
  { label: "Ready", value: 16 },
  { label: "Travel", value: 12 },
  { label: "Attended", value: 19 },
  { label: "Completed", value: 8 },
];
