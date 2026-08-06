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
      origin.startsWith("http://127.0.0.1:") ||
      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin) ||
      /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/.test(origin) ||
      /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+(:\d+)?$/.test(origin);

    if (isLocal) {
      callback(null, true);
    } else {
      callback(null, false); // Do not throw an error, just block
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
