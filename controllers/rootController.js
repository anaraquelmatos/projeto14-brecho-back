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