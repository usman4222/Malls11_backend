import express from "express";
import authRouter from "./routers/auth/authRoutes.js";
import profileRouter from "./routers/auth/profileRoute.js";
import projectRouter from "./routers/projectRouter.js";
import proposalRouter from "./routers/proposalRouter.js";
import gigRouter from "./routers/gigRouter.js";
import reviewRouter from "./routers/reviewRoute.js";
const app = express.Router();

app.use("/api/auth", authRouter); 
app.use("/api/profile", profileRouter);
app.use("/api/project", projectRouter); 
app.use("/api/proposal", proposalRouter);
app.use("/api/gig", gigRouter);
app.use("/api/review", reviewRouter);

export default app;
