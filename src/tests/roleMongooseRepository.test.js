import dotenv from "dotenv";
dotenv.config();

import { faker } from "@faker-js/faker";
import DbFactory from "../data/factories/dbFactory.js";
import chai from "chai";

const expect = chai.expect;

const db = DbFactory.create(process.env.DB);

import RoleMongooseRepository from "../data/repositories/mongoose/RoleMongooseRepository.js";

describe("Testing Role Mongoose Repository", () => {
  before(function () {
    db.init(process.env.MONGO_DB_URI_TESTS);
    this.roleRepository = new RoleMongooseRepository();
    this.role = {};
  });
  after(function () {
    db.drop();
    // db.close();
  });
  beforeEach(async function () {
    this.timeout(2000);
    await new Promise((resolve) => setTimeout(resolve, 500));
  });
  it("El repositorio debe ser una instancia de RoleMongooseRepository", function () {
    expect(this.roleRepository instanceof RoleMongooseRepository).to.be.ok;
  });

  it("El repositorio debe devolver un arreglo", function () {
    return this.roleRepository
      .paginate({ limit: 5, page: 1 })
      .then((result) => {
        expect(Array.isArray(result.roles)).to.be.equals(true);
        expect(result.pagination.limit).to.be.equals(5);
        expect(result.pagination.page).to.be.equals(1);
        expect(result.pagination.prevPage).to.be.equal(null);
      });
      
  });

  it("El repositorio debe crear un role", function () {
    const newRole = {
      name: "client",
      permissions: "sendMessage",
    };
    return this.roleRepository.create(newRole).then((result) => {
      this.role = {
        id: result.id,
        name: result.name,
        permissions: result.permissions,
      };
      expect(result.name).to.be.equals(newRole.name);
      expect(result.permissions).to.include(newRole.permissions);
    });
  });

  it("El repositorio debe obtener un role", function () {
    return this.roleRepository.getOne(this.role.id).then((result) => {
      const permissions = "sendMessage";
      expect(result.name).to.be.equals(this.role.name);
      expect(result.permissions).to.include(permissions);
    });
  });
  it("El repositorio debe agregar un permission", function () {
    const newPermission = "otherPermission";
    return this.roleRepository
      .addPermissions(this.role.id, newPermission)
      .then((result) => {
        expect(result.name).to.be.equals(this.role.name);
        expect(result.permissions).to.include(newPermission);
      });
  });

  it("El repositorio debe modificar un rol/permission", function () {
    const newDatas = {
      name: "cliente-updated",
      permissions: "newPermission",
    };
    return this.roleRepository
      .updateOne(this.role.id, newDatas)
      .then((result) => {
        expect(result.name).to.be.equals(newDatas.name);
        expect(result.permissions).to.include(newDatas.permissions);
      });
  });
});
