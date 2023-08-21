import cron from "node-cron";
import UserManager from "../../domain/managers/userManager.js";

class CronFactory {
  async deleteUsers(time) {
    return cron.schedule(time, async () => {
      const user = new UserManager();
      await user.deleteMany();
    });
  }
}

export default CronFactory;
