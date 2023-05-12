const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const usersController = require("../controllers/usersController");

// register new user
router.post("/register", async (req, res) => {
  usersController.registerUser(req, res);
});

// login user
router.post("/login", async (req, res) => {
 usersController.loginUser(req, res);
});

// get user by id
router.post("/get-user-by-id", authMiddleware, async (req, res) => {
  usersController.getUserById(req, res);
});

// get all users
router.post("/get-all-users", authMiddleware, async (req, res) => {
 usersController.getAllUsers(req, res);
});

// update user
router.post("/update-user-permissions", authMiddleware, async (req, res) => {
  usersController.updateUser(req, res);
});


module.exports = router;
