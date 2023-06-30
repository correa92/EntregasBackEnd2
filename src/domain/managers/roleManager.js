import RoleMongooseDao from "../../data/dao/roleMongooseDao.js";

class RoleManager {
  constructor() {
    this.roleDao = new RoleMongooseDao();
  }

  async paginate(criteria) {
    return this.roleDao.paginate(criteria);
  }

  async getOne(id) {
    return this.roleDao.getOne(id);
  }

  async create(data) {
    const { name, permissions } = data;

    const dato = await this.roleDao.findOne({ name });

    if (!dato) {
      const newRol = {
        name: name,
        permissions: [permissions],
      };
      return await this.roleDao.create(newRol);
    } else {
      throw new Error("The role already exists");
    }
  }

  async updateOne(id, data) {
    return await this.roleDao.addPermissions(id, data.permissions);
  }

  async deleteOne(id) {
    return this.roleDao.deleteOne(id);
  }
}

export default RoleManager;
