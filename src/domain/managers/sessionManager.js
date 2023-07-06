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
    
    if (!user) {
      throw new Error(`No account found with ${email}`);
    }

    const isHashedPassword = isValidPassword(password, user.password);

    if (!isHashedPassword) {
      throw new Error("Login failed, invalid password.");
    }

    return await generateToken(user);
  }

  async signup(payload) {

    await userCreateValidation.parseAsync(payload);
    //a cart is created and linked to the user
    const cart = await this.cartRepository.create();

    let id_rol = undefined;

    if (payload.isAdmin) {
      id_rol = await this.roleRepository.findOne({ name: "admin" });
    } else {
      id_rol = await this.roleRepository.findOne({ name: "client" });
    }

    if (!id_rol) {
      throw new Error("the role does not exist")
    }

    const dto = {
      ...payload,
      cart: cart.id.toString(),
      password: createHash(payload.password, 10),
      role: id_rol._id.toString(),
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
}

export default SessionManager;
