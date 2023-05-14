const express = require("express");
const cors = require("cors");
const app = express();
const winston = require("winston");
const { ElasticsearchTransport } = require("winston-elasticsearch");

app.use(cors());
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const port = process.env.PORT || 5000;
app.use(express.json());

const logger = winston.createLogger({
  level: "info",
  transports: [
    new ElasticsearchTransport({
      level: "info",
      index: "logs",
      clientOpts: {
        node: "http://localhost:9200/",
      },
    }),
  ],
});

app.use((req, res, next) => {
  logger.info({
    message: "API request",
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
  });

  res.on("finish", () => {
    logger.info({
      message: "API response",
      method: req.method,
      path: req.path,
      status: res.statusCode,
    });
  });

  next();
});

const usersRoute = require("./routes/usersRoute");
app.use("/api/users", usersRoute);

const busesRoute = require("./routes/busesRoute");
app.use("/api/buses", busesRoute);

const bookingsRoute = require("./routes/bookingsRoute");
app.use("/api/bookings", bookingsRoute);

app.listen(port, () => console.log(`Node server listening on port ${port}!`));

// require("./logger.js");
// const winston = require("winston");
// const userLogger = winston.loggers.get("userLogger");
// userLogger.info("User Login", { username: "me", time: "time" });
