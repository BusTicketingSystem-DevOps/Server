const Bus = require("../models/busModel");
// require("../logger.js");
// const winston = require("winston");
// const busesLogger = winston.loggers.get("busesLogger");
// add-bus
exports.addBus = async (req, res) => {
  try {
    const existingBus = await Bus.findOne({ number: req.body.number });
    if (existingBus) {
      // busesLogger.warn(
      //   `${new Date().toISOString()} ${req.body.number} add - already_exists`
      // );
      return res.status(200).send({
        success: false,
        message: "Bus already exists",
      });
    }
    const newBus = new Bus(req.body);
    await newBus.save();
    // busesLogger.info(
    //   `${new Date().toISOString()} ${req.body.number} add - success`
    // );
    return res.status(200).send({
      success: true,
      message: "Bus added successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// get-all-buses
exports.getAllBuses = async (req, res) => {
  try {
    const finalbus = [];
    if (req.body.filters) {
      console.log("from:", req.body.filters.from);
      let bus = null;
      if (req.body.filters.from) {
        bus = await Bus.find({ from: req.body.filters.from });
      } else {
        bus = await Bus.find(req.body.filters);
      }
      for (b of bus) {
        const bus2 = await Bus.find({ from: b.to });
        for (b2 of bus2) {
          if (b2.to === req.body.filters.to || req.body.filters.to === null) {
            finalbus.push([b, b2]);
          }
        }
      }
      console.log("buses", finalbus);
    }
    const buses = await Bus.find(req.body.filters);
    return res.status(200).send({
      success: true,
      message: "Buses fetched successfully",
      data: buses,
      multi: finalbus,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// update-bus
exports.updateBus = async (req, res) => {
  try {
    await Bus.findByIdAndUpdate(req.body._id, req.body);
    // busesLogger.info(
    //   `${new Date().toISOString()} ${req.body.number} update - success`
    // );
    return res.status(200).send({
      success: true,
      message: "Bus updated successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// delete-bus
exports.deleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.body._id);
    // busesLogger.info(
    //   `${new Date().toISOString()} ${req.body.number} delete - success`
    // );
    return res.status(200).send({
      success: true,
      message: "Bus deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// get-bus-by-id
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.body._id);
    // busesLogger.info(
    //   `${new Date().toISOString()} ${bus.number} find - success`
    // );
    return res.status(200).send({
      success: true,
      message: "Bus fetched successfully",
      data: bus,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
