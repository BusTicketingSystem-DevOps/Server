const {app} = require("../testServer");
const mongoose = require("mongoose");
const request = require("supertest");
const process = require('process');
const User = require('../models/usersModel');
// require("dotenv").config();

describe("User API", () => {

  beforeAll(async() => {
    const db = process.env.mongo_url;
    await mongoose.connect( db,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Wait for connection to be established
    while (mongoose.connection.readyState !== 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
  
    // Connection is established
    console.log('MongoDB connected!');

  },30000);

  describe("Register new user", () => {
    it("registers a new user", async () => {
      const newUser = {
        name: "xyz",
        email: "xyz@gmail.com",
        password: "1234"
      };

      const response = await request(app).post("/api/users/register").send(newUser);
      expect(response.status).toBe(200);
    });

    it("returns an error if user already exists", async () => {
    const newUser = {
      name: "xyz",
      email: "xyz@gmail.com",
      password: "1234"
    };
    
    const response = await request(app)
        .post("/api/users/register")
        .send(newUser);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });



describe('Login user', () => {

  it('should return a JWT token if the login is successful', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'xyz@gmail.com',
        password: '1234'
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  it('should return an error message if the user does not exist', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'nouser@example.com',
        password: 'password123'
      })
      .expect(500);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('User does not exist');
    expect(response.body.data).toBeNull();
  });

  // it('should return an error message if the account is blocked', async () => {
  //   // Block the test user
  //   User.isBlocked = true;
  //   await user.save();

  //   const response = await request(app)
  //     .post('/api/users/login')
  //     .send({
  //       email: 'john.doe@example.com',
  //       password: 'password123'
  //     })
  //     .expect(500);

  //   expect(response.body.success).toBe(false);
  //   expect(response.body.message).toBe('Your account is blocked , please contact admin');
  //   expect(response.body.data).toBeNull();

  //   // Unblock the test user
  //   User.isBlocked = false;
  //   await User.save();
  // });

  it('should return an error message if the password is incorrect', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'xyz@gmail.com',
        password: 'incorrectpassword'
      })
      .expect(500);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Incorrect password');
    expect(response.body.data).toBeNull();
  });
});


  afterAll(async() => {
    await User.deleteOne({email:"xyz@gmail.com"});
    mongoose.connection.close();
    setTimeout(() => process.exit(), 1)});
});
