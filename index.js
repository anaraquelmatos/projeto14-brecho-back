import express, { json } from "express";
import cors from "cors";
import bcrypt from 'bcrypt';
import { v4 } from "uuid";
import joi from "joi";
import chalk from "chalk";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(json());
app.use(cors());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URL);
await mongoClient.connect();
const db = mongoClient.db(process.env.DATABASE);

app.post("/sign-up", async (req, res) => {

    let passwordHash;

    const {
        name,
        email,
        password,
        passwordConfirmation,
        CPF,
    } = req.body;

    const user = {
        name,
        email,
        password,
        passwordConfirmation,
        CPF
    }

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(10).required(),
        passwordConfirmation: joi.string().required(),
        CPF: joi.string().min(11).max(11).required(),
    })

    const validation = userSchema.validate(user, { abortEarly: false });

    if (validation.error) {
        res.status(422).send("Preencha todos os campos corretamente");
        return;
    }

    if (user.password === user.passwordConfirmation) {
        passwordHash = bcrypt.hashSync(user.password, 10);
    } else {
        res.send("Senhas divergentes");
        return;
    }

    delete user.passwordConfirmation;

    try {

        const containsEmail = await db.collection("users").findOne({ email });
        const containsCPF = await db.collection("users").findOne({ CPF });

        if (!containsEmail && !containsCPF) {
            await db.collection("users").insertOne({ ...user, password: passwordHash });
            res.sendStatus(201);
        } else {
            res.status(409).send("Usuário já cadastrado");
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

})

app.post("/sign-in", async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await db.collection("users").findOne({ email });

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = v4();
            await db.collection("sessions").insertOne({
                userId: user._id,
                token
            })
            res.send(token);
        } else {
            res.status(422).send("Senha e/ou usuário incorretos");
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.get("/", async (req, res) => {

    try {
        const products = await db.collection("products").find().toArray();

        res.send(products)

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.get("/product/:idProduct", async (req, res) => {

    const { idProduct } = req.params;

    try {

        const product = await db.collection("products").findOne({ id: parseInt(idProduct) });
        res.send(product);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

const port = 5000 || process.env.PORT;
app.listen(port, () => console.log(chalk.green.bold("Servidor rodando")));
