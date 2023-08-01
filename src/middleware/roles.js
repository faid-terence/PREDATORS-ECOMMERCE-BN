/* eslint-disable */
import db from "../database/models/index.js";
import JwtUtility from "../utils/jwt.js";
import dotenv from "dotenv";
dotenv.config();
const Password_expired_date=process.env.PASSWORD_EXPIRED_DATE
const isAdmin = async (req, res, next) => {
  const authheader = req.headers.authorization;
  // assuming the token is sent in the Authorization header
  if (!authheader) {
    return res.status(401).json({ message: req.t('Token_not_provided') }); // assuming the token is sent in the Authorization header
  }
  const token = authheader.split(" ")[1];
  const { id } = req.params;
  try {
    const decodedToken = JwtUtility.verifyToken(token);

    const user = await db.User.findOne({
      where: { id: decodedToken.value.id },
    });
    if (user && decodedToken && decodedToken.value.roleId === 0) {
      req.user = user;
      next();
    } else {
      res
        .status(403)
        .json({ message: req.t('Not_authorized') });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: req.t('Not_authorized') });
  }
};
const isSeller = async (req, res, next) => {
  const authheader = req.headers.authorization;
  // assuming the token is sent in the Authorization header
  if (!authheader) {
    return res.status(401).json({ message: req.t('Token_not_provided') }); // assuming the token is sent in the Authorization header
  }
  const token = authheader.split(" ")[1];
  const { id } = req.params;
  try {
    const decodedToken = JwtUtility.verifyToken(token);
    const user = await db.User.findOne({ where: { id: decodedToken.value.id } });

    if (user && decodedToken && decodedToken.value.roleId === 1) {
      req.user = user; 
      next();
    } else {
      res
        .status(403)
        .json({ message: req.t('Not_authorized') });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: req.t('Not_authorized') });
      console.log(err)
  }
};
const isBuyer = async (req, res, next) => {
  const authheader = req.headers.authorization;
  // assuming the token is sent in the Authorization header
  if (!authheader) {
    return res.status(401).json({ message: req.t('Token_not_provided') }); // assuming the token is sent in the Authorization header
  }
  const token = authheader.split(' ')[1];
  const { id } = req.params;
  try {
    const decodedToken = JwtUtility.verifyToken(token);
    const user = await db.User.findOne({ where: { id: decodedToken.value.id } });
    if (user && decodedToken && decodedToken.value.roleId === 2) {
      req.user = user;
      next();
    } else {
      res
        .status(403)
        .json({ message: req.t('Not_authorized') });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: req.t('server_error')});
  }
};

const checkUser = async (req,res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).send({ status: 401, message: req.t("Not_logged_in") }); 
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const user = await db.User.findOne({ where: { id: decodedToken.value.id } });
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(403).send({ status: 403, message:req.t('User_not_found') });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: 500, message: req.t('server_error')});
  }
}

const checkPermission = (permission) => async (req, res, next) => {
  const authheader = req.headers.authorization;
  // assuming the token is sent in the Authorization header
  if (!authheader) {
    return res.status(401).json({ message:req.t("Token_not_provided") }); // assuming the token is sent in the Authorization header
  }
  const token = authheader.split(" ")[1];
  // const { id } = req.params;
  const permissions = {
    0: ['manage users', 'manage products'],
    1: ['manage products'],
    2: ['view products'],
  };
  try {
    const decodedToken = JwtUtility.verifyToken(token);
    const user = await db.User.findOne({ where: { id: decodedToken.value.id } });
    const roleId = decodedToken.value.roleId;
    if (user && permissions[roleId]?.includes(permission)) {
      next();
    } else {
      // next();
      res
        .status(403)
        .json({ message: req.t('Not_authorized') });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: req.t('server_error') });
  }
};
const RestrictPassword = async (req, res, next) => {
  const authheader = req.headers.authorization;
  // assuming the token is sent in the Authorization header
  if (!authheader) {
    return res.status(401).json({ message: req.t('Token_not_provided') }); // assuming the token is sent in the Authorization header
    
  }
  const token = authheader.split(' ')[1];
  const { id } = req.params;
  try {
    const decodedToken = JwtUtility.verifyToken(token);
    const user = await db.User.findOne({ where: { id: decodedToken.value.id } });
    if (!user) {
      return res.status(401).json({
          message:req.t("dentification"),
      });
  }
  const lastPasswordUpdate = user.last_password_update;
  const passwordUpdate = new Date(lastPasswordUpdate);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - passwordUpdate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > Password_expired_date) {
      return res.status(401).json({
          message: "Your Password has Expired, Please Update your Password",
      });
  }
  next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: req.t('server_error') });
  }
};
// isLoggedIn middleware
const isLoggedIn = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send({ status: 401, message: req.t("Not_logged_in") });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = JwtUtility.verifyToken(token);
    const user = await db.User.findOne({ where: { id: decodedToken.value.id } });
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(403).send({ status: 403, message: req.t('User_not_found') });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: 500, message: req.t('server_error') });
  }
};



export {
  isAdmin, isSeller, isBuyer, checkPermission, checkUser, RestrictPassword,isLoggedIn
};
