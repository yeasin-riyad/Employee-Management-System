import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";
import { GetSummaryController } from "../controller/dashboard.controller.js";

export const summaryRouter=Router()

summaryRouter.get('/get-summary',auth,admin,GetSummaryController)
