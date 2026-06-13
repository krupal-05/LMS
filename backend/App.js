import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ConnectDB from "./Src/db/ConnectDB.js";

dotenv.config();

const app = express();

ConnectDB();

// ;(async ()=>{
//   try{
//     await mongoose.connect(process.env.db_url)
//     console.log("process.env.PORT")
//     app.listen(process.env.PORT || 5000, () => {
//       console.log(`Server running on port ${process.env.PORT || 5000}`);
//     });
//   } catch (error) {
//     console.log("data base fail to connect " , error );
//     process.exit(1);
//   }
// })();

// const app = express();

// app.get("/",(req,res)=>{
//   res.send("hello this is backend")
// })

// app.listen(PORT,()=>{
//   console.log("hello this is First code of node js ")
// })
