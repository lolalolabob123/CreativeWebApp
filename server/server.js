require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const path = require('path')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Uses the port provided by the env file or uses the default
const port = process.env.PORT || 3000

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err))

const Restaurant = require('./models/Restaurant')

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

//Root to handle incoming requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/src/App.jsx'))
})

const data = [
    { id: 1, name: 'Restaurant 1' },
    { id: 2, name: 'Restaurant 2' },
    { id: 3, name: 'Restaurant 3' }
]

//Middleware to parse JSON requests
app.use(express.json())
app.use(express.urlencoded())

//Create a new restaurant
app.post('/addRestaurant', async (req, res) => {
    try{
        const {name} = req.body
        const restaurant = new Restaurant({name})
        await restaurant.save()
        res.json({message: 'Restaurant added', restaurant})
    } catch (err) {
        res.status(500).json({error: 'Failed to add restaurant'})
    }
})

//Serve the add restaurant page
app.get('/addRestaurant', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/pages/RestaurantMenu.jsx'))
})

//Read all restaurants
app.get('/getRestaurants', async (req, res) => {
    try{
        const restaurants = await Restaurant.find()
        res.json({restaurants})
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch restaurants'})
    }
})

app.get('/restaurants', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/RestaurantList.jsx'))
})

//Update a restaurant by ID
app.get('/restaurant/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const restaurant = data.find((restaurant) => restaurant.id === id)
    if (!restaurant) {
        res.status(404).json({ error: 'Restaurant not found' })
    } else {
        res.json(data[index])
    }
})

//Delete a restaurant by ID
app.delete('/deleteRestaurant/:id', async (req, res) => {
    try{
        const {id} = req.params
        const deleted = await Restaurant.findByIdAndDelete(id)
        if (!deleted) return res.status(404).json({error: 'Restaurant not found'})
            res.json(deleted)
    } catch (err) {
        res.status(500).json({error: 'Failed to delete restaurant'})
    }
})