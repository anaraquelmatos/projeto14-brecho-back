import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import { signUpController } from "./controllers/signUpController.js";
import { signInController } from "./controllers/signInController.js";
import { productController } from "./controllers/productController.js";
import { addressController } from "./controllers/addressController.js";
import { paymentController, savePaymentController } from "./controllers/paymentController.js";
import {adminController} from "./controllers/adminController.js";
import rootRouter from "./routers/rootRouter.js";
import paymentRouter from "./routers/paymentRouter.js";


const app = express();
app.use(json());
app.use(cors());
dotenv.config();

app.post("/sign-up", signUpController);

app.post("/sign-in", signInController);

app.get("/product/:idProduct", productController);

app.put("/address", addressController);

app.post("/admin", adminController);

app.use(rootRouter);
app.use(paymentRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(chalk.green.bold("Servidor rodando")));
