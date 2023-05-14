const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(express.json());

const usersRoute = require("./routes/usersRoute");
app.use("/api/users", usersRoute);

const busesRoute = require("./routes/busesRoute");
app.use("/api/buses", busesRoute);

const bookingsRoute = require("./routes/bookingsRoute");
app.use("/api/bookings", bookingsRoute);

app.listen(port, () => {
});

module.exports = {app};
