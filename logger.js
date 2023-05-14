const winston = require("winston");

const format = winston.format.printf((info) => {
  return `${info.timestamp} ${info.level.toUpperCase()} - ${info.message}`;
});

winston.loggers.add("userLogger", {
  format: winston.format.combine(winston.format.timestamp(), format),
  transports: [
    new winston.transports.File({
      filename: "logs/userLogger.log",
    }),
  ],
});

winston.loggers.add("busesLogger", {
  format: winston.format.combine(winston.format.timestamp(), format),
  transports: [
    new winston.transports.File({
      filename: "logs/busesLogger.log",
    }),
  ],
});

winston.loggers.add("bookingLogger", {
  format: winston.format.combine(winston.format.timestamp(), format),
  transports: [
    new winston.transports.File({
      filename: "logs/bookingLogger.log",
    }),
  ],
});
