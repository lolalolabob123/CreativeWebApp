const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
   
    menu: [menuItemSchema]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);