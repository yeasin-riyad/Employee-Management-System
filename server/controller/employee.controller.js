import LeaveModel from "../models/applyLeave.model.js";
import EmployeeModel from "../models/employee.model.js";
import UsersModel from "../models/user.model.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import bcryptjs from 'bcryptjs' 


export const AddEmployeeController = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      DOB,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;
    const image = req.file;

    // Check if all required fields are provided
    if (
      !name ||
      !email ||
      !employeeId ||
      !DOB ||
      !gender ||
      !maritalStatus ||
      !designation ||
      !department ||
      !salary ||
      !password ||
      !role ||
      !image
    ) {
      return res.status(400).json({
        message: "Provide all required fields",
        error: true,
        success: false,
      });
    }

    // ✅ **একই সাথে `email` এবং `employeeId` চেক করুন**
    const existingUser = await UsersModel.findOne({ email });
    const existingEmployee = await EmployeeModel.findOne({ employeeId });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this Email.",
        error: true,
        success: false,
      });
    }else if(existingEmployee){
      return res.status(400).json({
        message: "User already exists with this Employee Id.",
        error: true,
        success: false,
      });

    }
     // ✅ **Password Hashing**
     const hashedPassword = await bcryptjs.hash(password, 10);

    // ✅ **Image upload to Cloudinary**
    const employeeImage = await uploadImageCloudinary(image);

    // ✅ **Create User Instance**
    const newUser = new UsersModel({
      name,
      email,
      password: hashedPassword,
      role,
      verified: true,
      profileImage: employeeImage,
    });

    // ✅ **Save user to database**
    const savedUser = await newUser.save();

    // ✅ **Create Employee Instance**
    const employee = new EmployeeModel({
      userId: savedUser?._id,
      employeeId,
      DOB,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });

    // ✅ **Save Employee to database**
    const savedEmployee = await employee.save();

    return res.status(201).json({
      message: "Employee Saved successfully",
      error: false,
      success: true,
      data: savedEmployee,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "User Already Exists with this Employee ID Or Email",
        success: false,
      });
    }
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};


export const GetEmployeeController=async(req,res)=>{
  const {searchValue=""}=req.query;
    try{
      const employees= await EmployeeModel.find().sort({createdAt:-1}).populate("department userId",{password:0})
      let filteredEmployees=employees;
      if(searchValue){
        filteredEmployees=employees.filter((emp)=>(emp.userId.name.toLowerCase().includes(searchValue.toLowerCase())))
        
      }
      return res.status(200).json({
        message: "Employees fetched successfully",
        error: false,
        success: true,
        data: filteredEmployees,
      })

      
  
    }catch (e) {
        return res.status(500).json({
          message: e.message || e,
          error: true,
          success: false,
        });
      }

}

export const UpdateEmployeeController = async (req, res) => {
  try {
    let imageFile;
    let profileImage;

    const {
      userId,
      name,
      email,
      employeeId,
      DOB,
      gender,
      maritalStatus,
      designation,
      department,
     
      role,
      image,
    } = req.body;

    // ✅ Ensure all required fields are provided
    if (
      !name ||
      !email ||
      !employeeId ||
      !DOB ||
      !gender ||
      !maritalStatus ||
      !designation ||
      !department ||

      !role
    ) {
      return res.status(400).json({
        message: "Provide all required fields",
        error: true,
        success: false,
      });
    }

    // ✅ Check if the email already exists (excluding the current user)
    const existingUser = await UsersModel.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already in use by another user.",
        error: true,
        success: false,
      });
    }

    // ✅ Check if the employeeId already exists (excluding the current user)
    const existingEmployee = await EmployeeModel.findOne({ employeeId, userId: { $ne: userId } });
    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee ID is already assigned to another user.",
        error: true,
        success: false,
      });
    }

    // ✅ Handle profile image update
    if (!image) {
      imageFile = req.file;
      if (!imageFile) {
        return res.status(400).json({
          message: "Please Provide Employee Profile Image",
          error: true,
          success: false,
        });
      }
      profileImage = await uploadImageCloudinary(imageFile);
    } else {
      profileImage = image;
    }

    // ✅ Update User Data
    const payload = {
      email,
      name,
      role,
      profileImage,
    };

    const updateUser = await UsersModel.findByIdAndUpdate(userId, payload, { new: true });

    // ✅ Update Employee Data
    const updateEmployee = await EmployeeModel.findOneAndUpdate(
      { userId },
      {
        employeeId,
        DOB,
        gender,
        maritalStatus,
        designation,
        department,
        
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Employee Updated Successfully",
      error: false,
      success: true,
      data: { updateUser, updateEmployee },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "User Already Exists with this Employee ID Or Email",
        success: false,
      });
    }
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const GetEmployeeByIdController=async (req,res)=>{
  try{
    const {id}=req.params;
    if(!id){
      return res.status(400).json({
        message:"Please Provide User Id",
        success:false,
        error:true
      })
    }

    const employee= await EmployeeModel.findOne({userId:id}).populate("userId department")
        return res.status(201).json({
          message:"User Sent Successfully ",
          success:true,
          error:false,
          data:employee
        })

  }catch(err){
    return res.status(500).json({
        message: err.message || err,
        error: true,
        success: false,
        
    });
}


}

