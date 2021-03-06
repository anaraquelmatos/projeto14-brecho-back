import db from "../db.js";

export async function productController(req, res) {

    const { idProduct } = req.params;

    try {

        const product = await db.collection("products").findOne({ idp: parseInt(idProduct) });
        if (!product) return res.sendStatus(404);
        res.send(product);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}