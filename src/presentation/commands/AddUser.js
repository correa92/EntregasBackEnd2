import { Command } from "commander";
import SessionManager from "../../domain/managers/sessionManager.js";

const addUser = new Command("addUser");

addUser
  .version("0.0.1", "-v, --vers", "output the current version")
  .description("add user from command line")
  .option("-e, --email <email>", "User`s email")
  .option("-fn, --firstName <firstName>", "User`s first name")
  .option("-ln, --lastName <lastName>", "User`s last name")
  .option("-p, --password <password>", "User`s password")
  .option("-a, --age <age>", "User`s age")
  .option("-ia, --isAdmin <isAdmin>", "User`s isAdmin")
  .action(async (env) => {

    const payload = {
      ...env,
      age: env.age ? parseInt(env.age) : undefined,
      isAdmin: env.isAdmin === "true" ? true : false,
      terminal: true
    };

    const classSM = new SessionManager();
    const user = await classSM.signup(payload);
    if (user) {
      console.log("User created successfully");
    }
  });

export default addUser;
