//External import
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';


// Internal Imports --------------------------------
import connectDB from './config/connectDb.js';
import userRouter from './route/user.route.js';
import departmentRouter from './route/department.route.js';
import employeeRouter from './route/employee.route.js';
import { salaryRouter } from './route/salary.route.js';
import { summaryRouter } from './route/summary.route.js';
import attendenceRouter from './route/attendence.route.js';

dotenv.config();
const app=express()
app.use(cors(
    {
        // origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }
));

app.use(express.urlencoded({ extended: true })); // Form Data পার্স করার জন্য

app.use(express.json());  // JSON পার্স করার জন্য middleware
app.use(cookieParser());
app.use(morgan());

app.use(helmet(
    {
        crossOriginEmbedderPolicy: false,
    }
));
const port=process.env.PORT



//Routes
app.get('/', (req, res) =>{
    res.json({
        message: 'Welcome to the Express Server '+port
    })
})


// Routes
app.use('/api/user',userRouter)
app.use('/api/department',departmentRouter)
app.use('/api/employee',employeeRouter)
app.use('/api/salary',salaryRouter)
app.use('/api/summary',summaryRouter)
app.use('/api/attendence',attendenceRouter)
connectDB().then(()=>{
    app.listen(port, () => console.log(`Server running on port ${port}`))
});