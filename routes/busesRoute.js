const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const busesController = require("../controllers/busesController");

// add-bus
router.post("/add-bus", authMiddleware, async (req, res) => {
  busesController.addBus(req, res);  
});

// get-all-buses
router.post("/get-all-buses", authMiddleware, async (req, res) => {
  busesController.getAllBuses(req, res);
});

// update-bus
router.post("/update-bus", authMiddleware, async (req, res) => {
    busesController.updateBus(req, res);
  });

// delete-bus
router.post("/delete-bus", authMiddleware, async (req, res) => {
    busesController.deleteBus(req, res);
  });

// get-bus-by-id
router.post("/get-bus-by-id", authMiddleware, async (req, res) => {
  busesController.getBusById(req, res);

});

module.exports = router;
