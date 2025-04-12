import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";
import { addDepartmentController, DeleteDepartmentController, GetDepartmentController, GetSpecificDepartmentController, UpdateDepartmentController } from "../controller/department.controller.js";

const departmentRouter=Router()

// Add Department
departmentRouter.post("/add-department",auth,admin,addDepartmentController)
// Get Department
departmentRouter.get('/get-department',auth,admin,GetDepartmentController)
// Get Specific Department
departmentRouter.get('/get-employee-department/:id',auth,admin,GetSpecificDepartmentController)
// Update Department
departmentRouter.put('/update-department/:_id',auth,admin,UpdateDepartmentController)
// Delete Department
departmentRouter.delete('/delete-department/:_id',auth,admin,DeleteDepartmentController)



export default departmentRouter;