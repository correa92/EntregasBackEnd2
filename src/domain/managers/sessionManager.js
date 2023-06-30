import CartMongooseDao from "../../data/dao/CartMongooseDao.js";
import UserMongooseDao from "../../data/dao/UserMongooseDao.js";
import RoleMongooseDao from "../../data/dao/roleMongooseDao.js";
import {
  createHash,
  generateToken,
  isValidPassword,
} from "../../shared/shared.js";
import loginValidation from "../validations/session/loginValidation.js";
import userCreateValidation from "../validations/user/userCreateValidation.js";

class SessionManager {
  constructor() {
    this.userDao = new UserMongooseDao();
    this.cartDao = new CartMongooseDao();
    this.roleDao = new RoleMongooseDao();
  }

  async login(email, password) {
    await loginValidation.parseAsync({ email, password });

    const user = await this.userDao.getOneByEmail(email);


    const isHashedPassword = isValidPassword(password, user.password);

    if (!isHashedPassword) {
      throw new Error("Login failed, invalid password.");
    }

    return await generateToken(user);
  }

  async signup(payload) {
    await userCreateValidation.parseAsync(payload);
    //a cart is created and linked to the user
    const cart = await this.cartDao.create();

    let id_rol = undefined;

    if (payload.isAdmin) {
      id_rol = await this.roleDao.findOne({ name: "admin" });
    } else {
      id_rol = await this.roleDao.findOne({ name: "client" });
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
    
    const user = await this.userDao.create(dto);

    return { ...user, password: undefined };
  }

  async forgetPassword(email, password) {
    await loginValidation.parseAsync({ email, password });

    const user = await this.userDao.getOneByEmail(email);

    const dto = {
      ...user,
      password: createHash(password, 10),
    };

    return await this.userDao.updateOne(user.id, dto);
  }
}

export default SessionManager;
