import express from "express";
import authRouter from "./routers/auth/authRoutes.js";
import profileRouter from "./routers/auth/profileRoute.js";
import projectRouter from "./routers/projectRouter.js";
import proposalRouter from "./routers/proposalRouter.js";
import gigRouter from "./routers/gigRouter.js";
const app = express.Router();

app.use("/auth", authRouter); 
app.use("/profile", profileRouter);
app.use("/project", projectRouter); 
app.use("/proposal", proposalRouter);
app.use("/gig", gigRouter);

export default app;
