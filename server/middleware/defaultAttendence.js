import AttendenceModel from "../models/attendence.model.js";
import EmployeeModel from "../models/employee.model.js";


export const defaultAttendence=async(req,res,next)=>{
    try{
        const date= new Date().toISOString().split("T")[0];
        const existingTodayAttendence= await AttendenceModel.findOne({date})
        if(!existingTodayAttendence){
            const employees= await EmployeeModel.find().select("_id")
            const attendence= employees.map((emp)=>({
                employeeId:emp,
                date,
                status:null

            }))

            await AttendenceModel.insertMany(attendence)
        }
        next()
    }catch(err){
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
      }
}