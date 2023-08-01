require('dotenv').config();
module.exports = {
  DATABASE_URL: process.env.DEV_DATABASE_URL,
  otp_length: 15,
  otp_length_sms: 6,
  otp_name: 'Team Predators',
  otp_issuer: 'E-commerce app',
  NODE_ENV: process.env.NODE_ENV,
  USERS_PRIMARY: JSON.parse(process.env.USERS_PRIMARY),
  admin_credentials: {
      email: process.env.ADMIN_ACC_EMAIL,
      password: process.env.ACC_PASS
  },
  vendor_credentials: {
      email: process.env.VENDOR_ACC_EMAIL,
      password: process.env.ACC_PASS
  },
  user_credentials: {
      email: process.env.USER_ACC_EMAIL,
      password: process.env.ACC_PASS
  },
  billing_info: JSON.parse(process.env.BILLING_INFO),
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE,
  },
};