const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const FoodItem = new Schema(
  {
    id: String,
    name: String,
    description: String,
    url: String,
    // category(All, Fruit, Vegetable, Non- veg, Breads, Diary, etc): Enum
    review_id: String,
    stock_available: Number,
    cost: Number,
  },
  {
    timestamps: true,
  }
);

const FoodModel = model("FoodItem", FoodItem);

module.exports = FoodModel;
