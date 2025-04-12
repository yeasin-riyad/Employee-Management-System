import mongoose from "mongoose";


const employeeSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
   
   
    employeeId:{
        type:String,
        required:true,
        unique:true
    },
    DOB:{
        type:Date,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    maritalStatus:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'department',
        required:true
    },
    salary:{
        type:Number,
        required:true
    },
   
    
   

},{timestamps:true})

const EmployeeModel = mongoose.model('employee',employeeSchema);
export default EmployeeModel;

