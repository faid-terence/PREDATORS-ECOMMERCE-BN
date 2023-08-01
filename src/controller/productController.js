/* eslint-disable camelcase */

import Joi from "joi";
import jwt from "jsonwebtoken";
import db from "../database/models/index.js";
import {
  handleItemNotFound,
  handleUnauthorized,
  handleSellerWithoutAccess,
  handleSellerScenario,
  handleBuyerScenario,

  handleServerError,
} from "../services/product.services.js";
import eventEmitter from '../services/event.services.js';

// getting all products

export const getAllProducts = async (req, res) => {
  try {
    const products = await db.Product.findAll({
      include: [],
    });
    const totalProducts = products.length;
    if (!products) {
      return res.status(404).json({
        status: "fail",
        code: 404,
        data: { products },
        message: "No product found",
      });
    }
    return res.status(200).json({
      status: "success",
      code: 200,
      message: `Products retreived successfully, total products: ${totalProducts}`,
      data: { products },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "server error",
      code: 500,
      data: { message: "Server error!!" },
    });
  }
};

// Getting Product by Id
export const getProductById = async (req, res) => {
  try {

    const { id } = req.params;

    // Check if item exists and retrieve details
    const item = await db.Product.findOne({
      where: { id: id },
      include: 'reviews'
    });
    if (!item) return handleItemNotFound(res);

    const authHeader = req.headers.authorization;
    if (!authHeader) return handleBuyerScenario(req, res, item);

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return handleUnauthorized(res);
    }
    if (decoded.roleId === 1) {
      if (item.vendor_id !== decoded.id) {
        return handleSellerWithoutAccess(res);
      }
      return handleSellerScenario(res, item);

    }

    return handleBuyerScenario(res, item, req);
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

export const updateProduct = async (req, res) => {
  /* c8 ignore start */
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }
  const inputData = req.body;
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    expiryDate: Joi.date().required(),
    picture_urls: Joi.array().items(Joi.string()),
    instock: Joi.number().integer().positive().required(),
    available: Joi.boolean().valid(true, false).required(),
    category_id: Joi.number().integer().positive().required(),
  });
  const { error } = schema.validate(inputData);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const item = await db.Product.findOne({
    where: { id, vendor_id: req.user.id },
  });

  if (!item) {
    return res
      .status(404)
      .json({ error: "Item not found in seller's collection" });
  }
  Object.assign(item, inputData);
  await item.save();
  eventEmitter.emit('product:updated', item);

  const {
    name,
    description,
    price,
    picture_urls,
    category_id,
    Instock,
    available,
    expiryDate,
  } = item;
  return res.json({
    status: 200,
    message: "Item updated successfully",
    item: {
      id,
      name,
      description,
      price,
      picture_urls,
      category_id,
      Instock,
      available,
      expiryDate,
    },
  });
  /* c8 ignore stop */
};

export const deleteSpecificProduct = async (req, res) => {
  try {
    const { reason } = req.body;
    const productId = parseInt(req.params.id);

    if (isNaN(productId) || typeof reason !== "string" || reason.trim() === "") {
      return res.status(400).json({
        status: "fail",
        data: { message: "Invalid input data" },
      });
    }

    const isAvailable = await db.Product.findOne({
      where: { id: productId, vendor_id: req.user.id },
    });

    if (!isAvailable) {
      return res.status(401).json({
        status: "fail",
        data: { message: "Can not find such product in your collection" },
      });
    } else {
      eventEmitter.emit('product:removed', isAvailable);
      await isAvailable.destroy();
      return res.status(200).json({
        status: "success",
        data: {
          message: `This product has been removed because of the following reason: ${reason}.`,
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      data: {
        message: "Oops, something went wrong on the server side. Please try again later.",
      },
    });
  }
};

export default {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteSpecificProduct,
};

