import winston from "winston";

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    fatal: "red",
    error: "orange",
    warning: "yellow",
    info: "blue",
    debug: "white",
  },
};

const loggerConfig = {
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./src/docs/logs/error.log",
      level: "warning",
      format: winston.format.simple(),
    }),
  ],
};

const loggerWinston = winston.createLogger(loggerConfig);

export const devLogger = (req, res, next) => {
  
  req.logger = loggerWinston;
  req.logger.info(
    `[${new Date().toLocaleTimeString()}] ${req.method} en ${req.path} }`
  );
  next();
};

export const prodLogger = (req, res, next) => {
  req.logger = loggerWinston;
  req.logger.warning('Alerta!');
  next();
};
