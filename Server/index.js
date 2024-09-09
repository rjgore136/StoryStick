import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import { connectDB } from "./DB/connectDB.js";
import { errorHandler, notFound } from "./Middlewares/errorMiddleware.js";
import upload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

dotenv.config();

const fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileName);

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Frontend origin
  credentials: true, // Allow credentials like cookies
  methods: ["GET", "POST", "PATCH", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Custom headers
};

const port = process.env.PORT || 4000;
const mongoURl = process.env.Database_URL;

//middleweres
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));

//routes
app.use("/api/users", userRouter);
app.use("/api/posts", blogRouter);

app.use(notFound);
app.use(errorHandler);

//Database connection
connectDB(mongoURl);

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
