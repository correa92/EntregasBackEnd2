import dayjs from "dayjs";
import { resolve } from "path";
import fs from "fs";
import Handlebars from "handlebars";

import CartMongooseRepository from "../../data/repositories/mongoose/CartMongooseRepository.js";
import UserMongooseRepository from "../../data/repositories/mongoose/UserMongooseRepository.js";
import RoleMongooseRepository from "../../data/repositories/mongoose/RoleMongooseRepository.js";
import {
  createHash,
  generateToken,
  isValidPassword,
} from "../../shared/shared.js";
import loginValidation from "../validations/session/loginValidation.js";
import userCreateValidation from "../validations/user/userCreateValidation.js";
class SessionManager {
  constructor() {
    this.userRepository = new UserMongooseRepository();
    this.cartRepository = new CartMongooseRepository();
    this.roleRepository = new RoleMongooseRepository();
  }

  async login(email, password) {
    await loginValidation.parseAsync({ email, password });

    const user = await this.userRepository.getOneByEmail(email);

    if (user.id == undefined) {
      throw new Error(`No account found with ${email}`);
    }

    const isHashedPassword = isValidPassword(password, user.password);

    if (!isHashedPassword) {
      throw new Error("Login failed, invalid password.");
    }

    this.userRepository.updateOne(user.id, { last_connection: dayjs() });

    return await generateToken(user, "1h");
  }

  async signup(payload) {
    await userCreateValidation.parseAsync(payload);
    //a cart is created and linked to the user
    const cart = await this.cartRepository.create();
    let role = undefined;

    //terminal comes only from commander
    if (!payload?.terminal && payload.isAdmin) {
      payload.isAdmin = false;
    }

    if (payload?.terminal && payload.isAdmin) {
      role = await this.roleRepository.findOne({ name: "admin" });
    } else {
      role = await this.roleRepository.findOne({ name: "client" });
    }
    delete payload?.terminal;

    if (role.id === undefined) {
      throw new Error("the role does not exist");
    }

    const dto = {
      ...payload,
      cart: cart.id,
      password: createHash(payload.password, 10),
      role: role.id,
    };

    const user = await this.userRepository.create(dto);
    return { ...user, password: undefined };
  }

  async forgetPassword(email, password) {
    await loginValidation.parseAsync({ email, password });

    const user = await this.userRepository.getOneByEmail(email);

    const dto = {
      ...user,
      password: createHash(password, 10),
    };

    return await this.userRepository.updateOne(user.id, dto);
  }

  async recoveringPassword(token) {
    const templatePath = resolve(
      `./src/presentation/views/forgotPassword/recoveringPassword.hbs`
    );
    const source = fs.readFileSync(templatePath).toString();
    const template = Handlebars.compile(source);

    const html = template({
      urlToken: `http://localhost:${process.env.PORT}/api/sessions/forget-password/${token}`,
    });
    return html;
  }

  async logOut(id, data) {
    return this.userRepository.updateOne(id, data);
  }
}

export default SessionManager;
