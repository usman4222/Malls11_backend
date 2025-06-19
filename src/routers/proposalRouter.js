import express from "express";
const proposalRouter = express.Router();
import tokenValidations from "../middlewares/tokenValidations.js";
import proposalController from "../controller/proposalController.js";


proposalRouter.post("/send-proposal", tokenValidations.verifyToken, proposalController.createProposal);
proposalRouter.get("/get-proposal/:id", tokenValidations.verifyToken, proposalController.getSingleProposal);
proposalRouter.get("/my-proposals", tokenValidations.verifyToken, proposalController.getMyProposals);
proposalRouter.patch("/withdraw-proposal/:id", tokenValidations.verifyToken, proposalController.withDrawProposal);
proposalRouter.put("/edit-proposal/:id", tokenValidations.verifyToken, proposalController.editProposal);


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODUzMjU4ZWM3N2ZkNzkwZjA1ODRjYmIiLCJ1c2VybmFtZSI6ImRlc2lnbl9wcm8iLCJlbWFpbCI6InVzbWFuNDI0M2NoQGdtYWlsLmNvbSIsInRva2VuVmVyc2lvbiI6MSwiaWF0IjoxNzUwMjkxODkzLCJleHAiOjE3NTAyOTU0OTN9.d6m90ExjSnPHKRUp0cz48WwT17pIe6QSGpCyiAQabzk

proposalRouter.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

export default proposalRouter;
