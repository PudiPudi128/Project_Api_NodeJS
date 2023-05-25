const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
  name: String,
  info: String,
  category: String,
  img_url: String,
  price: Number,
  user_id: String 
},
{timestamps:true})
exports.ToyModel = mongoose.model("toys", schema);

exports.validateToy = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(400).required(),
    info: Joi.string().min(2).max(400).required(),
    category: Joi.string().min(2).max(400).required(),
    // allow -> מאפשר לשלוח את האמפיין עם סטרינג ריק
    img_url: Joi.string().min(2).max(800).allow(null, ""),
    price: Joi.number().min(1).max(999999).required()
  })
  return joiSchema.validate(_reqBody)
}