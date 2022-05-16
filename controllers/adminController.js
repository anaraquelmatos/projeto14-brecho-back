import db from "../db.js";
import joi from "joi";

export async function adminController(req, res) {

    const { category, type, itemName, image, storePrice, price, discount, size, color, description,
        collection, brand, dimensions } = req.body;

    let id = 0;

    const register = {
        id: id,
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

    const array = await db.collection("products").find().toArray();

    for (let i = 0; i < array.length; i++) {
        id = i + 1;
    }

    try {

        const user = await db.collection("users").findOne({ email: 'admin@gmail.com' });
        await db.collection("products").insertOne({
            userId: user._id,
            register
        })
        res.send(register);
        console.log(register)
        console(quantity.color)
        console(quantity.size)

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}