import app from '../src/app.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import config from "config";
import { login } from './login.js';

chai.use(chaiHttp);
chai.should();

let token;

describe("Product Listing", () => {
    it("Should be able to list all available products as a buyer", async () => {
        token = await login(config.user_credentials);

        chai.request(app)
        .get("/api/user/products")
        .auth(token, { type: 'bearer' })
        .end( (err, res) => {
            // console.log(res)
            res.should.have.status(200);
            res.body.status.should.be.eql("success");
            res.body.data.should.be.a("array");
        })
    });

    it("Should be able to list all available products as a vendor", async () => {
        token = await login(config.vendor_credentials)

        chai.request(app)
        .post("/api/vendor/collection")
        .auth(token, { type: 'bearer' })
        .end( (err, res) => {
            // console.log(res.text)
            res.should.have.status(200);
            res.body.status.should.be.eql("success");
            res.body.data.should.be.a("array");
        })
    })
})