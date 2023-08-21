import { faker } from "@faker-js/faker";
import chai from "chai";
import supertest from "supertest";
import initServer from "./index.js";

const expect = chai.expect;
let jwt = "";

// describe("Testing Auth Endpoints Success", () => {
//   before(async function () {
//     const { app, db } = await initServer();
//     const application = app.callback();
//     this.requester = supertest.agent(application);
//     this.app = app;
//     this.db = db;
//     this.payload = {};
//   });

//   after(async function () {
//     // await this.db.close();
//     // this.requester.app.close(() => {
//     //   console.log("Conexión cerrada");
//     // });
//   });

//   beforeEach(async function () {
//     this.timeout(2000);
//     await new Promise((resolve) => setTimeout(resolve, 500));
//   });

//   it("Creacion de cuenta /api/sessions/signup", function (done) {
//     this.payload = {
//       firstName: `${faker.person.firstName()}`,
//       lastName: `${faker.person.lastName()}`,
//       email: faker.internet.email().toLocaleLowerCase(),
//       age: faker.number.int({ min: 18, max: 80 }),
//       password: "123456",
//       isAdmin: false,
//     };

//     this.requester
//       .post("/api/sessions/signup")
//       .send(this.payload)
//       .then((result) => {
//         const { _body, status } = result;
//         expect(status).to.be.equals(201);
//         expect(_body.user.email).to.be.equals(this.payload.email);
//         expect(_body.message).to.be.equals("User created.");
//         done();
//       })
//       .catch((err) => done(err));
//   });

//   it("Login de cuenta /api/sessions/login", function (done) {
//     const payload = {
//       email: this.payload.email,
//       password: this.payload.password,
//     };

//     this.requester
//       .post("/api/sessions/login")
//       .send(payload)
//       .then((result) => {
//         const { _body, status } = result;

//         expect(status).to.be.equals(200);
//         expect(_body.message).to.be.equals("Login success! welcome");

//         jwt = _body.accessToken;
//         done();
//       })
//       .catch((err) => done(err));
//   });

//   it("Current /api/sessions/current", function (done) {

//     this.requester
//       .get("/api/sessions/current")
//       .set("Authorization", `Bearer ${jwt}`)
//       .then((result) => {
//         const { _body, status } = result;
//         expect(status).to.be.equals(200);
//         expect(_body.payload.email).to.be.equals(this.payload.email);
//         done();
//       })
//       .catch((err) => done(err));
//   });

//   it("Logout /api/sessions/logout", function (done) {
//     this.requester
//       .post("/api/sessions/logout")
//       .then((result) => {
//         const { _body, status } = result;

//         expect(status).to.be.equals(201);
//         expect(_body.message).to.be.equals("Logout success!");
//         done();
//       })
//       .catch((err) => done(err));
//   });

//   it("Forget-password api/sessions/forget-password", function (done) {
//     const payload = {
//       email : this.payload.email,
//       password : "newPassword"
//     }

//     this.requester
//       .post("/api/sessions/forget-password")
//       .send(payload)
//       .then((result) => {
//         const { _body, status } = result;

//         expect(status).to.be.equals(201);
//         expect(_body.message).to.be.equals("User change password.");
//         done();
//       })
//       .catch((err) => done(err));
//   });
// });

describe("Testing Auth Endpoints Failed", () => {
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

  it("Creacion de cuenta - Nombre corto /api/sessions/signup", function (done) {
    this.payload = {
      firstName: `a`,
      lastName: `${faker.person.lastName()}`,
      email: faker.internet.email().toLocaleLowerCase(),
      age: faker.number.int({ min: 18, max: 80 }),
      password: "123456",
      isAdmin: false,
    };

    this.requester
      .post("/api/sessions/signup")
      .send(this.payload)
      .then((result) => {
        const { _body, status } = result;
        expect(status).to.be.equals(400);
        expect(_body.message[0].code).to.be.equals("too_small");
        done();
      })
      .catch((err) => done(err));
  });

  it("Login de cuenta - correo inexistente /api/sessions/login", function (done) {
    const data = {
      email: "correo@correo.com",
      password: "165416",
    };

    this.requester
      .post("/api/sessions/login")
      .send(data)
      .then((result) => {
        const { _body, status } = result;
        console.log("_body: ", _body);

        expect(status).to.be.equals(400);
        expect(_body.message).to.be.equals(
          `No account found with ${data.email}`
        );

        jwt = _body.accessToken;
        done();
      })
      .catch((err) => done(err));
  });

  it("Login de cuenta - password incorrecto /api/sessions/login", function (done) {
    const data = {
      email: "Tara.Walter@hotmail.com",
      password: "654321",
    };
    this.requester
      .post("/api/sessions/login")
      .send(data)
      .then((result) => {
        const { _body, status } = result;

        expect(status).to.be.equals(401);
        expect(_body.message).to.be.equals(`Login failed, invalid password.`);

        done();
      })
      .catch((err) => done(err));
  });
});
