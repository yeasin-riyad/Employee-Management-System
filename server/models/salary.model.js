
import mongoose from "mongoose";

const salarySchema= new mongoose.Schema({
    employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'employee',
        required:true
    },
    payDate:{
        type:Date,
        required:true
    },
   
        basicSalary:{
            type:Number,
            required:true
        },
        allowances:{
            type:Number,
            
        },
        deductions:{
            type:Number,
            
        },
        netSalary:{
            type:Number
        }
},{timestamps:true})

const SalaryModel = mongoose.model('salary',salarySchema);
export default SalaryModel;
  
  
 
   
    