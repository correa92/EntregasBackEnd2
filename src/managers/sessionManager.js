import CartMongooseDao from "../dao/CartMongooseDao.js";
import UserMongooseDao from "../dao/UserMongooseDao.js";
import {
  createHash,
  generateToken,
  isValidPassword,
} from "../shared/shared.js";
import loginValidation from "../validations/session/loginValidation.js";
import userCreateValidation from "../validations/user/userCreateValidation.js";

class SessionManager {
  constructor() {
    this.userDao = new UserMongooseDao();
    this.cartDao = new CartMongooseDao();
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

    const dto = {
      ...payload,
      cart: cart.id.toString(),
      password: createHash(payload.password, 10),
    };

    const user = await this.userDao.create(dto);

    return { ...user, password: undefined };
  }

  async forgetPassword(email, password) {
    await loginValidation.parseAsync({ email, password });

    const user = await this.userDao.getOneByEmail(email);

    if (!user) {
      throw new Error("don't exist user ");
    }

    const dto = {
      ...user,
      password : createHash(password,10)
    }

    return await this.userDao.updateOne(user.id, dto);
    
  }
}

export default SessionManager;
