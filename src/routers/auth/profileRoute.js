import express from "express";
const profileRouter = express.Router();
import tokenValidations from "../../middlewares/tokenValidations.js";
import profileController from "../../controller/userController/profileController.js";


profileRouter.post("/create-profile", tokenValidations.verifyToken, profileController.createUserProfile);
profileRouter.get("/get-user-profile", tokenValidations.verifyToken, profileController.getUserProfile);



profileRouter.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

export default profileRouter;
