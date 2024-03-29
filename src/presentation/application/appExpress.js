import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import compression from "express-compression";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { resolve } from "path";
import cors from "cors";
import helmet from "helmet";

import sessionRouter from "../routers/sessionRoute.js";
import userRouter from "../routers/userRoute.js";
import roleRouter from "../routers/roleRouter.js";
import productsRoute from "../../presentation/routers/productsRoute.js";
import cartsRoute from "../../presentation/routers/cartsRoute.js";
import errorHandler from "../middleware/errorHandler.js";
import { devLogger } from "../middleware/logger.js";

class AppExpress {
  init() {
    this.app = express();

    const docsPath = resolve("./src");
    const swaggerOptions = {
      definition: {
        openapi: "3.0.1",
        info: {
          title: "Documentación Ecommerce Coderhouse",
          description:
            "Proyecto final del curso de backend por Correa Alejandro E.",
        },
      },
      apis: [`${docsPath}/docs/**/*.yaml`],
    };
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.static(`${docsPath}/presentation/public`));
    this.app.use(cookieParser());
    const specs = swaggerJSDoc(swaggerOptions);
    this.app.use(
      "/api/docs",
      swaggerUiExpress.serve,
      swaggerUiExpress.setup(specs)
    );

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

    this.app.use(devLogger);
    this.app.use(
      compression({
        brotli: {
          enabled: true,
          zlib: {},
        },
      })
    );
  }

  build() {
    this.app.use("/api/sessions", sessionRouter);
    this.app.use("/api/users", userRouter);
    this.app.use("/api/roles", roleRouter);
    this.app.use("/api/products", productsRoute);
    this.app.use("/api/carts", cartsRoute);
    this.app.use(errorHandler);
  }
  callback() {
    return this.app;
  }

  close() {
    this.server.close();
  }

  listen() {
    return this.app.listen(process.env.PORT || 8080, () => {
      console.log(`Desde el puerto ${process.env.PORT} con express`);
    });
  }
}

export default AppExpress;
