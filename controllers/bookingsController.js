const Booking = require("../models/bookingsModel");
const Bus = require("../models/busModel");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51N5JrmSJRynLcBpMJwX06OmR6ld25XhPyntpJMShkncosF8eLkTnwqfPRRb5ZcxcIzbmmeuGfAunDzEe4VFhrMFa00kGXi4gmQ"
);
// require("../logger.js");
// const winston = require("winston");
// const bookingLogger = winston.loggers.get("bookingLogger");
//book a seat
exports.bookSeat = async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      user: req.body.userId,
    });
    //console.log(req.body);
    await newBooking.save();
    const bus = await Bus.findById(req.body.bus);
    bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];
    await bus.save();
    let numTickets = req.body.seats.length;
    // bookingLogger.info(
    //   `${new Date().toISOString()} ${bus.number} ${bus.from} ${bus.to} ${
    //     bus.journeyDate
    //   } ${bus.fare} ${numTickets} ${req.body.userId} booking - success`
    // );
    res.status(200).send({
      message: "Booking successful",
      data: newBooking,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Booking failed",
      data: error,
      success: false,
    });
  }
};

// make payment
exports.makePayment = async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.paymentIntents.create(
      {
        amount: amount,
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email,
        automatic_payment_methods: {
          enabled: true,
        },
      },
      {
        idempotencyKey: uuidv4(), //To avoid charging multiple times for the same customer
      }
    );

    if (payment) {
      res.status(200).send({
        message: "Payment successful",
        data: {
          transactionId: payment.id,
        },
        success: true,
      });
    } else {
      res.status(500).send({
        message: "Payment failed",
        data: error,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Payment failed",
      data: error,
      success: false,
    });
  }
};

// get bookings by user id
exports.getBookingsByUserId = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId })
      .populate("bus")
      .populate("user");
    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
};

// get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("bus").populate("user");
    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
};
