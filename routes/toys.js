const express = require("express");
const { authAdmin, auth } = require("../middlewares/auth");
const { ToyModel, validateToy } = require("../models/toyModel");
const router = express.Router();

router.get("/", async(req,res) => {
  try{
    const perPage = req.query.perPage || 10;
    const page = req.query.page - 1 || 0;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? 1 : -1;
    const data = await ToyModel
    .find({})
    .limit(perPage)
    .skip(page * perPage)
    .sort({[sort]:reverse})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.get("/search", async (req, res) => {
    try {
        const search = req.query.s;
        const searchExp = new RegExp(search,'i');
        const filterFind = {$or:[{name:searchExp},{info:searchExp}]}

        const perPage = req.query.perPage || 10;
        const page = req.query.page - 1 || 0;
        const sort = req.query.sort || "_id";
        const reverse = req.query.reverse == "yes" ? 1 : -1;
        const data = await ToyModel
        .find(filterFind)
        .limit(perPage)
        .skip(page * perPage)
        .sort({[sort]:reverse})
        res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(502).json({ err })
    }
  })

  router.get("/category/:catname", async (req, res) => {
    try {
        const categoryName = req.params.catname;
        const perPage = req.query.perPage || 10;
        const page = req.query.page - 1 || 0;
        const sort = req.query.sort || "_id";
        const reverse = req.query.reverse == "yes" ? 1 : -1;
        const data = await ToyModel
        .find({category:new RegExp(categoryName,'i')})
        .limit(perPage)
        .skip(page * perPage)
        .sort({[sort]:reverse})
        res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(502).json({ err })
    }
  })

  router.get("/prices", async(req,res) => {
    const min = req.query.min || 0;
    const max = req.query.max || Infinity;
    try{
        const perPage = req.query.perPage || 10;
        const page = req.query.page - 1 || 0;
        const sort = req.query.sort || "_id";
        const reverse = req.query.reverse == "yes" ? 1 : -1;
        const data = await ToyModel
        .find({price:{$gte:min,$lte:max}})
        .limit(perPage)
        .skip(page * perPage)
        .sort({[sort]:reverse})
        res.json(data);
     
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

  router.get("/single/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const data = await ToyModel.find({_id})
        res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(502).json({ err })
    }
  })


router.post("/", auth, async(req,res) => {
  const validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    const toy = new ToyModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.json(toy);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.put("/:editId", auth, async(req,res) => {
  const validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    const id = req.params.editId;
    let data;
    if(req.tokenData.role != "user"){
        data = await ToyModel.updateOne({_id:id},req.body);
    }
    else{
        data = await ToyModel.updateOne({_id:id,user_id:req.tokenData._id},req.body);
    }
    // modfiedCount:1 - אם הצליח
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.delete("/:delId", auth, async(req,res) => {
  try{
    const id = req.params.delId;
    let data;
    if(req.tokenData.role != "user"){
        data = await ToyModel.deleteOne({_id:id})
    }
    else{
        data = await ToyModel.deleteOne({_id:id,user_id:req.tokenData._id});;
    }
    // deletedCount:1 - אם הצליח
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

module.exports = router;