const User = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register new user
exports.registerUser = async(req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(500).send({
            message: "User already exists",
            success: false,
            data: null,
          });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).send({
          message: "User created successfully",
          success: true,
          data: null,
        });
      } catch (error) {
        res.status(500).send({
          message: error.message,
          success: false,
          data: null,
        });
      }
}

// login user
exports.loginUser = async(req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (!userExists) {
          return res.status(500).send({
            message: "User does not exist",
            success: false,
            data: null,
          });
        }
    
        if (userExists.isBlocked) {
          return res.status(500).send({
            message: "Your account is blocked , please contact admin",
            success: false,
            data: null,
          });
        }
    
        const passwordMatch = await bcrypt.compare(
          req.body.password,
          userExists.password
        );
    
        if (!passwordMatch) {
          return res.status(500).send({
            message: "Incorrect password",
            success: false,
            data: null,
          });
        }
    
        const token = jwt.sign({ userId: userExists._id }, process.env.jwt_secret, {
          expiresIn: "1d",
        });
    
        res.status(200).send({
          message: "User logged in successfully",
          success: true,
          data: token,
        });
      } catch (error) {
        res.status(500).send({
          message: error.message,
          success: false,
          data: null,
        });
      }
}

// get user by id
exports.getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        res.status(200).send({
          message: "User fetched successfully",
          success: true,
          data: user,
        });
      } catch (error) {
        res.status(500).send({
          message: error.message,
          success: false,
          data: null,
        });
      }
}

// get all users
exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({
          message: "Users fetched successfully",
          success: true,
          data: users,
        });
      } catch (error) {
        res.status(500).send({
          message: error.message,
          success: false,
          data: null,
        });
      }
}

// update user
exports.updateUser = async(req, res) => {
    try {
        await User.findByIdAndUpdate(req.body._id, req.body);
        res.status(200).send({
          message: "User permissions updated successfully",
          success: true,
          data: null,
        });
      } catch {
        res.status(500).send({
          message: error.message,
          success: false,
          data: null,
        });
      }
}