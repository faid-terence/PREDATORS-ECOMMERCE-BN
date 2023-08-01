import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
  const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        roleId: user.roleId,
        status: user.status,
        
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    if (!token) {
      return false;
    }
    return token;
  };

export default generateToken;
