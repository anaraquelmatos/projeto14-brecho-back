import db from "../db.js";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import joi from "joi";

export async function signInController(req, res) {

    const { email, password } = req.body;

    const user = {email, password};

    const userSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).max(10).required()
    })

    const {error} = userSchema.validate(user, { abortEarly: false });

    if (error) {
        res.status(422).send("Preencha todos os campos corretamente");
        return;
    }


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
            return;
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}