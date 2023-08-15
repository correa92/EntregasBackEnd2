import UserMongooseRepository from "../../data/repositories/mongoose/UserMongooseRepository.js";

class UserManager {
  constructor() {
    this.userRepository = new UserMongooseRepository();
  }

  async paginate(criteria) {
    return this.userRepository.paginate(criteria);
  }

  async getOneByEmail(email) {
    return this.userRepository.getOneByEmail(email);
  }

  async getOne(id) {
    return this.userRepository.getOne(id);
  }

  async create(data) {
    const userExist = await this.getOneByEmail(data.email);

    if (userExist.id === undefined) {
      return await this.userRepository.create(data);
    }

    return { password: undefined };
  }

  async updateOne(id, data) {
    return this.userRepository.updateOne(id, data);
  }

  async updateDocuments(id, data) {
    return this.userRepository.updateDocuments(id, data);
  }


  async deleteOne(id) {
    return this.userRepository.deleteOne(id);
  }

  async forgetPassword(dto) {
    const user = await this.userRepository.getOneByEmail(dto.email);
    user.password = dto.password;

    return this.userRepository.updateOne(user.id, user);
  }
}

export default UserManager;
