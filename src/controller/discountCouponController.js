import db from "../database/models/index.js";
import { isSeller } from "../middleware/roles.js";

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expiresAt, productId } = req.body;
    
    // Validate request body before creating a coupon
    if (!code || !discountPercentage || !expiresAt || !productId) {
      return res.status(400).json({
        status: "fail",
        data: { message: 'Missing required fields' }
      });
    }

    // Check if the product exists in user's collection
    const product = await db.Product.findOne({ where: { id: productId, vendor_id: req.user.id } });
    if (!product) {
      return res.status(400).json({
        status: "fail",
        data: { message: 'Product not found in your Collection' }
      });
    }

    // Check if the coupon code already exists in Database
    const existingCoupon = await db.DiscountCoupon.findOne({
      where: {  vendor_id: req.user.id,code: code},
    });
    // console.log(vendor_id)
    if (existingCoupon) {
      return res.status(400).json({
        status: "fail",
        data: { message: 'Coupon code already exists' }
      });
    }

    // Create the new coupon
    const newCoupon = await db.DiscountCoupon.create({
      code,
      discountPercentage,
      expiresAt,
      productId,
      vendor_id: req.user.id,
    });

    return res.status(200).json({
      status: "success",
      data: newCoupon
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: 'Server error'
    });
  }
};


export const getCoupons = async (req, res) => {
  try {
    const coupons = await db.DiscountCoupon.findAll({
       where: { vendor_id: req.user.id }});
    if (!coupons) {
        return res.status(404).json({
            status: "fail",
            code: 404,
            data: {coupons},
            message: "No Coupons Found"
        });
    }
    return res.status(200).json({
        message: "These are available coupons",
        status: "success",
        code: 200,
        data: {coupons},
        
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Server error' });
  }
};
export const getCouponById = async(req, res) => {
    try {
        const {id} = req.params;

        const coupon = await db.DiscountCoupon.findOne({where: {id: id, vendor_id: req.user.id}});
        if(!coupon) {
            return res.staus(404).json({message: "Coupon not found"});
        }
        return res.status(200).json({
            status: "success",
            code: 200,
            data: {coupon},
            message: "Coupon is available",
        })

        
    } catch (error) {
        
    }
};
export const updateCoupon = async (req, res) => {
  try {
    const couponId = parseInt(req.params.id); // fixed, access the "id" property instead of the entire object
    const { code, discountPercentage, expiresAt, productId } = req.body;

    // Validate request body
    if (!code || !discountPercentage || !expiresAt || !productId) {
      return res.status(400).json({
        status: "fail",
        data: { message: 'Missing required fields' }
      });
    }

     // Check if the product exists
     const product = await db.Product.findOne({ where: { id: productId, vendor_id: req.user.id } });
     if (!product) {
       return res.status(400).json({
         status: "fail",
         data: { message: 'Product not found in your Collection' }
       });
     }

    // Check if the coupon exists
    const coupon = await db.DiscountCoupon.findOne({
      where: { id: couponId, vendor_id: req.user.id },
    });

    if (!coupon) {
      return res.status(404).json({
        status: "fail",
        data: { message: 'Coupon not found' }
      });
    }

    // Update the coupon
    const updatedCoupon = await coupon.update({
      code,
      discountPercentage,
      expiresAt,
      productId,
    });

    return res.status(200).json({
      status: "success",
      data: updatedCoupon
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: 'Server error'
    });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const couponId = req.params.id;

    // Check if the coupon exists
    const coupon = await db.DiscountCoupon.findOne({
      where: { id: couponId, vendor_id: req.user.id },
    });

    if (!coupon) {
      return res.status(404).json({
        status: "fail",
        data: { message: 'Coupon not found' }
      });
    }

    // Delete the coupon
    await coupon.destroy();

    return res.status(200).json({
      status: "success",
      data: { message: 'Coupon deleted successfully' }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: 'Server error'
    });
  }
};


export default { createCoupon, getCoupons, getCouponById, updateCoupon, deleteCoupon };
