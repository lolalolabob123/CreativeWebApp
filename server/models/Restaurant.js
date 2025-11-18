const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true},
    image: {type: String, default: ''}
})

module.exports = mongoose.model('Restaurant', restaurantSchema)