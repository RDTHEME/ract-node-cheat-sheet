//==============================================
//     ADVANCE ROUTE
//==============================================

//server.js
app.use("/", require("./routes/about"));

//about.js 

// this js file is inside route folder
const express = require("express");
const router = express.Router();

//dummy test route
router.get("/", (req, res, next) => {
  res.send("hello advance route");
});

module.exports = router;

//==============================================
//     MODEL 
//==============================================


const mongoose = require("mongoose");

const FileSchema =new mongoose.Schema({
    name:{
        type:String,
    },
   
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('File',FileSchema)


//==============================================
//     POST DATA
//==============================================

//from models
const Player = require("../models/Player");

//router post
router.post("/", async (req, res) => {
  try {
    const player = await new Player(req.body);
    await player.save();
    res.json({
      success: true,
      data: player
    });
  } catch (error) {
    res.json(error);
  }
});


//==============================================
//     GET ALL
//==============================================

//router get
router.get("/", async (req, res) => {
  try {
    const player = await Player.find();
    res.json({
		success:true,
		data:player
	});
  } catch (error) {
    res.json(error);
  }
})
//OR 

//router get
router.get("/", async (req, res) => {
  try {
    const player = await Player.find();
    res.json(player);
  } catch (error) {
    res.json(error);
  }
});


//==============================================
//     GET SINGLE
//==============================================
router.get("/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    res.json({
		success:true,
		data:player
	});
  } catch (error) {
    res.json(error);
  }
});

//==============================================
//     UPDATE DATA
//==============================================

//router update
router.put("/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true, data: player });
  } catch (error) {
    res.json(error);
  }
});

//==============================================
//     DELETE DATA
//==============================================
//router delete
router.delete("/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: {} });
  } catch (error) {
    res.json(error);
  }
});




