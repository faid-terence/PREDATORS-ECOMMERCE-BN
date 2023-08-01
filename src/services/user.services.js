import db from "../database/models/index.js";
import hasher from "../utils/hashPassword.js"
export const registerGoogle = async (data) => {
  try {
    const user = await db.User.create(data);
    return user;
  } catch (error) { 
    return false
    
  }
};
//getUserByEmail
export const getUserByEmail = async (email) => {
  try { 
    const user = await db.User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
       return false
    }
    return user;
  } catch (error) {
    return false;
  }
};

export const getUserByGoogleId = async (googleId) => {
  try {
    const user = await db.User.findOne({
      where: {
        googleId: googleId,
      },
    });
    return user;
  } catch (error) {return false;
  }
};

export const updateUserPassword = async (payload,userPass) => {
  try{ 
        const email = payload.value.email; 
        const pass = userPass.password; 
        const password = await hasher(pass);  
        const findData = await db.User.findOne({
              where: { email },
            });
        
        if (userPass.password === userPass.confirm_password) {
            findData.password = password;
            findData.last_password_update = new Date().getTime() + 86400000 * 30;

            await findData.save().then((result) =>{ 
              return result;
              
            });
        }else{
          return false
        }
      }catch(error){ 
        return false
      }
};
 