import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";
import { addSalaryController,  getMySalaryController, GetSalaryControllerById } from "../controller/salary.controller.js";


export const salaryRouter=Router()


// Add Salary
salaryRouter.post('/add-salary',auth,admin,addSalaryController)
// Get Salary By Id
salaryRouter.get('/get-salary/:id',auth,admin,GetSalaryControllerById)

// Get user Salary
salaryRouter.get('/getMy-salary',auth,getMySalaryController)