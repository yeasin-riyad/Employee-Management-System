import { Router } from "express";
import { defaultAttendence } from "../middleware/defaultAttendence.js";
import { GetAllAttendenceReport, GetAttendence, UpdateAttendence } from "../controller/attendence.controller.js";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";


const attendenceRouter= Router()

// Get All Attendence
attendenceRouter.get('/get-all-attendence',auth,admin,defaultAttendence,GetAttendence);
// Update Specific Attendence
attendenceRouter.put('/update-attendence/:id',auth,admin,UpdateAttendence)

// Get All Attendence Report
attendenceRouter.get('/get-all-attendence-report',auth,admin,GetAllAttendenceReport)
export default attendenceRouter;