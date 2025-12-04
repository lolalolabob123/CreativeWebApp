const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true},
    image: {type: String},
    donationGoal: { type: Number, default: 100 },
    donationReached: { type: Number, default: 10 }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)