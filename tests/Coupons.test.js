import app from '../src/app.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import db from '../src/database/models/index.js';

dotenv.config();
const expect = chai.expect;
chai.use(chaiHttp);
chai.should();

describe('Discount Coupon CRUD Operations', function() {
  let token; // Variable to store the token
  it('should sign in and get a token', async () => {
    const res = await chai.request(app)
      .post('/api/login')
      .send({
        email: 'kagabaetienne01@gmail.com',
        password: 'Predators123',
      });
    expect(res).to.have.status(200);
    expect(res.body.data).to.have.property('token');
    token = res.body.data.token; // Store the token for future requests
  });

  it('should add a new coupon', async () => {
    const res = await chai.request(app)
      .post('/api/discount-coupons/createCoupon')
      .send({
        code: '2023',
        discountPercentage: 0.7,
        expiresAt: '2023-05-31',
        productId: 3,
      })
      .auth(token, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('status', 'success');
  });
  it('should display all available coupons', async () => {
    const res = await chai.request(app)
    .get('/api/discount-coupons/getCoupons')
    .auth(token, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('status', 'success');
  })
  it('should display a coupon by id', async () => {
    const res = await chai.request(app)
    .get('/api/discount-coupons/getCoupons/1')
    .auth(token, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('status', 'success');
    })


  // Rest of the tests...
});
