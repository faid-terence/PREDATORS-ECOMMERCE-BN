/* eslint-disable */
import app from '../src/app.js';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
chai.should();

export const login = async (credentials) => {
  try {
    const res = await chai.request(app)
      .post('/api/login')
      .send(credentials);

    const token = res.body.data.token;
    return token;
  } catch (err) {
    throw err;
  }
};