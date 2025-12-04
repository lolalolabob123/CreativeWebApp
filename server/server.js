require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')
const userModel = require('./models/Users')
const session = require('express-session')

const app = express()

app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret123",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    })
)

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
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

app.post('/updateRestaurantImage/:id', upload.single('image'), async (req, res) => {
try {
const { id } = req.params;
const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Optionally, delete the old image file here
    restaurant.image = file.filename;
    await restaurant.save();

    res.json({ message: 'Image updated', image: file.filename });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update image' });
}

});

app.post('/updateRestaurantName/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

        restaurant.name = name;
        await restaurant.save();

        res.json({ name: restaurant.name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update name' });
    }
});

// app.get('/register', (req, res) => {
//     res.render('pages/Register')
// })

app.post('/register', async (req, res) => {
    const isBusiness = req.body.business === "on"
    const success = await userModel.addUser(
        req.body.firstName,
        req.body.lastName,
        req.body.username,
        req.body.password,
        isBusiness
    )

    if (success){
        res.json({success: true})
    } else{
        res.status(400).json({success: false, message: 'Registration Failed'})
    }
})

// app.get('/login', (req, res) => {
//     res.render('pages/Login')
// })

app.post('/login', async (req, res) => {
    const user = await userModel.checkUser(req.body.username, req.body.password)
    if (user) {
        req.session.username = user.username
        req.session.business = user.business

        res.json({success: true})
    } else{
        res.status(400).json({success: false, message: 'Login Failed'})
    }
})

app.get('/user', (req, res) => {
    if (req.session.username) {
        res.json({username: req.session.username, business: req.session.business})
    } else{
        res.json({})
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({success: false, message: 'Logout failed'})
            res.clearCookie('connect.sid')
        res.json({success: true})
    }) 
})