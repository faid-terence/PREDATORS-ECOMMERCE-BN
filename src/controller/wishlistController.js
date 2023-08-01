/* eslint-disable  */
// Import necessary dependencies
import db from '../database/models/index.js';
import eventEmitter from '../services/event.services.js';
// Route to handle the POST request to add an item to the wishlist
export const addWishlist = async (req, res) => {
  try {
    // Retrieve the product details from the database
    const product = await db.Product.findByPk(req.body.productId);
    if (!product) {
      throw Error('Product not found.');
    }
    const duplicate = await db.wishlist.findOne({ where: {
      userId: req.user.id,
      productId: req.body.productId
    }})
    if(duplicate) {
      throw Error(`${product.name} is already in wishlist.`)
    }
    // Add the item to the buyer's wishlist
    await db.wishlist.create({
      userId: req.user.id,
      productId: req.body.productId,
    });
    // Retrieve the updated wishlist for the buyer
    const wishlist = await db.wishlist.findAll({
      where: { userId: req.user.id },
      include: [{ model: db.Product, attributes: ['name', 'price', "picture_urls"] }],
    });
    // Update the buyer's record in the users table with the new wishlist data
    await db.User.update(
      { wishlist: wishlist.map((item) => item.Product) },
      { where: { id: req.user.id } },
    );
    eventEmitter.emit('wishlist:add',product);
    // Send a confirmation message to the frontend
    res.status(201).json({
      message: `Product ${product.name} added to wishlist.`,
      wishlist,
    });
  } catch (error) {
    res.status(400).send({status: "fail", message: "Encountered Error", data: { error: error.message}})
    console.log(error)
  }
};
export const deleteFromWishlist = async (req, res) => {
  try {
    const  productId = req.params.productId;
    const wishlistItem = await db.wishlist.findOne({
      where: { userId: req.user.id, productId },
    });
    if (!wishlistItem) {
      throw Error('Item not found in wishlist.');
    }
    await wishlistItem.destroy();
    const wishlist = await db.wishlist.findAll({
      where: { userId: req.user.id },
      include: [{ model: db.Product, attributes: ['name', 'price', 'picture_urls'] }],
    });
    await db.User.update(
      { wishlist: wishlist.map((item) => item.Product) },
      { where: { id: req.user.id } },
    );
    eventEmitter.emit('wishlist:remove',wishlistItem);
    res.status(200).json({ message: 'Item removed from wishlist.', wishlist });
  } catch (error) {
    res.status(400).send({ status: 'fail', message: 'Encountered Error', data: { error: error.message } });
  }
};
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await db.wishlist.findAll({
      where: { userId: req.user.id },
      include: [{ model: db.Product, attributes: ['name', 'price', 'picture_urls'] }],
    });

    res.status(200).json({
      status: 'success',
      data: {
        message: 'Items successfully retrieved',
        wishlist,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      data: {
        message: 'Encountered error',
        error: error.message,
      },
    });
  }
};

export default {addWishlist, deleteFromWishlist, getWishlist};