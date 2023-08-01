import jsend from "jsend";
import Cart from "../services/cartItem.services.js";
import productDetail from "../services/product.services.js";
import eventEmitter from "../services/event.services.js";

export default class cartController {
    static addCartItem = async (req, res) => {
        try { 
                                               
            let product_id= req.body.product_id;
            let quantity=req.body.quantity; 
            const product = await productDetail.getProductById(product_id); 
                if (!product) { 
                    return res.status(404).send(jsend.fail({
                            code: 404,
                            message:  "Product not found",
                            data: false
                        })); 
                    }
                const cartData = {amount:product.price,product_id:product.id,quantity:quantity,User_id:req.user.id}
                const cartItem = await Cart.cartItem(cartData); 

                if (!cartItem) {
                    return res.status(500)
                        .send(jsend.fail({
                            code: 500,
                            message:  "error happened, please check your input",
                            data: error
                        }));   
                } 
                eventEmitter.emit('cart:created', cartItem);
                return res.status(200).send(jsend.success({
                    code: 200,
                    message:  "Product added ",
                    data: cartItem
                })); 
                

        } catch (error) {
             
            return res.status(500)
                    .send(jsend.fail({
                        code: 500,
                        message:  "unexpected error",
                        data: error
                    }));
              
        }

        
    }

    static getCartItems = async (req,res)=>{
        try {  
            const cartItems = await Cart.getCartItems(req.user.id);
            if(!cartItems) {
                 return res.status(404)
                    .send(jsend.fail({
                        code: 404,
                        message:  "Cart is empty",
                        data: "Cart is empty"
                    }));
            }
             return res.status(200)
                    .send(jsend.fail({
                        code: 200,
                        message:  "Cart items",
                        data: cartItems
                    })); 
        } catch (error) {
             return res.status(500)
                    .send(jsend.fail({
                        code: 500,
                        message:  "unexpected error",
                        data: error
                    })); 
        }
    }

      static updateCartItem = async (req, res) => {
        try { 
                                               
            let product_id= req.params.id;;
            let quantity=req.body.quantity;
              
                const product = await productDetail.getProductById(product_id); 
               
                if (!product) { 
                    return res.status(404).send(jsend.fail({
                            code: 404,
                            message:  "item not found",
                            data: false
                        })); 
                    }
                const cartData = {amount:product.price,product_id:product.id,quantity:quantity,User_id:req.user.id}
                const cartItem = await Cart.updatecartItem(cartData); 

                if (!cartItem) {
                    return res.status(500)
                        .send(jsend.fail({
                            code: 500,
                            message:  "unexpected error",
                            data: error
                        }));   
                } 
                eventEmitter.emit('cart:updated', cartItem);
                return res.status(200).send(jsend.success({
                    code: 200,
                    message:  "item updated ",
                    data: cartItem
                })); 
                
                //commit added


        } catch (error) {
             
            return res.status(500)
                    .send(jsend.fail({
                        code: 500,
                        message:  "unexpected error",
                        data: error
                    })); 
        }
        
    }

    static ClearCartItem = async (req,res)=>{
        try { 

            const cart_id= req.params.id;

            const cartData = {cart_id, User_id:req.user.id}

            const cartItems = await Cart.clearCart(cartData);

            if(!cartItems) {
                return res.status(500).send(jsend.fail({
                            code: 500,
                            message:  "cart item not removed",
                            data: cartItems
                        })); 
            }
            eventEmitter.emit('cart:deleted', cartItems);
            return res.status(200).send(jsend.success({
                            code: 200,
                            message:  "item removed in cart",
                            data: cartItems
                        }));

        } catch (error) {
             return res.status(500)
                    .send(jsend.fail({
                        code: 500,
                        message:  "unexpected error",
                        data: error
                    })); 
        }
    }

    static ClearAllCartItem = async (req,res)=>{
        try { 
           const cartData = {User_id:req.user.id}
            const cartItems = await Cart.clearAllCart(cartData);

            if(!cartItems) {
                return res.status(404).send(jsend.fail({
                            code: 404,
                            message:  "not cart item found ",
                            data: cartItems
                        })); 
            }
            return res.status(200).send(jsend.success({
                            code: 200,
                            message:  "All items removed, your cart is empty now",
                            data: cartItems
                        }));

        } catch (error) {
             return res.status(500)
                    .send(jsend.fail({
                        code: 500,
                        message:  "unexpected error",
                        data: error
                    })); 
        }
    }
 

}