/* eslint-disable */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../database/models/index.js';

// Getting all user Profiles

const getUserProfile = async (req, res) => {
  try {
    const users = await db.User.findAll({
      include: [],
    });
    if (!users) {
      return res.status(404).json({
        status: req.t('status_message_fail'),
        code: 404,
        data: { users },
        message: req.t('user_not_found_exception'),
      });
    }
    return res.status(200).json({
      status: req.t('status_message_success'),
      code: 200,
      data: { users },
      message: req.t('user_retrieved_exception'),
    });
  } catch (err) {
    return res.status(500).json({
      status: 'server error',
      code: 500,
      data: { message: req.t('user_not_found_exception') },
    });
  }
};

// Getting all user Profile by Id

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.User.findOne({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        status: req.t('status_message_fail'),
        code: 404,
        data: { user },
        message: req.t('user_not_found_exception'),
      });
    }

    return res.status(200).json({
      status: req.t('status_message_success'),
      code: 200,
      data: { user },
      message: req.t('user_retrieved_exception'),
    });
  } catch (err) {
    return res.status(500).json({
      status: 'server error',
      code: 500,
      data:
       { message: req.t('user_not_found_exception') },
    });
  }
};

// Getting Own Profile

const getMyinfo = async (req, res) => {
  const userToken = req.headers.authorization.split(' ')[1];// Get user token from request headers
  const decoded = jwt.verify(userToken, process.env.JWT_SECRET); // Verify user token
  try {
    const user = await db.User.findOne({
      where: { id: decoded.id },
    });

    if (!user) {      
      return res.status(404).json({
        status: req.t('status_message_fail'),
        code: 404,
        data: { user },
        message: req.t('user_not_found_exception'),
      });
    }
    const {
      name,
      email,
      status,
      gender,
      phone_number,
      country,
      province,
      district,
      sector,
      streetAddress,
      preferred_language,
      preferred_currency,
      password,
    } = user;
    
    return res.status(200).json({
      status: req.t('status_message_success'),
      code: 200,
      data: {
        name,
        email,
        gender,
        phone_number,
        country,
        province,
        district,
        sector,
        streetAddress,
        preferred_language,
        preferred_currency,
      },
      message: req.t('user_retrieved_exception'),
    });
  } catch (err) {
    return res.status(500).json({
      status: 'server error',
      code: 500,
      data:
       { message: req.t('user_not_found_exception') },
    });
  }
};
// Updating user Profile
const updateUserProfile = async (req, res) => {
  const userToken = req.headers.authorization.split(' ')[1];// Get user token from request headers
  const {
    name,
    email,
    status,
    gender,
    phone_number,
    country,
    province,
    district,
    sector,
    streetAddress,
    preferred_language,
    preferred_currency,
    password,
  } = req.body;

  try {
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET); // Verify user token
    const user = await db.User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(404).json({
        status: req.t('status_message_fail'),
        code: 404,
        data: { user },
        message: req.t('user_not_found_exception'),
      });
    }

    // Hash the password if it's included in the request body
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.last_password_update= new Date();
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.status = status || user.status;
    user.gender = gender || user.gender;
    user.phone_number = phone_number || user.phone_number;
    user.country = country || user.country;
    user.province = province || user.province;
    user.district = district || user.district;
    user.sector = sector || user.sector;
    user.streetAddress = streetAddress || user.streetAddress;
    user.preferred_language = preferred_language || user.preferred_language;
    user.preferred_currency = preferred_currency || user.preferred_currency;
    // Save the updated user object to the database
    await user.save();
    // Return the updated user object as a response
    return res.status(200).json({
      status: req.t('status_message_success'),
      code: 200,
      message: req.t('user_updated_exception'),
    });
  } catch (err) {
    return res.status(500).json({ status: 'server error', code: 500 });
  }
};
export default { getUserProfile, getMyinfo, updateUserProfile, getUserById };
