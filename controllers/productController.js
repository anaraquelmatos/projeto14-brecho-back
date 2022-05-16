import db from "../db.js";

export async function productController(req, res) {

    const { idProduct } = req.params;

    try {

        const product = await db.collection("products").findOne({ id: parseInt(idProduct) });
        if (!product) return res.sendStatus(401);
        res.send(product);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}