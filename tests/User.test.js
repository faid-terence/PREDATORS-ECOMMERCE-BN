import app from '../src/app.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../src/database/models/index.js';
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

describe('User Registration', () => {
  before(async () => {
    await db.User.destroy({ where: { email: 'terencefaid@gmail.com' } });
  });
  it('should create a new user', () => {
    chai.request(app)
      .post('/api/register')
      .send({
        name: 'Faid',
        email: 'terencefaid@gmail.com',
        password: 'password123',
        gender: 'male',
        preferred_currency: 'usd',
        preferred_language: 'en'
      })
      .end((error, res) => {
        res.should.have.status(200);
      });
  });
});
describe('POST /api/login', function() {
  it('should return an error message on invalid credentials', async () => {
    const res = await chai.request(app)
      .post('/api/login')
      .send({
        email: 'invalid@admin.com',
        password: 'invalidpassword'
      });
    expect(res).to.have.status(401);
    expect(res.body).to.have.property('status', 'fail');
    expect(res.body.data).to.have.property('message', 'Invalid Credentials😥');
  });

  it('should return a success message on valid credentials', async () => {
    const res = await chai.request(app)
    .post('/api/login')
    .send({
      email: 'kagabaetienne04@gmail.com',
      password: 'Predators123'
      });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.data).to.have.property('token');
      });
});
