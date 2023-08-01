"use strict";
import app from '../src/app.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import config from "config";
import { login } from './login.js';
chai.use(chaiHttp);
const { expect } = chai;
describe("Cart API Tests", () => {
  let token;

  before(async () => {
      token = await login(config.user_credentials);
  });
    
  describe("Add product to cart", () => {
    it("should add a product to the cart", (done) => {
      chai.request(app)
        .post("/api/cart")
        .set('Authorization', `Bearer ${token}`)
        .send({product_id: 3, quantity: 1})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
    it("should not add a product to the cart [Product not found 404]", (done) => {
      const product = {
        product_id: 2000,
        quantity: 8
      };
      chai.request(app)
        .post("/api/cart")
        .set('Authorization', `Bearer ${token}`)
        .send({product})
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
  describe("View cart products", () => {
    it("should not view products [user not found 404]", (done) => {
      chai.request(app)
        .get('/api/cart')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it("should view products [products added to cart 200]", (done) => {
      // Add some products to the cart here before testing
      chai.request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
 
});