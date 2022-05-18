import db from "../db.js";
import joi from "joi";
import bcrypt from "bcrypt";

export async function signUpController(req, res) {
    
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
    };

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(10).required(),
        passwordConfirmation: joi.string().min(6).max(10).required(),
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
            return;
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

}