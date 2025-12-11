require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')
const {User, addUser, checkUser, getUserByUsername, updateUser, addToCart} = require('./models/Users')
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
}).catch(err => console.error(err))

const Restaurant = require('./models/Restaurant')

// Create a new restaurant
app.post('/addRestaurant', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body

        if (!name) {
            return res.status(400).json({ error: 'Name is required' })
        }

        if (!req.session.username) {
            return res.status(401).json({ error: 'Not Logged In' })
        }

        const owner = await User.findOne({ username: req.session.username })
        if (!owner) {
            return res.status(401).json({ error: 'User not found' })
        }

        const restaurant = new Restaurant({
            name,
            image: req.file ? req.file.filename : null,
            donationReached: 0,
            donationGoal: 1000,
            owner: owner._id
        })

        await restaurant.save()

        res.json({ message: 'Restaurant added', restaurant })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to add restaurant' })
    }
})

// Read all restaurants
app.get('/getRestaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find().populate('owner', 'username business')
        res.json({ restaurants })
    } catch (err) {
        console.error('Error fetching restaurants:', err)
        res.status(500).json({ error: 'Failed to fetch restaurants', details: err.message })
    }
})

// Delete restaurant by ID
app.delete('/deleteRestaurant/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.session.username) {
            return res.status(401).json({ error: 'Not Logged In' });
        }

        const owner = await User.findOne({ username: req.session.username });
        if (!owner) {
            return res.status(401).json({ error: 'User not found' });
        }

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        if (restaurant.owner.toString() !== owner._id.toString()) {
            return res.status(403).json({ error: 'Unauthorised: You do not own this restaurant' });
        }

        await restaurant.deleteOne();

        res.json({ message: 'Restaurant deleted', restaurant });

    } catch (err) {
        res.status(500).json({ error: 'Failed to delete restaurant' });
    }
});

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

app.post('/register', async (req, res) => {
    const isBusiness = req.body.business === "on" || req.body.business === true

    const success = await addUser(
        req.body.firstName,
        req.body.lastName,
        req.body.username,
        req.body.password,
        isBusiness
    )

    if (success) {
        res.json({ success: true })
    } else {
        res.status(400).json({ success: false, message: 'Registration Failed' })
    }
})


app.post('/login', async (req, res) => {
    const user = await checkUser(req.body.username, req.body.password)

    if (user) {
        req.session.username = user.username
        req.session.business = user.business
        res.json({ success: true })
    } else {
        res.status(400).json({ success: false, message: 'Login Failed' })
    }
})


app.get('/user', async (req, res) => {
    if (req.session.username) {
        const user = await getUserByUsername(req.session.username)
        if (user) {
            res.json({
                _id: user._id,
                username: user.username,
                business: user.business
            })
            return
        }
    }
    res.json({})
})

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ success: false, message: 'Logout failed' })
        res.clearCookie('connect.sid')
        res.json({ success: true })
    })
})

app.post('/donate/:id', async (req, res) => {
    try {
        const { amount } = req.body
        const { id } = req.params

        console.log('Donate request received')
        console.log('User session:', req.session)
        console.log('Amount:', amount)

        if (!req.session.username) {
            return res.status(401).json({ error: 'Not Logged In' })
        }

        if (req.session.business === true) {
            return res.status(403).json({ error: 'Businesses cannot donate' })
        }

        const restaurant = await Restaurant.findById(id)
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' })
        }

        restaurant.donationReached = restaurant.donationReached || 0
        restaurant.donationGoal = restaurant.donationGoal || 1000

        const numericAmount = Number(amount)
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ error: 'Invalid donation amount' })
        }

        restaurant.donationReached += numericAmount
        await restaurant.save()

        res.status(200).json({ success: true, restaurant })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Donation failed' })
    }
})

// Get menu items for a restaurant
app.get('/getMenuItems/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
        res.json({ menuItems: restaurant.menu || [] });
    } catch(err) {
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
});

// Add menu item
app.post('/addMenuItem/:id', async (req, res) => {
    try {
        const { name, price } = req.body;
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

        restaurant.menu = restaurant.menu || [];
        restaurant.menu.push({ _id: new mongoose.Types.ObjectId(), name, price });
        await restaurant.save();
        res.json({ menuItems: restaurant.menu });
    } catch(err) {
        res.status(500).json({ error: 'Failed to add menu item' });
    }
});

// Delete menu item
app.delete('/deleteMenuItem/:id/:itemId', async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

        restaurant.menu = restaurant.menu.filter(item => item._id.toString() !== itemId);
        await restaurant.save();
        res.json({ menuItems: restaurant.menu });
    } catch(err) {
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
});

app.post('/addToCart', async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({error: 'Not logged in'})
    }

    const result = await addToCart(req.session.username, req.body)

    if (!result) {
        return res.status(400).json({error: 'Failed to add to cart'})
    }

    res.json({success: true, cart: result})
})