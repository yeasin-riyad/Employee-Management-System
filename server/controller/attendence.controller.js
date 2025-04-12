import AttendenceModel from "../models/attendence.model.js";

export const GetAttendence = async (req, res) => {
    try {
      const date = new Date().toISOString().split("T")[0];
  
      const attendence = await AttendenceModel.find({ date }).populate({
        path: "employeeId",
        populate: [
          {
            path: "department",
          },
          {
            path: "userId",
          },
        ],
      });
  
      return res.status(200).json({
        error: false,
        success: true,
        data: attendence,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message || err,
        error: true,
        success: false,
      });
    }
  };


  export const UpdateAttendence = async (req, res) => {
    try {
      const { id } = req.params;
      const { status,checkInTime } = req.body;
  
      const update = await AttendenceModel.findByIdAndUpdate(
        id,                          
        { status,checkInTime },                  // ✅ যেটা আপডেট হবে
        { new: true }                // ✅ updated document ফেরত পেতে চাইলে new:true দিতে হয়
      );
  
      return res.status(200).json({
        success: true,
        error: false,
        message: "Attendance status updated successfully",
        data: update,
      });
  
    } catch (err) {
      return res.status(500).json({
        message: err.message || err,
        error: true,
        success: false,
      });
    }
  };


  export const GetAllAttendenceReport=async(req,res)=>{
    try{
      const {date}=req.query;

      const query={};
      if(date){
        query.date=date;
      }

      console.log(query.date,"Hello")

      const attendenceData= await AttendenceModel.find(query).populate({
        path:"employeeId",
        populate:[
          {path:"userId"},
         { path:"department"}
        ]
      }).sort({date:-1})

      const groupData= attendenceData.reduce((result,record)=>{
        if(!result[record.date]){
          result[record.date]=[]
        }
        result[record.date].push({
          employeeId:record.employeeId.employeeId,
          employeeName:record.employeeId.userId.name,
          departmentName:record.employeeId.department.dept_name,
          status:record.status || "Not Marked"
        })
        return result;

      },{})

      return res.status(201).json({
        error:false,
        success:true,
        data:groupData
      })

    }catch (err) {
      return res.status(500).json({
        message: err.message || err,
        error: true,
        success: false,
      });
    }
  }
  