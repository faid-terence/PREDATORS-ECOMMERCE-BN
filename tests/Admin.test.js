import app from '../src/app.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
dotenv.config();
const expect = chai.expect;
chai.use(chaiHttp);
// Admin Tests
describe('ADMIN PRE-CONFIGURED CREDENTIAL SIGIN', function() {
  it('should return an error message on invalid credentials', async () => {
    const res = await chai.request(app)
      .post('/api/adminLogin')
      .send({
        email: 'invalid@admin.com',
        password: 'invalidpassword'
      });
    expect(res).to.have.status(401);
    expect(res.body).to.have.property('status', 'fail');
    expect(res.body.data).to.have.property('message', 'Invalid Credentials😥');
  });
});



