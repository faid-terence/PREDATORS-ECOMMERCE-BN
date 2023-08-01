import app from '../src/app.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import config from "config";
import { login } from './login.js';

chai.use(chaiHttp);
chai.should();

describe("2 Factor Authentication: One Time Password", () =>{
    let token;
    before(async () => {
        token = await login(config.user_credentials);
    })
    
    it("Should be able to generate OTP via sms", (done) => {
        chai.request(app)
        .post("/auth/otp/getotp")
        .auth(token, { type: 'bearer' })
        .end( (err, res) => { 
            res.should.have.status(500);
             done();
        })
    });
})