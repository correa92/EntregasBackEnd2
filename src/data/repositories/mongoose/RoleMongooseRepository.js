import roleSchema from "../../models/mongoose/roleSchema.js";
import Role from "../../../domain/entities/Role.js";
class RoleMongooseRepository {
  async paginate(criteria) {
    const { limit = 5, page = 1 } = criteria;
    const roleDocuments = await roleSchema.paginate({}, { limit, page });
    const { docs, ...pagination } = roleDocuments;

    const roles = docs.map(
      (document) =>
        new Role(document)
    );

    return { roles, pagination };
  }

  async findOne(filter) {
    const role = await roleSchema.findOne(filter);
    return new Role(role);
  }

  async addPermissions(id, permission) {
    let roleDocument = await roleSchema.findOne({
      _id: id,
    });

    if (roleDocument.permissions.includes(permission)) {
      throw new Error("the permission already exists");
    } else {
      roleDocument = await roleSchema.findOneAndUpdate(
        { _id: id },
        { $push: { permissions: permission } },
        { new: true }
      );
    }

    return new Role(roleDocument);
  }

  async getOne(id) {
    const roleDocument = await roleSchema.findOne({ _id: id });

    if (!roleDocument) {
      throw new Error("Role dont exist.");
    }

    return new Role(roleDocument);
  }

  async create(data) {
    const roleDocument = await roleSchema.create(data);

    return new Role(roleDocument);
  }

  async updateOne(id, data) {
    const roleDocument = await roleSchema.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    if (!roleDocument) {
      throw new Error("Role dont exist.");
    }

    return new Role(roleDocument);
  }

  async deleteOne(id) {
    return roleSchema.deleteOne({ _id: id });
  }
}

export default RoleMongooseRepository;
