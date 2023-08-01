/* eslint-disable */
import db from "../database/models/index.js";

export const handleItemNotFound = (res) => {
    return res.status(404).json({
      status: 'fail',
      code: 404,
      error: 'Item not found',
    });
  };
  
 export const handleUnauthorized = (res) => {
    return res.status(401).json({
      status: 'fail',
      code: 401,
      error: 'Unauthorized',
    });
  };
  
 export const handleSellerWithoutAccess = (res) => {
    return res.status(403).json({
      status: 'fail',
      code: 403,
      error: 'You do not have access to this item',
    });
  };
  
 export const handleSellerScenario = (res, item) => {

    return res.status(200).json({
      status: 'success',
      code: 200,
      data: {
        message: 'Item retrieved successfully',
        item,
      },
    });
  };
  
 export const handleBuyerScenario = (res, item) => {
    if (item.available) {
      return res.status(200).json({
        status: 'success',
        code: 200,
        data: { item },
        message: 'Item retrieved successfully',
      });
    }
    return handleItemNotFound(res);
  };
  
  export const handleServerError = (res) => {
    return res.status(500).json({
      status: 'error',
      code: 500,
      error: 'Server error',
    });
    };
 
//getProductById
export default class productDetail {
    static getProductById = async (id) => {
        try { 
             const Product = await db.Product.findOne({
                        where: {
                            id: id
                        } 
                    });
            if (!Product) {  
               return false
            }
          
        return Product; 
        } catch (error) {
           return false
        }
    };

}


