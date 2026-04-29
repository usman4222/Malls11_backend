import app from "./app.js";
import express from "express";
import cors from "cors";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/errorHandler.js";
import "dotenv/config";
import bodyParser from "body-parser";
import multer from "multer";

const expApp = express();
expApp.use(bodyParser.urlencoded({ extended: true }));
expApp.use(bodyParser.json());
const forms = multer();

expApp.use(forms.array());

const PORT = process.env.PORT || 3000;

expApp.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://145.223.118.108:3000",
      "http://malls11.com:8083",
      "http://malls11.com",
      "https://malls11.com",
      "http://145.223.118.108",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

expApp.use("/", app);
expApp.use(errorMiddleware);

dbConnection().then(() => {
  expApp.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
