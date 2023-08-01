import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../database/models/index.js';

const USER = db.User;

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, cb) => {
        const defaultUser = {
          name: `${profile.name.givenName} ${profile.name.familyName}`,
          email: profile.emails[0].value,
          password: 'password',
          roleId: 2,
          googleId: profile.id,
          status: 'active',
        };

        try {
          const [user, created] = await USER.findOrCreate({
            where: { googleId: profile.id },
            defaults: defaultUser,
          });

          if (created) {
            console.log('New user created:', user);
          } else {
            console.log('Existing user found:', user);
          }

          return cb(null, user);
        } catch (error) {
          console.log('Error signing up:', error);
          return cb(error, null);
        }
      },
    ),
  );

  passport.serializeUser((user, cb) => {
    console.log('Serializing user');
    cb(null, user.id);
  });

  passport.deserializeUser(async (id, cb) => {
    try {
      const user = await USER.findOne({ where: { id } });

      if (user) {
        console.log('Deserialized user:', user);
        return cb(null, user);
      }
      return cb(new Error('User not found'), null);
    } catch (error) {
      console.log('Error deserializing user:', error);
      return cb(error, null);
    }
  });
};

export default configurePassport;
