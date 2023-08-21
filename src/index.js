import dotenv from "dotenv";
dotenv.config();

import AppFactory from "./presentation/factories/appFactory.js";
import DbFactory from "./data/factories/dbFactory.js";
import CronFactory from "./presentation/factories/cronFactory.js";

//********************* Main program *********************
void (async () => {
  const db = DbFactory.create(process.env.DB);
  db.init(process.env.MONGO_DB_URI);

  const app = AppFactory.create();
  app.init();
  app.build();
  app.listen();

  const cronFactory = new CronFactory();
  const taskDeleteUsers = await cronFactory.deleteUsers(process.env.CRON);
  taskDeleteUsers.start();
})();
