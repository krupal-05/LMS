import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(express.static("public"));







// import routers
import userRouter from "./src/routes/user.route.js"







// router decliration 
app.use("/api/v1/users", userRouter)

// global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.statuscode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || []
  });
});

export default app;
