import db from "../db.js";
import { ObjectId } from "mongodb";

export async function paymentController(req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) {
        return res.sendStatus(401);
    }

    try {

        const session = await db.collection("sessions").findOne({ token });
        const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) });
        res.send(user);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function savePaymentController(req, res) {

    const body = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) {
        return res.sendStatus(401);
    }

    try {

        const session = await db.collection("sessions").findOne({ token });
        const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) });
        const payment = {CPF: user.CPF, body};
        await db.collection("shopping").insertOne({...payment})

        res.sendStatus(201);


    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

}