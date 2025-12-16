const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    donationGoal: { type: Number, default: 1000 },
    donationReached: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    menu: [menuItemSchema]
});


module.exports = mongoose.model('Restaurant', restaurantSchema);