// import express from "express"
// import mongoose from "mongoose"
// import bodyParser from "body-parser"
// import jwt from "jsonwebtoken"
// import dotenv from "dotenv"
// import cors from "cors"

// dotenv.config()

// const app = express()


// app.use(bodyParser.json())
// app.use(cors())

// app.use(
//     (req,res,next)=>{
//         const value = req.header("Authorization")
//         if(value != null){
//             const token = value.replace("Bearer ","")
//             jwt.verify(
//                 token,
//                 process.env.JWT_SECRET,
//                 (err,decoded)=>{
//                     if(decoded == null){
//                         res.status(403).json({
//                             message : "Unauthorized"
//                         })
//                     }else{
//                         req.user = decoded
//                         next()
//                     }                    
//                 }
//             )
//         }else{
//             next()
//         }        
//     }
// )


// const connectionString = process.env.MONGO_URL


// mongoose.connect(connectionString).then(
//     ()=>{
//         console.log("Connected to database")
//     }
// ).catch(
//     ()=>{
//         console.log("Failed to connect to the database")
//     }
// )




// app.listen(5000, 
//    ()=>{
//        console.log("server started")
//    }
// )

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";

import userRouter from "./routes/userRoutes.js";
import busRouter from "./routes/busRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(cors());

/* ================= JWT MIDDLEWARE ================= */
app.use((req, res, next) => {
	const value = req.header("Authorization");

	if (value) {
		const token = value.replace("Bearer ", "");
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return res.status(403).json({ message: "Unauthorized" });
			}
			req.user = decoded;
			next();
		});
	} else {
		next();
	}
});

/* ================= ROUTES ================= */
app.use("/api/users", userRouter);
app.use("/api/buses", busRouter);
app.use("/api/bookings", bookingRouter);

/* ================= DB ================= */
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log("Connected to database"))
	.catch(() => console.log("Failed to connect to the database"));

app.listen(5000, () => {
	console.log("Server started on port 5000");
});