export const ApplyLeaveController = async(req,res)=>{
  try{
    const {leaveType,FromDate,ToDate,description}=req.body
   
    if(!leaveType || !FromDate ||!ToDate ||!description){
      return res.status(400).json({
        message:"Please Fill All Required Fields"
      })
    }

    const userId=req.userId;
    const employee= await EmployeeModel.findOne({userId})
    //Create applyLeave Instance
    const applyLeave= new LeaveModel({
      employeeId:employee?._id,
      leaveType,
      FromDate,
      ToDate,
      description
    })

    // Save to Database
    const Leave=await applyLeave.save()
     return res.status(201).json({
      message:"Applly for Leave Successfully. Please wait for Admin Approval.",
      error:false,
      success:true

     })
  }catch(err){
    return res.status(500).json({
        message: err.message || err,
        error: true,
        success: false,
        
    });
}
}

export const GetLeaveRequestController=async(req,res)=>{
  try{
    const userId=req.userId;
    const employee= await EmployeeModel.findOne({userId})
    const LeaveRequest= await LeaveModel.find({employeeId:employee?._id}).populate("employeeId")
    return res.status(201).json({
      message:"Leave request fetched successfully.",
      error:false,
      success:true,
      data:LeaveRequest
    })


  }catch(err){
    return res.status(500).json({
        message: err.message || err,
        error: true,
        success: false,
        
    });
}
}

export const GetAllLeaveRequestController = async (req, res) => {
  try {
    const { searchValue = "", status = "" } = req.query; // Extract query parameters

    let query = {};

    // 🔹 Status Filter
    if (status) {
     
      query.status = status;
    }

    // 🔹 Fetch Leave Requests with Nested Population
    const leaves = await LeaveModel.find(query).sort({createdAt:-1})
      .populate({
        path: "employeeId",
        populate: [
          {
            path: "userId", // Populating userId inside employeeId
            select:"name profileImage"
          },
          {
            path:"department", // Populating department inside employeeId
            select:"dept_name"
          }
        ]
      });

    // 🔹 Apply Search Filter AFTER Populating
    let filteredLeaves = leaves;
    if (searchValue) {
      filteredLeaves = leaves.filter((leave) =>
        leave.employeeId?.userId?.name?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

   

    return res.status(200).json({
      message: "Fetched All Leave Requests",
      error: false,
      success: true,
      data: filteredLeaves,
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};


export const updateLeaveStatusController= async (req,res)=>{
  try{
    const {status,id}=req.body;
    
    const updateStatus=await LeaveModel.findByIdAndUpdate(id, { status }, { new: true });

    return res.status(200).json({
      message:"Status Updated Successfully..",
      error:false,
      success:true
    })
  }catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }

}

export const GetEmployeeLeaveHistory= async(req,res)=>{
  try{
    const {id}=req.params
    
    if(!id){
      return res.status(400).json({
        message:"Please Provide Employee Id",
        error:true,
        success:false
      })
    }

    const data= await LeaveModel.find({employeeId:id}).sort({createdAt:-1}).populate("employeeId")
    return res.status(201).json({
      message:"Leave History Fetch Successfully.",
      error:false,
      success:true,
      data
    })

  }catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
  
}


