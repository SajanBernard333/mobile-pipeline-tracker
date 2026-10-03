import { Router } from "express";
import * as recordController from "../controllers/recordController.js";

const router = Router();

router.get("/", recordController.getRecords);
router.get("/:id", recordController.getRecordById);
router.post("/", recordController.createRecord);
router.post("/move-stage", recordController.moveToNextStage);
router.post("/follow-up", recordController.updateFollowUpLevel);
router.post("/share-content", recordController.shareContent);
router.post("/good-news-ready", recordController.confirmReadinessForGoodNews);
router.post("/travel-details/send", recordController.sendTravelDetailsToManager);
router.post("/good-news-attendance", recordController.recordGoodNewsAttendance);
router.post("/three-month-complete", recordController.markThreeMonthCompletion);

export default router;
