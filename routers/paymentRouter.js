import { Router } from "express";
import { paymentController, savePaymentController } from "../controllers/paymentController.js";

const paymentRouter = Router();

paymentRouter.get("/", paymentController);

paymentRouter.post("/:id", savePaymentController);

export default paymentRouter;