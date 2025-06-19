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


projectRouter.get("/all-project-proposals/:projectId", tokenValidations.verifyToken, projectContoller.getProposalsByProject);
projectRouter.get("/proposal/:id", tokenValidations.verifyToken, projectContoller.getSingleProposal);
projectRouter.patch("/update-proposal-status/:id", tokenValidations.verifyToken, projectContoller.updateProposalStatus);


projectRouter.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

export default projectRouter;
