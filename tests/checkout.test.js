import app from '../src/app.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import config from "config";
import { login } from './login.js';

chai.use(chaiHttp);
chai.should();

describe("Checkout Flow", () => {
    let token;

    before(async () => {
        token = await login(config.user_credentials);
    });

    it("Should be able to checkout", async () => {
        let response = await chai.request(app)
        .post("/api/cart")
        .auth(token, { type: "bearer"})
        .send({product_id: 2, quantity: 1})

        chai.request(app)
        .post("/api/checkout")
        .auth(token, { type: 'bearer' })
        .send(config.billing_info)
        .end( (err, res) => {
            // console.log(res.text)
            res.should.have.status(200);
            res.body.status.should.be.equal("success");
            res.body.data.should.have.property("order");
        })
    })
})