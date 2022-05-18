import { Router } from "express";
import { paymentController, savePaymentController } from "../controllers/paymentController.js";

const paymentRouter = Router();

paymentRouter.get("/payment", paymentController);

paymentRouter.post("/payment", savePaymentController);

export default paymentRouter;