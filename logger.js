const winston = require("winston");

const format = winston.format.printf((info) => {
  return `${info.level.toUpperCase()} - ${info.message}`;
});

winston.loggers.add("userLogger", {
  format: format,
  transports: [
    new winston.transports.File({
      filename: "logs/userLogger.log",
    }),
  ],
});

winston.loggers.add("busesLogger", {
  format: format,
  transports: [
    new winston.transports.File({
      filename: "logs/busesLogger.log",
    }),
  ],
});

winston.loggers.add("bookingLogger", {
  format: format,
  transports: [
    new winston.transports.File({
      filename: "logs/bookingLogger.log",
    }),
  ],
});
