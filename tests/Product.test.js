import app from "../src/app.js";
import chai from "chai";
import chaiHttp from "chai-http";
import dotenv from "dotenv";

dotenv.config();
const expect = chai.expect;
chai.use(chaiHttp);
chai.should();

describe("Product API", function () {
  let token; // Variable to store the token for a seller
  let token1;

  it("should sign in and get a token", async () => {
    const res = await chai.request(app).post("/api/login").send({
      email: "kagabaetienne01@gmail.com",
      password: "Predators123",
    });
    expect(res).to.have.status(200);
    expect(res.body.data).to.have.property("token");
    token = res.body.data.token; // Store the token for future requests on tests
  });
  it("should login a buyer to get a token"),
    async () => {
      const res = await chai.request(app).post("/api/login").send({
        email: "juankirkland04@gmail.com",
        password: "Predators123",
      });
      expect(res).to.have.status(200);
      expect(res.body.data).to.have.property("token");
      token1 = res.body.data.token; // Store the token for future requests for a buyer
    };

  describe("POST api/product", function () {
    it("should add a new product", async () => {
      const res = await chai
        .request(app)
        .post("/api/product")
        .send({
          name: "Test Prod",
          description: "This is a test product",
          category_id: 1,
          picture_urls: ["https://example.com/image.png"],
          expiryDate: "2023-05-31",
          price: 10.99,
          instock: 50,
          available: true,
        })
        .set("Authorization", `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("status", "success");
    });
  });
  describe("GET api/product", function () {
    it("should get all products", async () => {
      const res = await chai
        .request(app)
        .get("/api/product/")
        .set("Authorization", `Bearer ${token1}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("status", "success");
    });
  });

  describe("GET api/product/:id", function () {
    it('should display a product by id', async () => {
        const res = await chai.request(app)
        .get('/api/product/1')
        .auth(token, { type: 'bearer' });
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status', 'success');
        })
  });

  // Rest of the test cases...
});
