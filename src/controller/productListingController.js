// imports
import db from "../database/models/index.js";

export const get_collection = (req, res) => {
    const {page= 1, limit= 10} = req.query;
    const user_id = req.user.dataValues.id;
    if (!user_id) {
        res.status(400).send({ status: "fail", message: "The operation was not successful, encountered errors.", data: { errors: {
            id: "Missing id of the vendor",
        }} });
    }
    db.Product.findAndPaginateAll({ page, limit, where: { vendor_id: user_id }})
    .then(result => {
        res.status(200).send({ status: "success", message: "Successfully pulled your collection from database", data: result });
    })
    .catch( err => {
        console.log(err)
        res.status(400).send({ status: "fail", message: "The operation was not successful, encountered errors.", data: { errors: err.message} });
    })
};

export const get_available_products = (req, res) => {
    const {page= 1, limit= 10} = req.query;
    db.Product.findAndPaginateAll({ page, limit, where: { available: true } })
    .then(result => {
        res.status(200).send({ status: "success", message: "Successfully pulled all available products from database", data: result });
    })
    .catch(err => {
        res.status(400).send({ status: "fail", message: "The operation was not successful, encountered errors.", data: { errors: err.message} });
    })
};