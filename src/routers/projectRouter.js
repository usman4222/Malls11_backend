import express from "express";
const projectRouter = express.Router();
import tokenValidations from "../middlewares/tokenValidations.js";
import projectContoller from "../controller/projectContoller.js";


projectRouter.post("/create-project", tokenValidations.verifyToken, projectContoller.createProject);
projectRouter.get("/all-client-projects", tokenValidations.verifyToken, projectContoller.getAllClientProjects);
projectRouter.get("/get-single-project/:id", tokenValidations.verifyToken, projectContoller.getSingleProject);
projectRouter.put("/update-project/:id", tokenValidations.verifyToken, projectContoller.updateClientProject);
projectRouter.delete("/delete-project/:id", tokenValidations.verifyToken, projectContoller.deleteClientProject);
projectRouter.patch("/update-project-visibility/:id", tokenValidations.verifyToken, projectContoller.updateProjectVisibility);
projectRouter.patch("/update-project-status/:id", tokenValidations.verifyToken, projectContoller.updateProjectStatus);
projectRouter.get("/all-projects", tokenValidations.verifyToken, projectContoller.getAllProjects);

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODUzMjU4ZWM3N2ZkNzkwZjA1ODRjYmIiLCJ1c2VybmFtZSI6ImRlc2lnbl9wcm8iLCJlbWFpbCI6InVzbWFuNDI0M2NoQGdtYWlsLmNvbSIsInRva2VuVmVyc2lvbiI6MSwiaWF0IjoxNzUwMjg4MDg2LCJleHAiOjE3NTAyOTE2ODZ9.JZwk5lWOQE5mMvuxgGABasJMJLOQFTVGglbvQFwDwSs

projectRouter.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

export default projectRouter;
