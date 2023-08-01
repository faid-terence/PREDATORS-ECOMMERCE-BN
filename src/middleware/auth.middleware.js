import Jwt from "../utils/jwt.js";
import jsend from "jsend";
export default class authenticated{
    static auth = async(req, res, next)=> {
        try{
            const authHeader=req.headers['authorization'];
            if(!authHeader)
            return res
                .status(401)
                 .json(jsend.fail({ message: "You need to be logged" }));
                const token = await authHeader.split(" ")[1];
                await Jwt.verifyToken(token);
                next();
        }catch(e){
             throw new Error("Unkown error: " + e.message);
        }
         
    }
}