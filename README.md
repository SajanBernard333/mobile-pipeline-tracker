# Mobile Pipeline Tracker

A mobile-friendly app to track people through a discipleship/fellowship pipeline, monitor progress, generate alerts, and produce team reports.

## Features

- Contact pipeline management
- Follow-up stages FU1 to FU5
- Multi-select content sharing
- Readiness gating for Good News
- Family and travel detail generation
- Manager and individual dashboards
- Due, overdue, and pending tracking
- Monthly and quarterly reporting

## Stack

- Mobile: React Native + Expo
- Backend: Node.js + Express + Prisma
- Database: PostgreSQL
- Notifications: email/in-app notifications

## Project structure

- backend/
- mobile/
- docs/

## Backend setup

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Mobile setup

```bash
cd mobile
npm install
npm start
```

## Pipeline flow

1. Fresh Contacts
2. Follow Up (FU1 to FU5)
3. Content Sharing
4. Ready for Good News
5. Travel Details
6. Attended Good News
7. Completed 3 Months in Fellowship

## Business rules

- Follow-up stages progress in order: FU1 → FU2 → FU3 → FU4 → FU5
- Content sharing supports multiple item selections
- Good News readiness is activated only after content sharing is complete
- Family member details auto-fill when a person confirms readiness
- Travel details are auto-generated and can be sent to a manager
- Contacts become due if no contact happens for 7 days
- Overdue if no contact happens for 14 days
- Pending if no contact happens for more than 30 days

## Important

This is a starter project scaffold. The next phases will be to add full authentication, admin dashboards, notifications, and production reporting logic.
