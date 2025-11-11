const express = require('express')
const app = express()
const path = require('path')

//Uses the port provided by the env file or uses the default
const port = process.env.port || 3000

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

//Root to handle incoming requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/index.html'))
    console.log('__dirname:', __dirname);
    console.log('Full path:', path.join(__dirname, '../client/views/index.html'));
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
app.post('/addRestaurant', (req, res) => {
    let restaurantID = data.length + 1
    const restaurantName = req.body.name
    let newRestaurant = {
        id: restaurantID,
        name: restaurantName
    }
    data.push(newRestaurant)
    res.sendFile(path.join(__dirname, '../client/views/RestaurantMenu.html'))
    console.log(data)
})

//Serve the add restaurant page
app.get('/addRestaurant', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/views/RestaurantMenu.html'))
})

//Read all restaurants
app.get('/getRestaurants', (req, res) => {
    res.json({ restaurants: data })
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
app.delete('/deleteRestaurant/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const index = data.findIndex((restaurant) => restaurant.id === id)
    if (index === -1) {
        res.status(404).json({ error: 'Restaurant not found' })
    } else {
        const deleteRestaurant = data.splice(index, 1)
        res.json(deleteRestaurant[0])
    }
})