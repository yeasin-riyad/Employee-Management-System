import {
    createBrowserRouter,
    
  } from "react-router-dom";
import App from "../App.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import VerifyEmail from "../pages/verifyEmail.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import VerifyOtp from "../pages/VerifyOtp.jsx";
import ConfirmNewPassword from "../pages/ConfirmNewPassword.jsx";
import EmployeeDashboard from "../pages/EmployeeDashboard.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";
import RoleBaseRoute from "../components/RoleBaseRoute.jsx";
import AdminSummary from "../components/dashboard/AdminSummary.jsx";
import DepartMent from "../components/DepartMent.jsx";
import Employee from "../components/employee/Employee.jsx";
import AddEmployee from "../components/employee/AddEmployee.jsx";
import AddSalary from "../components/salary/AddSalary.jsx";
import SalaryHistory from "../components/salary/SalaryHistory.jsx";
import EmployeeSummary from "../components/employeeDashboard/EmployeeSummary.jsx";
import ViewEmployeeProfile from "../components/employeeDashboard/ViewEmployeeProfile.jsx";
import Leave from "../components/employeeDashboard/Leave.jsx";
import ApplyLeaveForm from "../components/employeeDashboard/ApplyLeaveForm.jsx";
import EmployeeSalary from "../components/employeeDashboard/EmployeeSalary.jsx";
import Setting from "../components/employeeDashboard/Setting.jsx";
import AllLeaves from "../pages/AllLeaves.jsx";
import LeaveHistory from "../pages/LeaveHistory.jsx";
import Attendence from "../components/attendence/Attendence.jsx";
import AttendenceReport from "../components/attendence/AttendenceReport.jsx";



const router=createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {
                path:"employee-dashboard",
                element:<PrivateRoute>
                    <RoleBaseRoute requiredRole="employee">
                    <EmployeeDashboard/>
                    </RoleBaseRoute>
                </PrivateRoute>,
                children:[
                    {
                        index:true,
                    element:<EmployeeSummary/>
                    },
                    {
                        path:"view-employee-profile/:id",
                        element:<ViewEmployeeProfile/>
                    },
                    {
                        path:'leaves',
                        element:<Leave/>
                    },
                    {
                        path:"apply-leave",
                        element:<ApplyLeaveForm/>
                    },
                    {
                        path:"employee-salary",
                        element:<EmployeeSalary/>
                    },
                    {
                        path:"setting",
                        element:<Setting/>
                    }
                ]
            },
            {
                path:"/admin-dashboard",
                element:<PrivateRoute>
                <RoleBaseRoute requiredRole="admin">
                    
                        <AdminDashboard/>
                </RoleBaseRoute>  
                </PrivateRoute>,
                children:[
                    {
                    index:true,
                    element:<AdminSummary/>
                    },
                    {
                        path:"admin-department",
                        element:<DepartMent/>
                    },
                    {
                        path:"employees",
                        element:<Employee/>
                    },
                    {
                        path:"add-employee",
                        element:<AddEmployee/>
                    },
                   
                    {
                        path:"admin-salary",
                        element:<AddSalary/>
                    },
                    {
                        path:"salary-history/:id",
                        element:<SalaryHistory/>
                    },
                    {
                        path:"leave-history/:id",
                        element:<LeaveHistory/>
                    },
                    {
                        path:"setting",
                        element:<Setting/>
                    },
                    {
                        path:"admin-leave",
                        element:<AllLeaves/>
                    },
                    {
                        path:"attendence",
                        element:<Attendence/>
                    },
                    {
                        path:"attendence-report",
                        element:<AttendenceReport/>
                    }

                ]

            }
        ],
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/verify-email",
        element:<VerifyEmail/>
    },
    {
        path:"/forgot-password",
        element:<ForgotPassword/>
    },
    {
        path:"/verify-otp",
        element:<VerifyOtp/>
    },
    {
        path:"/password-reset",
        element:<ConfirmNewPassword/>
    }

])

export default router;
