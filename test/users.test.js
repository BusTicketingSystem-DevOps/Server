const {app} = require("../testServer");
const mongoose = require("mongoose");
const request = require("supertest");
const process = require('process');
// require("dotenv").config();

describe("User API", () => {
  let token;

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
    // it("registers a new user", async () => {
    //   const newUser = {
    //     name: "pranjalsharma",
    //     email: "pranjal@gmail.com",
    //     password: "1234"
    //   };

    //   const response = await request(app).post("/api/users/register").send(newUser);
    //   expect(response.status).toBe(200);
    // });

    it("returns an error if user already exists", async () => {
    const newUser = {
        name: "pranjalsharma",
        email: "pranjal@gmail.com",
        password: "1234"
    };
    
    const response = await request(app)
        .post("/api/users/register")
        .send(newUser);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  afterAll(() => {
    mongoose.connection.close();
    // setTimeout(() => process.exit(), 1)});
  });
});
