import RoleMongooseRepository from "../../data/repositories/mongoose/RoleMongooseRepository.js";

class RoleManager {
  constructor() {
    this.roleRepository = new RoleMongooseRepository();
  }

  async paginate(criteria) {
    return this.roleRepository.paginate(criteria);
  }

  async getOne(id) {
    return this.roleRepository.getOne(id);
  }

  async create(data) {
    const { name, permissions } = data;
    const dato = await this.roleRepository.findOne({ name });

    if (dato.name === undefined) {
      const newRol = {
        name: name,
        permissions: permissions,
      };
      return await this.roleRepository.create(newRol);
    } else {
      throw new Error("The role already exists");
    }
  }

  async updateOne(id, data) {
    return await this.roleRepository.addPermissions(id, data.permissions);
  }

  async deleteOne(id) {
    return this.roleRepository.deleteOne(id);
  }
}

export default RoleManager;
