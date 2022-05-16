import db from "../db.js";

export async function adminController(req, res) {


    const { category, type, itemName, image, storePrice, price, discount, quantity, description, collection, brand, dimensions } = req.body;

    const array = await db.collection("products").find().toArray();

    let id = 0;

    for (let i = 0; i < array.length; i++) {
        id = i + 1;
    }

    const register = {
        id: id,
        category,
        type,
        itemName,
        image,
        storePrice,
        price,
        discount,
        quantity,
        description,
        collection,
        brand,
        dimensions
    }
    try {

        const user = await db.collection("users").findOne({ email: 'admin@gmail.com' });
        await db.collection("products").insertOne({
            userId: user._id,
            register
        })
        res.send(register);
        console.log(register)

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}