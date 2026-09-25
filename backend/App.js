import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// CORS — allow the Vite frontend with credentials (cookies)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const isLocal = origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:");
    const isAllowedFrontend = process.env.FRONTEND_URL && origin.startsWith(process.env.FRONTEND_URL.replace(/\/$/, ""));

    if (isLocal || isAllowedFrontend || origin.endsWith(".onrender.com") || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

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
app.use(cookieParser());

// import routers
import userRouter from "./src/routes/user.route.js";
import bookRouter from "./src/routes/book.route.js";
import eventRouter from "./src/routes/event.route.js";

// router declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/events", eventRouter);

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
