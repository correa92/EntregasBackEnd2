import dotenv from "dotenv";
dotenv.config();

import { faker } from "@faker-js/faker";
import DbFactory from "../data/factories/dbFactory.js";
import chai from "chai";

const expect = chai.expect;

const db = DbFactory.create(process.env.DB);

import UserMongooseRepository from "../data/repositories/mongoose/UserMongooseRepository.js";

describe("Testing User Mongoose Repository", () => {
  before(function () {
    db.init(process.env.MONGO_DB_URI_TESTS);
    this.userRepository = new UserMongooseRepository();
    this.user = {};
  });
  after(function () {
    db.drop();
    // db.close();
  });
  beforeEach(async function () {
    this.timeout(2000);
    await new Promise((resolve) => setTimeout(resolve, 500));
  });
  it("El repositorio debe ser una instancia de UserMongooseRepository", function () {
    expect(this.userRepository instanceof UserMongooseRepository).to.be.ok;
  });
  it("El repositorio debe devolver un arreglo", function () {
    return this.userRepository
      .paginate({ limit: 5, page: 1 })
      .then((result) => {
        expect(Array.isArray(result.users)).to.be.equals(true);
        expect(result.pagination.limit).to.be.equals(5);
        expect(result.pagination.page).to.be.equals(1);
        expect(result.pagination.prevPage).to.be.equal(null);
      });
  });
  it("El repositorio debe poder crear un user", function () {
    this.user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      age: 18,
      isAdmin: false,
      password: "123456",
    };

    return this.userRepository.create(this.user).then((result) => {
      this.user.id = result.id;
      expect(result.firstName).to.be.equals(this.user.firstName);
      expect(result.email).to.be.equals(this.user.email);
    });
  });

  it("El repositorio debe obtener un user", function () {
    return this.userRepository.getOne(this.user.id).then((result) => {
      expect(result.firstName).to.be.equals(this.user.firstName);
      expect(result.email).to.be.equals(this.user.email);
      expect(result.lastName).to.be.equals(this.user.lastName);
      expect(result.age).to.be.equals(this.user.age);
      expect(result.password).to.be.equals(this.user.password);
      expect(result.isAdmin).to.be.equals(this.user.isAdmin);
    });
  });

  it("El repositorio debe actualizar un user", function () {
    const newData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
    };
    return this.userRepository
      .updateOne(this.user.id, newData)
      .then((result) => {
        expect(result.firstName).to.be.equals(newData.firstName);
        expect(result.email).to.be.equals(newData.email);
        expect(result.lastName).to.be.equals(newData.lastName);
      });
  });

  it("El repositorio debe eliminar un user", function () {
    return this.userRepository.deleteOne(this.user.id).then((result) => {
      expect(result.deletedCount).to.be.equals(1);
    });
  });
});
