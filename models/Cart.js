const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    foodId: { type: Schema.Types.ObjectId, ref: 'food_items', required: true }, // Reference to the Food model
    quantity: { type: Number, required: true, min: 1, default: 1 },
    name: { type: String, required: true },
    price: { type: Number, required: true },
}, { timestamps: true });

const CartModel = model('Cart', CartSchema);

module.exports = CartModel;
