import { EventEmitter } from 'events';
import { Op } from 'sequelize';
import db from '../database/models/index.js';
import sendEmail from '../utils/sendEmail.js';

export const eventEmitter = new EventEmitter();
const { Product, User, Notification, wishlist } = db;

eventEmitter.on('wishlist:add', async (product) => {
  try {
    // Find the user who added the product to their wishlist
    const Wishlist = await wishlist.findOne({
      where: { productId: product.id },
    });
    if (!Wishlist) {
      return;
    }
    const user = await User.findByPk(Wishlist.userId);

    // Create a notification for the user with a message indicating that the product has been added
    try {
      await Notification.create({
        user_id: user.id,
        product_id: product.id,
        message: `You've added "${product.name}" to your wishlist. Check it out here: ${product.url}`,
      });
    } catch (error) {
      // Handle any validation errors or constraints violations here
      console.error(`Error creating notification for user ${user.id}:`, error);
    }

    // Send an email to the user with a message indicating that the product has been added
    const subject = 'Product added to wishlist';
    const text = `You've added "${product.name}" to your wishlist. Check it out here: ${product.url}`;
    try {
      await sendEmail.sendNotification(user.email, subject, text);
    } catch (error) {
      // Handle any network or SMTP errors here
      console.error(`Error sending notification email to ${user.email}:`, error);
    }
  } catch (error) {
    // Handle any database errors here
    console.error(`Error handling wishlist:add event for product ${product.id}:`, error);
  }
});
eventEmitter.on('wishlist:remove', async (wishlistItem) => {
  // Find the user who removed the product from their wishlist
  const user = await User.findByPk(wishlistItem.userId);
  if (!user) {
    return;
  }

  // Find the product that was removed from the user's wishlist
  const product = await Product.findByPk(wishlistItem.productId);
  if (!product) {
    return;
  }

  // Create a notification for the user with a message indicating that the product has been removed
  const message = `The product "${product.name}" has been removed from your wishlist`;
  await Notification.create({
    user_id: user.id,
    product_id: product.id,
    message,
  });
  console.log('Notification sent to user:', user.name);

  // Send an email to the user with a message indicating that the product has been removed
  const subject = 'Product removed from wishlist';
  const text = `You have removed "${product.name}" from your wishlist. Click here to view your wishlist: ${process.env.APP_URL}/wishlist`;
  await sendEmail.sendNotification(user.email, subject, text);
});
eventEmitter.on('product:buy', async (product, buyer) => {
  // Find the seller of the product
  const seller = await User.findByPk(product.user_id);

  // Create a notification for the seller with a message indicating that the product has been bought
  await Notification.create({
    user_id: seller.id,
    product_id: product.id,
    message: `The product "${product.name}" has been bought by ${buyer.name}`,
  });

  // Send an email to the seller with a message indicating that the product has been bought
  await sendEmail.sendNotification(
    seller.email,
    'Product bought',
    `The product "${product.name}" has been bought by ${buyer.name}`,
  );
});
eventEmitter.on('product:update', async (product, oldPrice) => {
  // Find all users who have added the product to their wishlist
  const users = await User.findAll({
    include: {
      association: 'Wishlist',
      where: { product_id: product.id },
    },
  });

  if (!users.length) {
    return;
  }
  // Check if the updated price is lower than the original price
  if (product.price < oldPrice) {
    // Create a notification for each user with the updated information
    users.forEach(async (user) => {
      await Notification.create({
        user_id: user.id,
        product_id: product.id,
        message: `The product "${product.name}" on your wishlist is now on sale for ${product.price}!`,
      });
      console.log('Notification sent to user:', user.name);

      // Send the notification to the user via their preferred notification channel
      await sendNotification.sendSaleNotification(
        user.email,
        product.name,
        product.price,
        product.url,
      );
    });
  }
});
eventEmitter.on('product:outofstock', async (product) => {
  // Find all users who have added the product to their wishlist
  const users = await User.findAll({
    include: {
      association: 'Wishlist',
      where: { product_id: product.id },
    },
  });
  if (!users.length) {
    return;
  }
  // Create a notification for each user with a message indicating that the product is out of stock and include a link to the product page
  users.forEach(async (user) => {
    await Notification.create({
      user_id: user.id,
      product_id: product.id,
      message: `The product "${product.name}" is now out of stock. You can sign up for email notifications when it's back in stock here: ${product.pageLink}`,
    });
    console.log('Notification sent to user:', user.name);
  });

  // Send an email to each user with a message indicating that the product is out of stock and include a link to the product page
  const subject = 'Product out of stock';
  const text = `The product "${product.name}" is now out of stock. You can sign up for email notifications when it's back in stock here: ${product.pageLink}`;
  users.forEach(async (user) => {
    await sendEmail.sendNotification(user.email, subject, text);
  });
});
eventEmitter.on('product:expiring_soon', async (product) => {
  // Find the seller of the product
  const seller = await User.findOne({ where: { id: product.vendor_id } });
  if (!seller) {
    return;
  }
  // Create a notification for the seller with a message indicating that the product is expiring soon
  const expirationDate = product.expiryDate.toLocaleDateString();
  const message = `The product "${product.name}" is expiring soon! Its expiration date is ${expirationDate}.`;
  await Notification.create({
    user_id: seller.id,
    product_id: product.id,
    message,
  });
  console.log('Notification sent to seller:', seller.name);

  // Send an email to the seller with a message indicating that the product is expiring soon
  const subject = 'Product expiring soon';
  const productLink = `$http://localhost:3000/products/${product.id}`;
  const expiring_soon = ` 
  Hi ${seller.name},,
  
  Just a friendly reminder that your product "${product.name}" is expiring soon. Its expiration date is ${product.expiryDate}.
  
  To view the product listing, click here: ${productLink}
  
  Best regards,
  Your Store Name
  `;
  await sendEmail.sendNotification(seller.email, subject, expiring_soon);
});
eventEmitter.on('product:expired', async (product) => {
  // Find the seller of the expired product
  const seller = await User.findOne({ where: { id: product.vendor_id } });
  if (!seller) {
    return;
  }
  // Create a notification for the seller with a message indicating that the product has expired
  await Notification.create({
    user_id: seller.id,
    product_id: product.id,
    message: `The product "${product.name}" has expired on ${product.expiryDate}.`,
  });
  console.log('Notification sent to seller:', seller.name);
  // Emit a "notification" event to the Socket.IO server
  // Send an email to the seller with a message indicating that the product has expired
  const subject = 'Product expired';
  const productLink = `http://localhost:3000/products/${product.id}`;
  const expired = `
  Hi ${seller.name},
  
  We're sorry to inform you that your product "${product.name}" has expired. Its expiration date was ${product.expiryDate}.
  
  To view the product listing, click here: ${productLink}
  
  Best regards,
  Your Store Name
  `;
  await sendEmail.sendNotification(seller.email, subject, expired);
});
eventEmitter.on('product:sold', async (product, quantity, totalSaleAmount) => {
  // Find the seller of the product
  const seller = await User.findByPk(product.user_id);
  if (!seller) {
    console.log(`Seller with ID ${product.user_id} not found`);
    return;
  }

  // Create a notification for the seller with details of the sale
  await Notification.create({
    user_id: seller.id,
    product_id: product.id,
    message: `The product "${product.name}" has been sold! Quantity: ${quantity}, Total sale amount: ${totalSaleAmount}`,
  });

  // Send an email to the seller with details of the sale
  const subject = 'Product sold';
  const text = `Congratulations! The product "${product.name}" that you listed on our platform has been sold. Quantity: ${quantity}, Total sale amount: ${totalSaleAmount}.`;
  await sendEmail.sendNotification(seller.email, subject, text);

  console.log('Notification sent to seller:', seller.name);
});
eventEmitter.on('product:added', async (product) => {
  // Find all users who have opted in to receive notifications
  const users = await User.findAll({ where: { receive_notifications: true } });
  if (!users.length) {
    return;
  }
  // Create a notification for each user with a message indicating that a new product has been added
  users.forEach(async (user) => {
    await Notification.create({
      user_id: user.id,
      product_id: product.id,
      message: `A new product has been added: ${product.name}`,
    });
    console.log('Notification sent to user:', user.name);
  });
  // Send an email to each user with a message indicating that a new product has been added
  const subject = 'New product added';
  const text = `We've added a new product: ${product.name}! Check it out: ${product.url}`;
  users.forEach(async (user) => {
    await sendEmail.sendNotification(user.email, subject, text);
  });
});
eventEmitter.on('product:updated', async (product) => {
  // Find the user who updated the product
  const updatedUser = await User.findByPk(product.vendor_id);
  if (!updatedUser) {
    console.log(`User with ID ${product.vendor_id} not found`);
    return;
  }
  // Create a notification for the user who updated the product
  await Notification.create({
    user_id: updatedUser.id,
    product_id: product.id,
    message: `You have updated product "${product.name}"!`,
  });
  console.log(`Notification sent to user: ${updatedUser.name}`);
  // Send an email to the user who updated the product with the updated information
  const subject = 'Product updated';
  const text = `The product "${product.name}" has been updated!`;
  await sendEmail.sendNotification(updatedUser.email, subject, text);
});
eventEmitter.on('product:created', async (product) => {
  // Find the user who added the product
  const user = await User.findByPk(product.vendor_id);
  if (!user) {
    console.error('User not found');
    return;
  }

  // Find all users who have opted in to receive notifications, except for the user who added the product

  const users = await User.findAll({
    where: {
      receive_notifications: true,
      id: {
        [Op.ne]: user.id, // exclude the user who added the product
      },
    },
  });
  if (!users.length) {
    return;
  }

  // Create a notification for the user who added the product with a message indicating that the product has been added
  await Notification.create({
    user_id: user.id,
    product_id: product.id,
    message: `Your product has been added: ${product.name}`,
  });
  console.log('Notification sent to user:', user.name);

  // Send an email to the user who added the product with a message indicating that the product has been added
  const subject = 'Your product has been added';
  const text = `Your product ${product.name} has been added! Check it out: ${product.url}`;
  await sendEmail.sendNotification(user.email, subject, text);

  // Create a notification for each user with a message indicating that a new product has been added
  users.forEach(async (user) => {
    await Notification.create({
      user_id: user.id,
      product_id: product.id,
      message: `A new product has been added: ${product.name}`,
    });
    console.log('Notification sent to user:', user.name);

    // Send an email to each user with a message indicating that a new product has been added
    const subject = 'New product added';
    const text = `We've added a new product: ${product.name}! Check it out: ${product.url}`;
    await sendEmail.sendNotification(user.email, subject, text);
  });
});
eventEmitter.on('sale:ended', async (sale) => {
  // Find all users who have opted in to receive sale notifications
  const users = await User.findAll({
    where: { receive_sale_notifications: true },
  });
  if (!users.length) {
    return;
  }
  // Create a notification for each user with a message indicating that the sale has ended
  users.forEach(async (user) => {
    await Notification.create({
      user_id: user.id,
      message: 'The sale has ended. We hope you enjoyed it!',
    });
    console.log('Notification sent to user:', user.name);
  });

  // Send an email to each user with a message indicating that the sale has ended
  const subject = 'Sale ended';
  const text = 'The sale has ended. We hope you enjoyed it!';
  users.forEach(async (user) => {
    await sendEmail.sendNotification(user.email, subject, text);
  });
});
eventEmitter.on('product:removed', async (product) => {
  // Find the seller of the product
  const seller = await User.findByPk(product.vendor_id);
  if (!seller) {
    console.log(`Seller with ID ${product.user_id} not found`);
    return;
  }
  // Find all users who have this product in their wishlist
  const users = await User.findAll({
    include: [
      {
        model: wishlist,
        as: 'wishlist',
        include: [
          {
            model: Product,
            where: { id: product.id },
          },
        ],
      },
    ],
  });
  if (!users.length) {
    return;
  }
  // Create a notification for each user with a message indicating that the product has been removed
  const notifications = users.map(async (user) => Notification.create({
    user_id: user.id,
    product_id: product.id,
    message: `The product "${product.name}" has been removed from the platform. it has been removed from your wishlist as well.`,
  }));
  await Promise.all(notifications);
  console.log('Notifications sent to users');

  // Send an email to each user with a message indicating that the product has been removed
  const subject = 'Product removed';
  const text = `The product "${product.name}" has been removed from the platform. it has been removed from your wishlist as well.`;
  const emails = users.map(async (user) => sendEmail.sendNotification(user.email, subject, text));
  await Promise.all(emails);
  console.log('Emails sent to users');

  // Create a notification for the seller with a message indicating that the product has been removed
  await Notification.create({
    user_id: seller.id,
    product_id: product.id,
    message: `The product "${product.name}" has been removed from the platform.`,
  });

  // Send an email to the seller with a message indicating that the product has been removed
  const sellersubject = 'Product removed';
  const selletext = `The product "${product.name}" has been removed from the platform.`;
  await sendEmail.sendNotification(seller.email, sellersubject, selletext);
  console.log('Notification sent to seller:', seller.name);
});
eventEmitter.on('product:checkout', async (order) => {
  // Find the user who made the order
  const user = await User.findByPk(order.user_id);
  if (!user) {
    console.error('User not found');
    return;
  }
  const { email } = order.billing_info;
  // Send notification to user here
  await Notification.create({
    user_id: user.id,
    product_id: user.id,
    message: 'You have made an order!',
  });
  console.log(`Notification sent to user: ${user.name}`);
  // Send an email to the user who made the order with the order information
  const subject = 'Order made';
  const text = 'You have made an order!';
  await Promise.all([
    sendEmail.sendNotification(email, subject, text),
    sendEmail.sendNotification(user.email, subject, text),
  ]);
});
eventEmitter.on('order:cancelled', async (order) => {
  // Find the user who made the order
  const user = await User.findByPk(order.user_id);
  if (!user) {
    console.error('User not found');
    return;
  }
  const { email } = order.billing_info;
  // Send notification to user here
  await Notification.create({
    user_id: user.id,
    product_id: user.id,
    message: 'Your order has expired!',
  });
  console.log(`Notification sent to user: ${user.name}`);
  // Send an email to the user who made the order with the order information
  const subject = 'Order expired';
  const text = 'Your order has expired!';
  await Promise.all([
    sendEmail.sendNotification(email, subject, text),
    sendEmail.sendNotification(user.email, subject, text),
  ]);
});
eventEmitter.on('cart:created', async (cart) => {
  // Find the user who created the cart
  const user = await User.findByPk(cart.User_id);
  if (!user) {
    console.error('User not found');
    return;
  }
  const { email } = user;
  // Send notification to user here
  await Notification.create({
    user_id: user.id,
    product_id: user.id,
    message: 'You have created a cart!',
  });
  console.log(`Notification sent to user: ${user.name}`);
  // Send an email to the user who created the cart with the cart information
  const subject = 'Cart created';
  const text = 'You have created a cart!';
  await sendEmail.sendNotification(user.email, subject, text);
});
eventEmitter.on ("cart:updated", async (cart) => {
  // Find the user who updated the cart
  const user = await User.findByPk(cart.User_id);
  if (!user) {
    console.error("User not found");
    return;
  }
  // Send notification to user here
  await Notification.create({
    user_id: user.id,
    product_id: user.id,
    message: `You have updated a cart!`,
  });
  console.log(`Notification sent to user: ${user.name}`);
  // Send an email to the user who updated the cart with the cart information
  const subject = "Cart updated";
  const text = `You have updated a cart!`;
  await sendEmail.sendNotification(user.email, subject, text)
});
eventEmitter.on ("cart:deleted", async (cart) => {
  // Find the user who deleted the cart
  const user = await User.findByPk(cart.User_id);
  if (!user) {
    console.error("User not found");
    return;
  }
  // Send notification to user here
  await Notification.create({
    user_id: user.id,
    product_id: user.id,
    message: `You have deleted a cart!`,
  });
  console.log(`Notification sent to user: ${user.name}`);
  // Send an email to the user who deleted the cart with the cart information
  const subject = "Cart deleted";
  const text = `You have deleted a cart!`;
  await sendEmail.sendNotification(user.email, subject, text)
});
eventEmitter.on("password:updated", async (user) => {
  // Send notification to user here
  await Notification.create({
    user_id: user.id,
    product_id: user.id,
    message: `Your Password has Expired, Please Update your Password`,
  });
  console.log(`Notification sent to user: ${user.name}`);
  // Send an email to the user who changed the password with the user information
  const subject = "Request to change password"
  const text = `Your Password has Expired, Please Update your Password`;
  await sendEmail.sendNotification(user.email, subject, text)
});

export default eventEmitter;
