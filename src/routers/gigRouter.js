import express from "express";
const gigRouter = express.Router();
import tokenValidations from "../middlewares/tokenValidations.js";
import gigController from "../controller/gig/gigController.js";


gigRouter.post("/create-gig", tokenValidations.verifyToken, gigController.createGig);
gigRouter.get("/my-gigs", tokenValidations.verifyToken, gigController.getMyGigs);
gigRouter.get("/get-single-gig/:id", tokenValidations.verifyToken, gigController.getSingleGig);
gigRouter.put("/update-gig/:id", tokenValidations.verifyToken, gigController.updateGig);
gigRouter.delete("/delete-gig/:id", tokenValidations.verifyToken, gigController.deleteGig);
gigRouter.get("/all-gigs", tokenValidations.verifyToken, gigController.getAllGigs);


gigRouter.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

export default gigRouter;
