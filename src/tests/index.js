import dotenv from "dotenv";
dotenv.config();

import AppFactory from "../presentation/factories/appFactory.js";
import DbFactory from "../data/factories/dbFactory.js";

const initServer = async () => {
  const db = DbFactory.create(process.env.DB);
  if (db) {
    db.init(process.env.MONGO_DB_URI_TESTS);
  } else {
    throw new Error("No se pudo conectar a la base de datos");
  }

  const app = AppFactory.create();

  app.init();
  app.build();

  return {
    app,
    db,
  };
};

export default initServer;
