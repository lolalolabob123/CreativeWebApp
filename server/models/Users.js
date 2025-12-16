const mongoose = require('mongoose')

const { Schema, model } = mongoose

const cartItemSchema = new Schema({
    itemId: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 }
});

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    business: { type: Boolean, required: false },
    cart: [cartItemSchema]
})

const User = model('User', userSchema)

async function addUser(firstName, lastName, username, password, business) {
    try {
        const found = await User.findOne({ username }).exec()
        if (found) return false

        await User.create({ firstName, lastName, username, password, business })
        return true
    } catch (err) {
        console.error("AddUser error:", err)
        return false
    }
}

async function getUserByUsername(username) {
    return await User.findOne({ username }).exec()
}

async function checkUser(username, password) {
    const found = await User.findOne({ username }).exec()
    if (!found) return null
    return found.password === password ? found : null
}

async function updateUser(username, updatedFields) {
    return await User.findOneAndUpdate(
        { username },
        { $set: updatedFields },
        { new: true }
    )
}

async function addToCart(username, item) {
    const user = await User.findOne({ username })

    if (!user) return null

    const itemId = item.itemId

    const existingItem = user.cart.find(i => i.itemId.toString() === item.itemId.toString())

    if (existingItem) {
        existingItem.quantity += 1
    } else {
        user.cart.push({
            itemId: itemId,
            name: item.name,
            price: item.price,
            quantity: 1
        })
    }

    await user.save()
    return user.cart
}

async function removeFromCart(username, itemId) {
    const user = await User.findOne({ username })

    if (!user) return null

    const item = user.cart.find(
        item => item.itemId.toString() === itemId
    )

    if (!item) return user.cart

    if (item.quantity > 1){
        item.quantity -= 1
    } else{
        user.cart = user.cart.filter(item => item.itemId.toString() !== itemId)
    }

    await user.save()
    return user.cart
}

async function getCart(username) {
    const user = await User.findOne({ username }).exec()
    return user ? user.cart : null
}

module.exports = {
    User,
    addUser,
    checkUser,
    getUserByUsername,
    updateUser,
    addToCart,
    removeFromCart,
    getCart
}
