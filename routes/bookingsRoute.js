const stripe = require("stripe")("sk_test_51N5JrmSJRynLcBpMJwX06OmR6ld25XhPyntpJMShkncosF8eLkTnwqfPRRb5ZcxcIzbmmeuGfAunDzEe4VFhrMFa00kGXi4gmQ");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingsModel");
const Bus = require("../models/busModel");
const { v4: uuidv4 } = require("uuid");

// book a seat

router.post("/book-seat", authMiddleware, async (req, res) => {
    try {
      const newBooking = new Booking({
        ...req.body,
        user: req.body.userId,
      });
      await newBooking.save();
      const bus = await Bus.findById(req.body.bus);
      bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];
      await bus.save();
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
  });

  // make payment

router.post("/make-payment", authMiddleware, async (req, res) => {
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
        receipt_email:token.email,
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
          transactionId: payment.id
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
});

  module.exports = router;
  