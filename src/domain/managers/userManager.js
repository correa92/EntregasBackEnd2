import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";

import UserMongooseRepository from "../../data/repositories/mongoose/UserMongooseRepository.js";
import CartMongooseRepository from "../../data/repositories/mongoose/CartMongooseRepository.js";
import MailManager from "./MailManager.js";
class UserManager {
  constructor() {
    this.userRepository = new UserMongooseRepository();
    this.cartRepository = new CartMongooseRepository();
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
  async deleteMany() {
    const classMM = new MailManager();
    dayjs.extend(duration);
    const currentDate = dayjs();
    const subDate = currentDate.subtract(2, "day").toDate();

    const filter = { last_connection: { $lte: subDate } };

    //search for users who will be deleted
    const users = await this.userRepository.find(filter);

    for (let i = 0; i < users.length; i++) {
      const optionMail = {
        from: process.env.SMTP_SENDER_EMAIL_DEFAULT,
        to: users[i].email,
        subject: "Cuenta eliminada",
        company: "CoderHouse",
        email: users[i].email,
      };
      //sending emails to users to delete
      await classMM.send(optionMail, "deleteAccount.hbs");

      //deletion of carts for each user
      await this.cartRepository.deleteOne(users[i].cart);
    }

    //deletion of carts for each user
    const deletedUsers = await this.userRepository.deleteMany(filter);
    return { deletedUsers: users, result: deletedUsers };
  }

  async forgetPassword(dto) {
    const user = await this.userRepository.getOneByEmail(dto.email);
    user.password = dto.password;

    return this.userRepository.updateOne(user.id, user);
  }
}

export default UserManager;
