import EmployeeModel from "../models/employee.model.js";
import SalaryModel from "../models/salary.model.js";

export const addSalaryController=async (req,res)=>{
    try{
        const {employeeId,payDate,basicSalary,allowances,deductions}=req.body
        if(!employeeId || !payDate  || !basicSalary || !allowances || !deductions){
            return res.status(400).json({
                message: "Please provide department name and description",
                error: true,
                success: false,
              });
        }
          // Check if department name already exists in a case-insensitive manner
    const existingEmployeeSalary = await SalaryModel.findOne({employeeId});

      if (existingEmployeeSalary) {
        return res.status(400).json({
          message: ` Salary already exists For that user. Please choose a different User.`,
          error: true,
          success: false,
        });
      }

      const totalSalary = (Number(basicSalary) + Number(allowances)) - Number(deductions);


      // Create a salary instance
    const salary = new SalaryModel({
        employeeId,
        payDate,
       
        basicSalary,
        allowances,
        deductions,
        netSalary:parseInt(totalSalary)
      });

      // Save to database
    const savedSalary = await salary.save();

      return res.status(201).json({
        message: "Salary added successfully",
        error: false,
        success: true,
        data:savedSalary,
      });

    }catch(err){
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

export const GetSalaryControllerById= async (req,res)=>{
  try{
    const {id}=req.params
    if(!id){
      return res.status(400).json({
        message:"Please Provide Employee Id",
        success:false,
        error:true
      })
    }

    const empSalary= await SalaryModel.find({employeeId:id}).populate("employeeId")
    return res.status(201).json({
      message:"Salary Sent Successfully ",
      success:true,
      error:false,
      data:empSalary
    })
  }catch(err){
    return res.status(500).json({
        message: err.message || err,
        error: true,
        success: false,
        
    });
}
}


export const getMySalaryController= async (req,res)=>{
  try{
    const userId=req.userId;
  const GetEmployee = await EmployeeModel.findOne({userId})
  const salary= await SalaryModel.find({employeeId:GetEmployee?._id}).populate("employeeId")
  return res.status(201).json({
    message:"Employee Fetched Successfully..",
    error:false,
    success:true,
    data:salary
  })
  }catch(err){
    return res.status(500).json({
        message: err.message || err,
        error: true,
        success: false,
        
    });
  
  }
}