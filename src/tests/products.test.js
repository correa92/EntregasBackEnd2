import { faker } from "@faker-js/faker";
import chai from "chai";
import supertest from "supertest";
import initServer from "./index.js";

const expect = chai.expect;
let jwt = "";

describe("Testing Products Endpoints Success", () => {
  before(async function () {
    const { app, db } = await initServer();
    const application = app.callback();
    this.requester = supertest.agent(application);
    this.app = app;
    this.db = db;
    this.payload = {};
  });

  after(async function () {
    // await this.db.close();
    // this.requester.app.close(() => {
    //   console.log("Conexión cerrada");
    // });
  });

  beforeEach(async function () {
    this.timeout(2000);
    await new Promise((resolve) => setTimeout(resolve, 500));
  });
  it("Login de cuenta /api/sessions/login", function (done) {
    const payload = {
      email: "vegan5197@gmail.com",
      password: "123456",
    };

    this.requester
      .post("/api/sessions/login")
      .send(payload)
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(200);
        expect(_body.message).to.be.equals("Login success! welcome");

        jwt = _body.accessToken;
        done();
      })
      .catch((err) => done(err));
  });

  it("Creacion de product /api/products", function (done) {
    this.payload = {
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      price: faker.number.int({ min: 100, max: 5000 }),
      thumbnail: [
        faker.image.avatar(),
        faker.image.avatar(),
        faker.image.avatar(),
      ],
      code: faker.string.alphanumeric(6),
      stock: faker.number.int({ min: 0, max: 1000 }),
      category: faker.commerce.department(),
      status: faker.datatype.boolean(0.1),
    };

    this.requester
      .post("/api/products")
      .send(this.payload)
      .set("Authorization", `Bearer ${jwt}`)
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(201);
        expect(_body.data).to.be.an("object");
        expect(_body.data.title).to.be.equals(this.payload.title);
        expect(_body.message).to.be.equals("Product created successfully");
        this.payload._id = _body.data._id;
        done();
      })
      .catch((err) => done(err));
  });

  it("Update de product /api/products:pid", function (done) {
    const title = faker.commerce.product();
    this.payload.title = title;
    this.payload.description = faker.commerce.productDescription();
    this.payload.price = faker.number.int({ min: 100, max: 5000 });
    this.payload.code = faker.string.alphanumeric(6);
    this.payload.stock = faker.number.int({ min: 0, max: 1000 });
    this.payload.category = faker.commerce.department();
    this.payload.status = faker.datatype.boolean(0.1);

    this.requester
      .put("/api/products/"+this.payload._id)
      .send(this.payload)
      .set("Authorization", `Bearer ${jwt}`)
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(201);
        expect(_body.data).to.be.an("object");
        expect(_body.data.title).to.be.equals(title);
        expect(_body.message).to.be.equals("Product updated successfully");

        done();
      })
      .catch((err) => done(err));
  });

  it("get product /api/products:pid", function (done) {

    this.requester
      .get("/api/products/"+this.payload._id)
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(200);
        expect(_body.data).to.be.an("object");
        expect(_body.data.title).to.be.equals(this.payload.title);
        expect(_body.message).to.be.equals("Product obtained successfully");

        done();
      })
      .catch((err) => done(err));
  });

  it("get all product /api/products", function (done) {

    this.requester
      .get("/api/products")
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(200);
        expect(_body.payload).to.be.an("array");
        expect(_body.message).to.be.equals("Products obtained successfully");
        expect(_body.page).to.be.equals(1)
        done();
      })
      .catch((err) => done(err));
  });

  it("Delete de product /api/products:pid", function (done) {

    this.requester
      .delete("/api/products/"+this.payload._id)
      .set("Authorization", `Bearer ${jwt}`)
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(201);
        expect(_body.data).to.be.an("object");
        expect(_body.data.deletedCount).to.be.equals(1);
        expect(_body.message).to.be.equals("Product removed successfully");

        done();
      })
      .catch((err) => done(err));
  });
});
