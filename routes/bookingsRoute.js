const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingsModel");
const Bus = require("../models/busModel");

const bookingsController = require("../controllers/bookingsController");

// book a seat
router.post("/book-seat", authMiddleware, async (req, res) => {
    bookingsController.bookSeat(req, res);
  });

  // make payment
router.post("/make-payment", authMiddleware, async (req, res) => {
  bookingsController.makePayment(req, res);
});

// get bookings by user id
router.post("/get-bookings-by-user-id", authMiddleware, async (req, res) => {
  bookingsController.getBookingsByUserId(req, res);
});

// get all bookings
router.post("/get-all-bookings", authMiddleware, async (req, res) => {
  bookingsController.getAllBookings(req, res);
});

  module.exports = router;
  