import db from "../db.js";
import joi from "joi";

export async function adminController(req, res) {

    const { category, type, itemName, image, storePrice, price, discount, size, color, description,
        collection, brand, dimensions } = req.body;

    let idp = 0;

    const array = await db.collection("products").find().toArray();

    for (let i = 0; i < array.length; i++) {
        idp = i + 1;
    }

    const register = {
        idp: idp,
        category,
        type,
        itemName,
        image,
        storePrice,
        price,
        discount,
        quantity: [
            {
                size,
                color
            }
        ],
        description,
        collection,
        brand,
        dimensions
    }

    try {

        const user = await db.collection("users").findOne({ email: 'admin@gmail.com' });
        await db.collection("products").insertOne({...register});
        res.send(register);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}