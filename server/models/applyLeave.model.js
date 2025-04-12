import mongoose from "mongoose";

const leaveSchema= new mongoose.Schema({
    leaveType:{
        type:String,
        required:true,
        enum:["Sick Leave","Casual Leave","Annual Leave"]
    },
    status:{
        type:String,
        enum:["Pending","Approved","Rejected"],
        default:"Pending"
    },
    FromDate:{
        type:Date,
        required:true
    },
    ToDate:{
        type:Date,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    employeeId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'employee',
            required:true
    },

},{timestamps:true})

const LeaveModel = mongoose.model('leave',leaveSchema);
export default LeaveModel;