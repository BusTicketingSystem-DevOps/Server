const {app} = require("../testServer");
const mongoose = require("mongoose");
const request = require("supertest");
const process = require('process');
const User = require('../models/usersModel');
const Bus = require('../models/busModel');
const Booking = require('../models/bookingsModel');
// require("dotenv").config();

describe("Testing API", () => {
let token, userid;
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
  describe("User API", () => {
  describe("Register new user", () => {
    it("registers a new user", async () => {
      const newUser = {
        name: "xyz",
        email: "xyz@gmail.com",
        password: "1234",
        isAdmin: true
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
    token=response.body.data;
    // console.log("token:", token);
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

  it('should return an error message if the account is blocked', async () => {
    // Block the test user
    await User.updateOne({email:"xyz@gmail.com"},{$set:{isBlocked:true}});

    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'xyz@gmail.com',
        password: '1234'
      })
      .expect(500);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Your account is blocked , please contact admin');
    expect(response.body.data).toBeNull();

    // Unblock the test user
    await User.updateOne({email:"xyz@gmail.com"},{$set:{isBlocked:false}});
  });

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

describe("Get user By Id", () => {
  it('should return User fetched Successfully if user is present', async () => {
    userid = await User.findOne({email:"xyz@gmail.com"})._id
    const response = await request(app)
      .post('/api/users/get-user-by-id')
      .send({
        userId: userid
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });
})

describe("Get all Users", () => {
  it('should return User fetched Successfully if user is present', async () => {
    const response = await request(app)
      .post('/api/users/get-all-users')
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe("Users fetched successfully");
    expect(response.body.data).toBeDefined();
  });
})

describe("Update users", () => {
  it('should return User permissions updated successfully', async () => {
    user = await User.findOne({email:"xyz@gmail.com"});
    const response = await request(app)
      .post('/api/users/update-user-permissions')
      .set({
        ...user,
        name: "xyza"
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe("User permissions updated successfully");
    expect(response.body.data).toBeDefined();
  });
})
});



describe("Bus API", () => {
  let busid;
  const newBus = {
    name: "Blr-Hyd",
    number: "1098",
    capacity: 45,
    from: "Bangalore",
    to: "Hyderabad",
    journeyDate: "2023-05-30",
    departure: "09:45",
    arrival: "18:30",
    type: "AC",
    fare: 900,
    status: "Yet To Start"
  };
  
    describe("Add new bus", () => {
      it("Adds a new bus", async () => {
      const response = await request(app)
      .post("/api/buses/add-bus")
      .send(newBus)
      .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      });
  
      it("returns an error if bus already exists", async () => {
      const response = await request(app)
          .post("/api/buses/add-bus")
          .send(newBus)
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
      });
    });


    describe("get All Buses", () => {
      it("gets all buses", async () => {
        const response = await request(app)
        .post("/api/buses/get-all-buses")
        .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        });
    })
  
    describe("Update Bus", () => {
      it("update bus", async () => {
        const response = await request(app)
        .post("/api/buses/update-bus")
        .send({
          name: "Bangalore-Hyderabad"
        })
        .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        });
    })
  
    describe("get Bus by Id", () => {
      it("Get bus by Id", async () => {
        bus = await Bus.findOne({number:"1098"});
        const response = await request(app)
        .post("/api/buses/get-bus-by-id/")
        .send({
          _id: bus._id,
        })
        .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        });
    })
  
    describe("delete bus by Id", () => {
      it("Deletes Bus by Id", async () => {
        const newBus1 = {
          name: "Blr-Hyd",
          number: "1099",
          capacity: 45,
          from: "Bangalore",
          to: "Hyderabad",
          journeyDate: "2023-05-30",
          departure: "09:45",
          arrival: "18:30",
          type: "AC",
          fare: 900,
          status: "Yet To Start"
        };
        const res = await request(app)
        .post("/api/buses/add-bus")
        .send(newBus1)
        .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        busid = await Bus.findOne({number:"1099"});
        const response = await request(app)
        .post("/api/buses/delete-bus")
        .send({
          _id: busid._id
        })
        .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        });
    })
  });

  describe("Bookings API",() => {
    
    describe("Book a seat",() => {
      it("Books a seat", async () => {
        let busid = await Bus.findOne({number:"1098"});
        let user = await User.findOne({email:"xyz@gmail.com"});
        const response = await request(app)
        .post("/api/bookings/book-seat")
        .send({
          bus: busid._id,
          user: user._id,
          seats: [1,2]
        })
        .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        });
    })

    // describe("make payment", () => {
    //   it("Make Payment", async () => {
    //     const response = await request(app)
    //     .post("/api/bookings/make-payment")
    //     .send({
    //       amount: 50000
    //     })
    //     expect(response.status).toBe(500);
    //     });
    // })

    describe("get Bookings By user Id", () => {
      it("Get all Bookings of an user", async () => {
        const response = await request(app)
        .post("/api/bookings/get-bookings-by-user-id")
        .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        });
    })

    describe("get all Bookings", () => {
      it("Get all Bookings of all users", async () => {
        const response = await request(app)
        .post("/api/bookings/get-all-bookings")
        .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        });
    })
  })

  afterAll(async() => {
    let user =  await User.findOne({email:"xyz@gmail.com"});
    let userId = user._id;
    let bookingid = await Booking.findOne({user:userId});
    await Booking.deleteOne({_id:bookingid._id});
    await User.deleteOne({email:"xyz@gmail.com"});
    await Bus.deleteOne({number:"1098"});
    await Bus.deleteOne({number:"1099"});
    mongoose.connection.close();
    setTimeout(() => process.exit(), 1)});
});
