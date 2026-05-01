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

expApp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

expApp.use("/", app);
expApp.use(errorMiddleware);

dbConnection().then(() => {
  expApp.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
