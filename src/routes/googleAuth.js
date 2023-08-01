import { Router } from 'express';
import passport from 'passport';
import dotenv from 'dotenv';

const router = Router();

router.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureMessage: 'Cannot login. Please contact customer support.',
    failureRedirect: process.env.LOGIN_FAILURE_REDIRECT,
    successRedirect: process.env.LOGIN_SUCCESS_REDIRECT,
  }),
  (req, res) => {
    console.log('User: ', req.user);
    res.send('SignIn Successful.');
  },
);

export default router;
