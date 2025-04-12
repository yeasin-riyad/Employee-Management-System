import DepartmentModel from "../models/department.model.js";

export const addDepartmentController=async (req,res)=>{
    try{
        const {dept_name,description}=req.body
        if(!dept_name || !description){
            return res.status(400).json({
                message: "Please provide department name and description",
                error: true,
                success: false,
              });
        }
          // Check if department name already exists in a case-insensitive manner
    const existingDepartment = await DepartmentModel.findOne({
        dept_name: { $regex: new RegExp(`^${dept_name}$`, 'i') },  // Case-insensitive regex
      });

      if (existingDepartment) {
        return res.status(400).json({
          message: `${dept_name} Department already exists. Please choose a different Department Name.`,
          error: true,
          success: false,
        });
      }

      // Create department instance
    const department = new DepartmentModel({
        dept_name,
        description 
      });

      // Save to database
    const savedDepartment = await department.save();

      return res.status(201).json({
        message: "Department added successfully",
        error: false,
        success: true,
        data: savedDepartment,
      });

    }catch(err){
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

export const GetDepartmentController=async(req,res)=>{
  try{
    const {searchValue=""}=req.query
    console.log(searchValue,"vlaue..1")
    let query={ }
    if(searchValue){
      query.dept_name ={$regex:searchValue,$options:"i"}
    }
    const departments= await DepartmentModel.find(query).sort({createdAt:-1})
    return res.status(200).json({
      message: "Categories fetched successfully",
      error: false,
      success: true,
      data: departments,
    })

  }catch (e) {
      return res.status(500).json({
        message: e.message || e,
        error: true,
        success: false,
      });
    }
}

export const GetSpecificDepartmentController=async (req,res)=>{
  
  try{
    const {id}=req.params;
    if(!id){
      return res.status(400).json({
        message:"Departemet Id Not Found",
        error:true,
        success:false
      })
    }
    const data= await DepartmentModel.findById(id)
    res.status(200).json({
      message:"Department Fetches Successfully",
      error:false,
      success:true,
      data
    })

  }catch(err){
  return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
  });
}
  
}
export const UpdateDepartmentController=async(req,res)=>{
  try{
    const {_id}=req.params

    const {dept_name,description}=req.body
    if(!dept_name || !description){
        return res.status(400).json({
            message: "Please provide department name and description",
            error: true,
            success: false,
          });
    }
      // Check if department name already exists in a case-insensitive manner
const existingDepartment = await DepartmentModel.findOne({
    dept_name: { $regex: new RegExp(`^${dept_name}$`, 'i') },  // Case-insensitive regex
  });

  if (existingDepartment) {
    return res.status(400).json({
      message: `${dept_name} Department already exists. Please choose a different Department Name.`,
      error: true,
      success: false,
    });
  }

  // Update Departmet
  const updateDepartment= await DepartmentModel.findByIdAndUpdate(_id,{dept_name,description},{new:true})

  // Return Success Response with updateDepartment
  return res.status(200).json({
    message: "Department updated successfully.",
    data: updateDepartment,
    error: false,
    success: true,
  });

}catch(err){
  return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
  });
}
}

export const DeleteDepartmentController=async(req,res)=>{
  try{
    const {_id}=req.params
    if(!_id){
      return res.status(400).json({
        message:"Please provide Department Object Id",
        error:true,
        success:false
      })
    }
    const deleteDepartment= await DepartmentModel.findById({_id})
    await deleteDepartment.deleteOne()
    return res.status(200).json({
      message:"Department Deleted Successfully",
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