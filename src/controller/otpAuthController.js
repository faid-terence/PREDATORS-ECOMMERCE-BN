/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import speakeasy from 'speakeasy';
import config from 'config';
import qr from 'qrcode';
import twilio from 'twilio';
import db from '../database/models/index.js';
const twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);

// [...] Generate OTP
const GenerateOTP = async (req, res) => {
  try {
    const user_id = req.user.dataValues.id;
    const { ascii, hex, base32, otpauth_url } = speakeasy.generateSecret({
      issuer: config.otp_issuer,
      name: config.otp_name,
      length: config.otp_length,
    });

    const qrCodeDataUrl = await qr.toDataURL(otpauth_url);

    await db.User.update(
      {
        otp_ascii: ascii,
        otp_auth_url: otpauth_url,
        otp_base32: base32,
        otp_hex: hex,
      },
      {
        where: { id: user_id },
      },
    );

    res.status(200).json({
      base32,
      otpauth_url,
      qr_code_data_url: qrCodeDataUrl,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// [...] Get OTP via SMS
const GetOTP = async (req, res) => {
  try {
    const user_id = req.user.dataValues.id;

    const user = await db.User.findByPk(user_id);
    if (!user || !user.phone_number) {
      const message = user.phone_number? "User doesn't exist": "No phone number set for this user";
      return res.status(400).json({
        status: 'fail',
        message,
      });
    }

    // Generate and send the verification code via SMS
    const verificationCode = speakeasy.totp({
      secret: user.otp_base32,
      encoding: 'base32',
      digits: config.otp_length_sms,
      window: 1,
    });

    await twilioClient.messages.create({
      body: `Your verification code is ${verificationCode}`,
      to: user.phone_number, // the phone number to send the SMS to
      from: config.twilio.phoneNumber, // your Twilio phone number
    });

    res.status(200).json({
      status: 'success',
      message: 'verification code sent',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// [...] Verify OTP
const VerifyOTP = async (req, res) => {
  const { token } = req.body;
  const user_id = req.user.dataValues.id;

  try {
    const user = await db.User.findByPk(user_id);
    const message = "Token is invalid or user doesn't exist";
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message,
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.otp_base32,
      encoding: 'base32',
      token,
    });

    if (!verified) {
      return res.status(401).json({
        status: 'fail',
        message,
      });
    }

    const updatedUser = await db.User.update({
      otp_enabled: true,
      otp_verified: true,
    }, {
      where: { id: user_id },
    });

    const userWithUpdatedData = await db.User.findByPk(user_id);

    res.status(200).json({
      otp_verified: true,
      user: {
        id: userWithUpdatedData.id,
        name: userWithUpdatedData.name,
        email: userWithUpdatedData.email,
        otp_enabled: userWithUpdatedData.otp_enabled,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// [...] Validate OTP
const ValidateOTP = async (req, res) => {
  try {
    const { token } = req.body;
    const user_id = req.user.dataValues.id;
    const user = await db.User.findOne({ where: { id: user_id } });

    const message = "Token is invalid or user doesn't exist";
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message,
      });
    }

    if (!user.otp_enabled) {
      return res.status(401).json({
        status: 'fail',
        message: '2-factor auth not enabled on this account',
      });
    }

    const validToken = speakeasy.totp.verify({
      secret: user.otp_base32,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!validToken) {
      return res.status(401).json({
        status: 'fail',
        message,
      });
    }

    res.status(200).json({
      otp_valid: true,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// [...] Disable OTP
const DisableOTP = async (req, res) => {
  try {
    const user_id = req.user.dataValues.id;

    const user = await db.User.findByPk(user_id);
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: "User doesn't exist",
      });
    }

    if (!user.otp_enabled) {
      return res.status(401).json({
        status: 'fail',
        message: '2-factor auth not enabled on this account',
      });
    }

    const updatedUser = await db.User.update({
      otp_enabled: false,
      otp_verified: false,
      otp_ascii: null,
      otp_auth_url: null,
      otp_base32: null,
      otp_hex: null,
    }, {
      where: { id: user_id },
      returning: true,
    });

    res.status(200).json({
      otp_disabled: true,
      user: {
        id: updatedUser[1][0].id,
        name: updatedUser[1][0].name,
        email: updatedUser[1][0].email,
        otp_enabled: updatedUser[1][0].otp_enabled,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

export default {
  GenerateOTP, VerifyOTP, ValidateOTP, DisableOTP, GetOTP,
};
