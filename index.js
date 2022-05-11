import express, { json } from "express";
import cors from "cors";
import bcrypt from 'bcrypt';
import joi from "joi";
import chalk from "chalk";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

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
        phone,
        UF,
        CEP,
        city,
        neighborhood,
        street,
        number,
        description
    } = req.body;

    const user = {
        name,
        email,
        password,
        passwordConfirmation,
        CPF,
        phone,
        UF,
        CEP,
        city,
        neighborhood,
        street,
        number,
        description
    }

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(10).required(),
        passwordConfirmation: joi.string().required(),
        CPF: joi.string().min(11).max(11).required(),
        phone: joi.string().required(),
        UF: joi.string().min(2).max(2).required(),
        CEP: joi.string().min(8).max(8).required(),
        city: joi.string().required(),
        neighborhood: joi.string().required(),
        street: joi.string().required(),
        number: joi.string().required(),
        description: joi.string(),
    })

    const validation = userSchema.validate(user, {abortEarly: false});

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
        res.sendStatus(500);
    }

})


const port = 5000 || process.env.PORT;
app.listen(port, () => console.log(chalk.green.bold("Servidor rodando")));
