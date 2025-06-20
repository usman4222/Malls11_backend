import express from "express";
const reviewRouter = express.Router();
import tokenValidations from "../middlewares/tokenValidations.js";
import reviewController from "../controller/review/reviewController.js";


reviewRouter.post("/create-review", tokenValidations.verifyToken, reviewController.createReview);
reviewRouter.get("/get-reviews/:project_id", tokenValidations.verifyToken, reviewController.getReviews);
reviewRouter.put("/update-review/:id", tokenValidations.verifyToken, reviewController.updateReview);
reviewRouter.delete("/delete-review/:id", tokenValidations.verifyToken, reviewController.deleteReview);
reviewRouter.get("/freelancer-reviews/:freelancer_id", tokenValidations.verifyToken, reviewController.getFreelancerReviews);



reviewRouter.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

export default reviewRouter;
