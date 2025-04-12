import mongoose from "mongoose";
import EmployeeModel from "./employee.model.js";
import LeaveModel from "./applyLeave.model.js";
import SalaryModel from "./salary.model.js";
import UsersModel from "./user.model.js";

const departmentSchema= new mongoose.Schema({
        dept_name:{ 
            type:String,
            required:true
            
        },
        description:{
            type:String,
            required:true

        }  
},{timestamps:true})

departmentSchema.pre("deleteOne",{document:true,query:true},async function (next) {
    try{
        const employees= await EmployeeModel.find({department:this._id})
        const empIds= employees.map(emp=>emp._id)
        const userIds= employees.map(emp=>emp.userId)

        await EmployeeModel.deleteMany({department:this._id})
        await LeaveModel.deleteMany({employeeId:{$in:empIds}})
        await SalaryModel.deleteMany({employeeId:{$in:empIds}})
        await UsersModel.deleteMany({_id:{$in:userIds}})

        next()

    }catch(e){
        next(e)
    }
    
})

const DepartmentModel = mongoose.model('department', departmentSchema);
export default DepartmentModel;
