import db from "../db.js";
import { ObjectId } from "mongodb";
import joi from "joi";

export async function addressController(req, res) {

    const { CPF, CEP, street, numberHouse, neighborhood, UF, city, reference } = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) {
        return res.sendStatus(401);
    }

    const userAddress = {
        CEP,
        street,
        numberHouse,
        neighborhood,
        UF,
        city,
        reference
    }

    const userSchema = joi.object({
        CEP: joi.string().required(),
        street: joi.string().required(),
        numberHouse: joi.string().required(),
        neighborhood: joi.string().required(),
        UF: joi.string().min(2).max(2).required(),
        city: joi.string().required(),
        reference: joi.string()
    })

    const { error } = userSchema.validate(userAddress, { abortEarly: false });

    if (error) {
        res.status(422).send("Preencha todos os campos corretamente");
        return;
    }

    try {
        const user = await db.collection("users").findOne({ CPF });
        if (!user) return res.status(404).send("CPF não cadastrado!");

        await db.collection("users").updateOne({
            _id: new ObjectId(user._id)
        },
            { $set: userAddress })

        res.send(userAddress);


    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}