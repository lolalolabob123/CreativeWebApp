const mongoose = require('mongoose')

const {Schema, model} = mongoose

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    business: Boolean
})

const User = model('User', userSchema)

async function addUser(firstName, lastName, username, password, business){
    const found = await User.findOne({username}).exec()
    if (found) return false

    const newUser = { firstName, lastName, username, password, business }
    await User.create(newUser)
    return true
}

async function getUserByUsername(username){
    return await User.findOne({username}).exec()
}

async function checkUser(username, password){
    const found = await User.findOne({username}).exec()
    if (!found) return null
    return found.password === password ? found : null
}

async function updateUser(username, updatedFields){
    return await User.findOneAndUpdate(
        {username},
        {$set: updatedFields},
        {new: true}
    )
}

module.exports = {
    User,
    addUser,
    checkUser,
    getUserByUsername,
    updateUser
}
