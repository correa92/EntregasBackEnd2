import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

import sessionRouter from "../routers/sessionRoute.js";
import userRouter from "../routers/userRoute.js";
import roleRouter from "../routers/roleRouter.js";
import mailRouter from "../routers/mailRoute.js";
import productsRoute from "../../presentation/routers/productsRoute.js";
import cartsRoute from "../../presentation/routers/cartsRoute.js";
import errorHandler from "../middleware/errorHandler.js";
import logger from "../middleware/logger.js";

class AppExpress {
  init() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(
      session({
        store: MongoStore.create({
          mongoUrl: process.env.MONGO_DB_URI,
          ttl: 60 * 60, //h/m/s 24*60*60
        }),
        secret: "passwordSecret",
        resave: false,
        saveUninitialized: false,
      })
    );
    this.app.use(logger);
  }

  build() {
    this.app.use("/api/sessions", sessionRouter);
    this.app.use("/api/users", userRouter);
    this.app.use("/api/roles", roleRouter);
    this.app.use("/api/products", productsRoute);
    this.app.use("/api/carts", cartsRoute);
    this.app.use("/api/mail", mailRouter);
    this.app.use(errorHandler);
  }
  callback()
  {
      return this.app;
  }

  close()
  {
      this.server.close();
  }

  listen() {
    return this.app.listen(process.env.SERVER_PORT || 8080, () => {
      console.log(`Desde el puerto ${process.env.SERVER_PORT} con express`);
    });
  }
}

export default AppExpress;
