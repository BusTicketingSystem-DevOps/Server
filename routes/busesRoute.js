const router = require("express").Router();
const Bus = require("../models/busModel");
const authMiddleware = require("../middlewares/authMiddleware");

// add-bus

router.post("/add-bus", authMiddleware, async (req, res) => {
  try {
    const existingBus = await Bus.findOne({ number: req.body.number });
    if (existingBus) {
      return res.status(200).send({
        success: false,
        message: "Bus already exists",
      });
    }
    const newBus = new Bus(req.body);
    await newBus.save();
    return res.status(200).send({
      success: true,
      message: "Bus added successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});
// //get-multi-path-buses 
// router.post("/get-multi-buses",authMiddleware,async(req,res)=>{
//   try{
//      console.log(req.body.filters.from);
//      let busOnes=null;
//      if(req.body.filters.from){
//       busOnes=await Bus.find({from:req.body.filters.from});
//      }else{
//       busOnes=await Bus.find(req.body.filters);
//      }
//       const busTwos=[];
//       for(bus1 of busOnes){
//         const bus2=await Bus.find({from:bus1.to}); 
//         if(bus2.to===req.body.filters.to){
//           busTwos.push([bus1,bus2]);
//         }
//       }
//       console.log(busOnes);
//       console.log(busTwos);
//       res.status(200).send({success:true});
//   }
//   catch(error){
//     res.status(500).send({success:false,message:error.message});
//     console.log(error);
//   }
// })
// get-all-buses
router.post("/get-all-buses", authMiddleware, async (req, res) => {
  try {
    const finalbus=[];
    if(req.body.filters){
      console.log('from:',req.body.filters.from);
    let bus=null;
    if(req.body.filters.from){
     bus=await Bus.find({from:req.body.filters.from});
    }
    else{
     bus=await Bus.find(req.body.filters);
    }
     for(b of bus){
       const bus2=await Bus.find({from:b.to});
       for(b2 of bus2){
         if (b2.to===req.body.filters.to || req.body.filters.to === null ){
            finalbus.push([b,b2]);
         }
       }
     }
     console.log('buses',finalbus);
    }
    const buses = await Bus.find(req.body.filters);
    return res.status(200).send({
      success: true,
      message: "Buses fetched successfully",
      data: buses,
      multi:finalbus,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
});

// update-bus

router.post("/update-bus", authMiddleware, async (req, res) => {
    try {
      await Bus.findByIdAndUpdate(req.body._id, req.body);
      return res.status(200).send({
        success: true,
        message: "Bus updated successfully",
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  });

  // delete-bus

router.post("/delete-bus", authMiddleware, async (req, res) => {
    try {
      await Bus.findByIdAndDelete(req.body._id);
      return res.status(200).send({
        success: true,
        message: "Bus deleted successfully",
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  });

  // get-bus-by-id

router.post("/get-bus-by-id", authMiddleware, async (req, res) => {
  try {
    const bus = await Bus.findById(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Bus fetched successfully",
      data: bus,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
