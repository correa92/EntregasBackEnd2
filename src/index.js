import express from "express";
import MongoStore from "connect-mongo";
// import { resolve } from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";

import initializePassport from "./config/passport.config.js";
import productsRoute from "./routers/productsRoute.js";
import cartsRoute from "./routers/cartsRoute.js";
import sessionRoute from "./routers/sessionRoute.js";
import userRouter from "./routers/userRoute.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./middleware/logger.js";

//********************************************* Main program *********************************************
void (async () => {
  try {
    const SERVER_PORT = 8080;
    dotenv.config();

    await mongoose.connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(
      session({
        store: MongoStore.create({
          mongoUrl: process.env.MONGO_DB_URI,
          ttl: 15,
        }),
        secret: "passwordSecret",
        resave: false,
        saveUninitialized: false,
      })
    );

    initializePassport();
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(logger);

    app.use("/api/sessions", sessionRoute);
    app.use("/api/users", userRouter);
    app.use("/api/products", productsRoute);
    app.use("/api/carts", cartsRoute);
    app.use(errorHandler);

    app.listen(SERVER_PORT, () => {
      console.log(`Desde el puerto ${SERVER_PORT} con express`);
    });
  } catch (error) {
    console.log(error);
  }
})();
