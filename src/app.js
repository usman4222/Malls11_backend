import express from "express";
import authRouter from "./routers/auth/authRoutes.js";
import profileRouter from "./routers/auth/profileRoute.js";
// import categoryRouter from "./routers/categories/category.router.js";
// import subCategoriesRouter from "./routers/categories/subcategories.router.js";
// import { authorizeUser } from "./middlewares/auth.middleware.js";
// import clientRouter from "./routers/client/client_job.router.js";
// import bidRouter from "./routers/bid.router.js";
// import { USER_ROLE } from "./config/enums/enums.js";
// import jobRouter from "./routers/jobs/job.router.js";
import upload from "./middlewares/upload.file.js";
import gigRouter from "./routers/gig/gigRoute.js";
import projectRouter from "./routers/project/projectRoute.js";
import proposalRouter from "./routers/proposal/proposalRoute.js";
import reviewRouter from "./routers/review/reviewRoute.js";
// import authRouter from "./routers/auth/auth.router.js";
const app = express.Router();

app.use("/auth", authRouter); 
app.use("/profile", profileRouter);
app.use("/gig", gigRouter);
app.use("/project", projectRouter); 
app.use("/proposal", proposalRouter);
app.use("/review", reviewRouter);

// app.use("/categories", categoryRouter);
// app.use("/sub-categories", subCategoriesRouter);

// app.use(
//   "/protected-route",
//   authorizeUser([USER_ROLE.ADMIN, USER_ROLE.FREELANCER]),
//   (req, res) => {
//     return res.json({ message: "Protected Route" });
//   }
// );
// app.use("/jobs", jobRouter);
// app.use("/client", clientRouter);
// app.use("/bid", bidRouter);

app.post("/image-upload", upload.single("image"), (req, res) => {
  console.log(req.file);

  return res.json({ message: "Image uploaded successfully!" });
});

app.use("/uploads/images", express.static("uploads/images"));

export default app;
