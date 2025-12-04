const mongoose = require('mongoose')

const {Schema, model} = mongoose

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    business: Boolean
})

const userData = model('users', userSchema)

async function addUser(firstName, lastName, username, password, business){
    let found = null
    found = await userData.findOne({username: username}).exec()
    if (found) return false

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        business
    }
    await userData.create(newUser)
    return true
}

async function getUserByUsername(username){
    return await userData.findOne({username: username}).exec()
}

async function checkUser(username, password){
    const found = await userData.findOne({username}).exec()
    if (!found){
        return null
    }
    if (found.password === password)
    {
        return found
    }
    return null
}

async function updateUser(username, updatedFields){
    return await userData.findOneAndUpdate(
        {username},
        {$set: updatedFields},
        {new: true}
    )
}

module.exports={
    addUser,
    checkUser,
    getUserByUsername,
    updateUser
}