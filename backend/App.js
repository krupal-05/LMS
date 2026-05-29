import express from 'express';

const app = express();

app.get("/",(req,res)=>{
  res.send("hello this is backend")
})


const PORT= 3000
app.listen(PORT,()=>{
  console.log("hello this is First code of node js ")
})