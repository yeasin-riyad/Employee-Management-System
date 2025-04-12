import mongoose from "mongoose";

const attendenceSchema= new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    employeeId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'employee',
                required:true
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Late", "Leave"],
        // required: true,
        default:null
      },
      checkInTime: String,
  checkOutTime: String,
  note: String,
},{timestamps:true})

const AttendenceModel = mongoose.model("Attendance", attendenceSchema);
export default AttendenceModel
