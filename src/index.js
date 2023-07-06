import dotenv from "dotenv";
dotenv.config();

import AppFactory from "./presentation/factories/appFactory.js"
import DbFactory from "./data/factories/dbFactory.js";

//********************* Main program *********************
void (async () => {

  const db = DbFactory.create(process.env.DB);
  db.init(process.env.MONGO_DB_URI)

  const app = AppFactory.create();
  app.init();
  app.build();
  app.listen();
})();


