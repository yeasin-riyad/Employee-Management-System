import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";
import { AddEmployeeController, ApplyLeaveController, GetAllLeaveRequestController, GetEmployeeByIdController, GetEmployeeController, GetEmployeeLeaveHistory, GetLeaveRequestController, UpdateEmployeeController, updateLeaveStatusController } from "../controller/employee.controller.js";
import upload from "../middleware/multer.js";


const employeeRouter=Router()

// Add Employee
employeeRouter.post('/add-employee',auth,admin,upload.single('image'),AddEmployeeController)
// Get Employees
employeeRouter.get('/get-employee',auth,admin,GetEmployeeController)
// Update Employee
employeeRouter.put('/update-employee',auth,admin,upload.single('image'),UpdateEmployeeController)
// Get Employee By Id
employeeRouter.get('/get-singleEmployee/:id',auth,GetEmployeeByIdController)
// Apply For Leave
employeeRouter.post('/leave-request',auth,ApplyLeaveController)
// Get Employee Leave
employeeRouter.get('/get-leave',auth,GetLeaveRequestController)

// Get All Leave Request
employeeRouter.get('/getAll-leaves',auth,admin,GetAllLeaveRequestController)
// Update Leave Request
employeeRouter.put("/update-status",auth,admin,updateLeaveStatusController)

// Get Employee Leave History from Admin
employeeRouter.get("/get-leave-history/:id",auth,admin,GetEmployeeLeaveHistory)


export default employeeRouter
