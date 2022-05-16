import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import { signUpController } from "./controllers/signUpController.js";
import { signInController } from "./controllers/signInController.js";
import { rootController } from "./controllers/rootController.js";
import { productController } from "./controllers/productController.js";
import { addressController } from "./controllers/addressController.js";
import { paymentController } from "./controllers/paymentController.js";

const app = express();
app.use(json());
app.use(cors());
dotenv.config();

app.post("/sign-up", signUpController);

app.post("/sign-in", signInController);

app.get("/", rootController);

app.get("/product/:idProduct", productController);

app.put("/address", addressController);

app.get("/payment", paymentController);

const port = 5000 || process.env.PORT;
app.listen(port, () => console.log(chalk.green.bold("Servidor rodando")));
