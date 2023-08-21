import userSchema from "../../models/mongoose/userSchema.js";
import User from "../../../domain/entities/User.js";

class UserMongooseRepository {
  async paginate(criteria) {
    const { limit = 5, page = 1 } = criteria;

    const userDocuments = await userSchema.paginate({}, { limit, page });
    const { docs, ...pagination } = userDocuments;

    const users = docs.map((document) => {
      document.password = undefined;
      return new User({
        id: document._id,
        firstName: document?.firstName,
        email: document?.email,
        role: document?.role.name,
      });
    });

    return { users, pagination };
  }
  async find(filter) {
    const userDocument = await userSchema.find(filter);

    if (!userDocument) {
      throw new Error("Users dont exist.");
    }
    userDocument.password = undefined;

    const users = userDocument.map((u) => {
      return new User({ id: u?._id, email: u?.email, cart: u?.cart});
    });
    return users;
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

  async updateDocuments(id, data) {
    const userDocument = await userSchema.findOneAndUpdate(
      { _id: id },
      { $push: { documents: data } },
      { new: true }
    );

    if (!userDocument) {
      throw new Error("The document does not exist");
    }
    return new User(userDocument);
  }

  async deleteOne(id) {
    return await userSchema.deleteOne({ _id: id });
  }

  async deleteMany(filter) {
    const userDocuments = await userSchema.deleteMany(filter);

    return userDocuments;
  }
}

export default UserMongooseRepository;
