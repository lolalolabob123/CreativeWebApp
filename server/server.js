require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/')
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Uses the port provided by .env or defaults to 3000
const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`))
})

const Restaurant = require('./models/Restaurant')

// Create a new restaurant
app.post('/addRestaurant', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body
        const image = req.file ? req.file.filename : null

        const restaurant = new Restaurant({ name, image })
        await restaurant.save()
        res.json({ message: 'Restaurant added', restaurant })
    } catch (err) {
        res.status(500).json({ error: 'Failed to add restaurant' })
    }
})

// Read all restaurants
app.get('/getRestaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find()
        res.json({ restaurants })
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch restaurants' })
    }
})

// Delete restaurant by ID
app.delete('/deleteRestaurant/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Restaurant.findByIdAndDelete(id)

        if (!deleted) {
            return res.status(404).json({ error: 'Restaurant not found' })
        }

        res.json({ message: 'Restaurant deleted', deleted })
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete restaurant' })
    }
})