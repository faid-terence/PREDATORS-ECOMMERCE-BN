import { createTransport } from 'nodemailer';
import db from '../database/models/index.js';

// Updating user Profile

export const getVendorProfile = async (req, res) => {
    try {
      const users = await db.User.findAll({
        include: []
      });
  
      return res.status(200).json({ message: req.t('user_retrieved_exception'), data: users });
    } catch (err) {
      console.log("error " + err);
      return res.status(500).json(err);
    }
  };

export const updateVendor = async (req, res) => {
    try {
        const user = await db.User.findByPk(req.params.id);

            if (!user) {
                return res.status(404).json({
                  message: "User not found",
                });
              }
         
              // update the user's profile with the data from the request body
              user.name = req.body.name || user.name;
              user.email = req.body.email || user.email;
              user.roleId= req.body.roleId || user.roleId;
              user.status= req.body.status || user.status;
              user.googleId= req.body.googleId || user.googleId;
              user.preferred_language= req.body.preferred_language || user.preferred_language;
              user.preferred_currency= req.body.preferred_currency || user.preferred_currency;
              user.password= req.body.password || user.password;
         
              const updatedVender = await user.save();
              console.log(updatedVender);
              res.json({
                message: "Vender profile updated successfully",
                user: updatedUser,
                
              });
            } catch (error) {
              res.status(500).json({
                message: error.message,
              });
            }
    
        // create a nodemailer transporter
const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });
  
  // retrieve the user's email and password from the database
  const user = async (req, res) => {
      const { email,password } = req.body;
      const user = await db.User.findOne({ where: { email,password } });
      return user;
  };
  
  // set up the email message
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: user.email,
    subject: 'Confirmation Email',
    text: `Thank you for registering! You have accepted as Vendor, your credentials are:
      <br> Email: ${user.email}, Password is ${user.password}.`
  };
  
  // send the email
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
 }




