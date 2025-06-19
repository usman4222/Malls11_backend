import express from "express";
const proposalRouter = express.Router();
import tokenValidations from "../middlewares/tokenValidations.js";
import proposalController from "../controller/proposalController.js";


proposalRouter.post("/send-proposal", tokenValidations.verifyToken, proposalController.createProposal);
proposalRouter.get("/get-proposal/:id", tokenValidations.verifyToken, proposalController.getSingleProposal);
proposalRouter.get("/my-proposals", tokenValidations.verifyToken, proposalController.getMyProposals);
proposalRouter.patch("/withdraw-proposal/:id", tokenValidations.verifyToken, proposalController.withDrawProposal);
proposalRouter.put("/edit-proposal/:id", tokenValidations.verifyToken, proposalController.editProposal);

proposalRouter.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

export default proposalRouter;
