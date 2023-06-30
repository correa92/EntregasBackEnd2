import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (password, passwordHash) => {
  return bcrypt.compareSync(password, passwordHash);
};
export const generateToken = async (user) => {
  
  const token = jwt.sign(
    { user: { ...user, password: undefined } },
    process.env.PRIVATE_KEY,
    { expiresIn: "1h" }
  );
  return token;
};
