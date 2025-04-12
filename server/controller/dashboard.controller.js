import LeaveModel from "../models/applyLeave.model.js";
import DepartmentModel from "../models/department.model.js";
import EmployeeModel from "../models/employee.model.js";
import SalaryModel from "../models/salary.model.js";


export const GetSummaryController= async(req,res)=>{
    try{
    const totalEmployees= await EmployeeModel.countDocuments()
        const totalDepartments= await DepartmentModel.countDocuments()
        const totalSalaries= await SalaryModel.aggregate([
            {$group:{_id:null,totalSalaries:{$sum:"$basicSalary"}}}
        ])
        const employeeAppliedForLeave= await LeaveModel.distinct("employeeId")
        const leaveStatus= await LeaveModel.aggregate([
            {
                $group:{
                    _id:"$status",
                    count:{$sum:1}
                }
            }
        ])
        const leaveSummary= {
            employeeAppliedForLeave,
            approved:leaveStatus.find(leave=>leave._id==="Approved")?.count || 0,
            pending:leaveStatus.find(leave=>leave._id==="Pending")?.count || 0,
            rejected:leaveStatus.find(leave=>leave._id==="Rejected")?.count || 0

        }
        res.status(200).json({
            totalEmployees,
            totalDepartments,
            totalSalaries:totalSalaries[0]?.totalSalaries || 0,
            leaveSummary
        })

    }catch(err){
    return res.status(500).json({
        message: err.message || err,
        error: true,
        success: false,
    });
  }
}