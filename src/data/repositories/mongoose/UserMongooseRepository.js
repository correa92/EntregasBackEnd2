import userSchema from "../../models/mongoose/userSchema.js";
import User from "../../../domain/entities/User.js";
import Role from "../../../domain/entities/Role.js";

class UserMongooseRepository {
  async paginate(criteria) {
    const { limit = 5, page = 1 } = criteria;

    const userDocuments = await userSchema.paginate({}, { limit, page });
    const { docs, ...pagination } = userDocuments;

    const users = docs.map((document) => {
      document.password = undefined;
      return new User(document);
    });

    return { users, pagination };
  }

  async getOne(id) {
    const userDocument = await userSchema.findOne({ _id: id });

    if (!userDocument) {
      throw new Error("User dont exist.");
    }
    userDocument.password = undefined;
    return new User(userDocument);
  }

  async getOneByEmail(email) {
    const userDocument = await userSchema.findOne({ email });
    return new User(userDocument);
  }

  async create(data) {
    const userDocument = await userSchema.create(data);

    if (!userDocument) {
      throw new Error("Could not create document");
    }

    return new User(userDocument);
  }

  async updateOne(id, data) {
    const userDocument = await userSchema.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    if (!userDocument) {
      throw new Error("User dont exist.");
    }

    return new User(userDocument);
  }

  async deleteOne(id) {
    return await userSchema.deleteOne({ _id: id });
  }
}

export default UserMongooseRepository;
