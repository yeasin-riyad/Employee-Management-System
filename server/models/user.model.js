import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{type:String, required:true,unique:true},
    password:{type:String, required:true},
    role:{
        type:String,
        enum:["admin",'employee'],
        required:true
    },
    profileImage:{
        type:String,
        default:""
    },
    mobile:{
        type: Number,
        default:null
    },
    verified:{
        type: Boolean,
        default: false 
    },
    refreshToken: {
        type: String,
        default: ""
    },
    last_login_date: {
        type: Date,
        default: ""
    },
    address_details:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "address"
        }
    ],
    forgot_password_otp:{
        type: String,
        default: null
    },
    forgot_password_expiry:{
        type: String,
        default: ""
    },

},{timestamps:true})

const UsersModel = mongoose.model('users', userSchema);

export default UsersModel;