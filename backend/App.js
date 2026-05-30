import express from 'express';
import mongoose from 'mongoose';
import {PORT,DB_NAME} from './Src/Constants'




;(async ()=>{
  try{
    await mongoose.connect(`${process.env.db_url}`,`${DB_NAME}`)
  } catch (error) {
    console.log("data base fail to connect " , error )
  }
})();


// const app = express();

// app.get("/",(req,res)=>{
//   res.send("hello this is backend")
// })



// app.listen(PORT,()=>{
//   console.log("hello this is First code of node js ")
// })