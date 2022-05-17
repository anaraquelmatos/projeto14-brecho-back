import db from "../db.js";

export async function rootController(req, res) {

    try {
        const products = await db.collection("products").find().toArray();
        if(!products) return sendStatus(404);

        res.send(products);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function deleteAccessRootController(req, res) {

    const { id } = req.params;

    try {
        const session = await db.collection("sessions").findOne({ token: id });
        if (session) {
            await db.collection("sessions").deleteOne({ token: id });
            res.sendStatus(201);

        } else {
            res.sendStatus(404);
        }

    } catch {
        res.sendStatus(500);
    }
}