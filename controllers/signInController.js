import db from "../db.js";
import bcrypt from "bcrypt";
import { v4 } from "uuid";

export async function signInController(req, res) {
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
            return;
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}