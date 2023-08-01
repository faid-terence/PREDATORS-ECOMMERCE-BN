/* eslint-disable */
import db from '../database/models/index.js';

// create new cart
export default class Cart {
  static cartItem = async (cartData) => {
    try {
      const Carts = await db.Cart_items.findOne({
        where: {
          User_id: cartData.User_id,
          product_id: cartData.product_id, 
        },
      });

      if (!Carts) {
        cartData.amount = cartData.quantity * cartData.amount;
        const CartsItem = await db.Cart_items.create(cartData);
        return CartsItem;
      }
      Carts.quantity += cartData.quantity;
      Carts.amount = Carts.quantity * cartData.amount;
      const CartsItem = await Carts.save();
      return CartsItem;
    } catch (error) {
      return false;
    }
  };

  static getCartItems = async (user) => {
    try {
      const Carts = await db.Cart_items.findAll({
        where: {
          User_id: user,
        },
        include: 'product',
      });

      if (!Carts) {
        return null;
      }
      let sum = 0;
      { Carts.forEach((cartPrice) => sum += cartPrice.amount); }
      Carts.push({ total: sum });
      return Carts;
    } catch (error) {
      return false;
    }
  };

  static updatecartItem = async (cartData) => {
    try {
      const Carts = await db.Cart_items.findOne({
        where: {
          User_id: cartData.User_id,
          product_id: cartData.product_id,
        },
      });

      if (!Carts) {
        return false;
      }
      Carts.quantity = cartData.quantity;
      Carts.amount = Carts.quantity * cartData.amount;
      const CartsItem = await Carts.save();
      return CartsItem;
    } catch (error) {
      console.log(error.message);
      return error;
    }
  };

  static clearCart = async (cartData) => {
    try {
      const Carts = await db.Cart_items.findOne({
        where: {
          User_id: cartData.User_id,
          id: cartData.cart_id,
        },
      });
      //  console.log(cartData)
      if (!Carts) {
        return false;
      }
      const ClearCart = Carts.destroy();
      return true;
    } catch (error) {
      return false;
    }
  };

  static clearAllCart = async (cartData) => {
    try {
      const Carts = await db.Cart_items.findAll({
        where: {
          User_id: cartData.User_id,
        },
      });

      if (!Carts || Carts.length === 0) {
        return false;
      }

      // Destroy each instance of Cart_items in parallel
      await Promise.all(Carts.map((cart) => cart.destroy()));
      return true;
    } catch (error) {
      return error;
    }
  };  


    static getCartItems = async (user) => {
        try {
 
            const Carts = await db.Cart_items.findAll({
                where:{
                    User_id:user
                },
                include:'product'
            });
           
            if (!Carts) {
               return null;
            } 
            let sum = 0;
            {total:Carts.forEach(cartPrice => { 
                return sum = sum +cartPrice.amount;
            })};    
            Carts.push({total:sum});
        return Carts 
        } catch (error) { 
           return false
        }
    };
    

}
