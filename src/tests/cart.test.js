import { faker } from "@faker-js/faker";
import chai from "chai";
import supertest from "supertest";
import initServer from "./index.js";

const expect = chai.expect;
let jwt = "";

describe("Testing Cart Endpoints Success", () => {
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
      email: "peperoni8129@gmail.com",
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
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });

  it("Creacion de carrito /api/cart", function (done) {
    this.requester
      .post("/api/carts")
      .set("Authorization", `Bearer ${jwt}`)
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(201);
        expect(_body.data).to.be.an("object");
        expect(_body.data.products).to.be.an("array");
        expect(_body.message).to.be.equals("Cart created successfully");
        this.payload.id = _body.data.id;

        done();
      })
      .catch((err) => done(err));
  });

  it("Agregar producto al carrito /api/carts/:cid/products/:pid", function (done) {
    this.product = {
      id: "64ac4f7d56c044cffdc6d713",
    };
    this.requester
      .post(`/api/carts/${this.payload.id}/product/${this.product.id}`)
      .set("Authorization", `Bearer ${jwt}`)
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(201);
        expect(_body.data).to.be.an("object");
        expect(_body.message).to.be.equals(
          "Product added to cart successfully"
        );

        done();
      })
      .catch((err) => done(err));
  });

  it("Obtener carrito especifico /api/carts:cid", function (done) {
    this.requester
      .get("/api/carts/" + this.payload.id)
      .set("Authorization", `Bearer ${jwt}`)
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(200);
        expect(_body.data).to.be.an("object");
        expect(_body.data.id).to.be.equals(this.payload.id);
        expect(_body.message).to.be.equals("Cart obtained successfully");
        done();
      })
      .catch((err) => done(err));
  });

  it("Actualizar cantidad especificada de producto del carrito /api/carts/:cid/products/:pid", function (done) {
    this.requester
      .put(`/api/carts/${this.payload.id}/product/${this.product.id}`)
      .set("Authorization", `Bearer ${jwt}`)
      .send({ quantity: 20 })
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(201);
        expect(_body.data).to.be.an("object");
        expect(_body.message).to.be.equals("Cart updated successfully");

        done();
      })
      .catch((err) => done(err));
  });

  it("Ingresar varios productos en carrito /api/carts/:cid", function (done) {
    this.products = [
      { idProduct: this.product.id, quantity: 7 },
      { idProduct: "64ac4b0a3c5a06e2eb39c894", quantity: 10 },
      { idProduct: "64ac4b65f0b63c3292276590", quantity: 4 },
    ];
    this.requester
      .put(`/api/carts/${this.payload.id}`)
      .set("Authorization", `Bearer ${jwt}`)
      .send(this.products)
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(201);
        expect(_body.data).to.be.an("object");
        expect(_body.data.products).to.be.an("array");
        expect(_body.data.id).to.be.equals(this.payload.id);
        expect(_body.message).to.be.equals("Product list added successfully");

        done();
      })
      .catch((err) => done(err));
  });

  it("Eliminar producto del carrito /api/carts/:cid/products/:pid", function (done) {
    this.requester
      .delete(`/api/carts/${this.payload.id}/product/${this.product.id}`)
      .set("Authorization", `Bearer ${jwt}`)
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(201);
        expect(_body.data).to.be.an("object");
        expect(_body.message).to.be.equals("Product successfully removed");

        done();
      })
      .catch((err) => done(err));
  });

  it("Comprar carrito /api/carts/:cid/purchase", function (done) {
    this.requester
      .get(`/api/carts/${this.payload.id}/purchase`)
      .set("Authorization", `Bearer ${jwt}`)
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(200);
        expect(_body.data).to.be.an("object");
        expect(_body.message).to.be.equals("Buy performs successfully");

        done();
      })
      .catch((err) => done(err));
  });

  it("Vaciar carrito /api/carts/:cid", function (done) {
    this.requester
      .delete(`/api/carts/${this.payload.id}`)
      .set("Authorization", `Bearer ${jwt}`)
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(201);
        expect(_body.data).to.be.an("object");
        expect(_body.message).to.be.equals("All products successfully removed");

        done();
      })
      .catch((err) => done(err));
  });
});
