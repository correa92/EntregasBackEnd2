import { Command } from "commander";
import RoleManager from "../../domain/managers/roleManager.js";
import { prodLogger } from "../middleware/logger.js";

const addRole = new Command("addRole");

addRole
  .version("0.0.1", "-v, --vers", "Output the current version")
  .description("add user from command line")
  .option("-n, --name <name>", "Role name")
  .option("-p, --permissions <permissions>", "Arrays with permissions")

  .action(async (env) => {
    const permissions = env.permissions.split(" ");

    const payload = {
      ...env,
      permissions,
    };

    const classRM = new RoleManager();
    const role = await classRM.create(payload);
    if (role) {
      console.log("Role created successfully");
    }
  });

export default addRole;
