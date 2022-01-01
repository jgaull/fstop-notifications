
require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/user')
const Integration = require('./models/integration')

//this should only be run in a development environment because it deletes all users and integrations.
async function seed() {

    await mongoose.connect(process.env.DATABASE_URL)

    await User.deleteMany({})
    await Integration.deleteMany({})

    const user = await new User({
        username: 'admin',
        email: 'admin@fstop.live',
        password: await User.hashPassword('password')
    }).save()

    const integration = await new Integration({
        type: 'twitch-chat',
        user
    }).save()

    console.log(`use the following username and password:`)
    console.log(`username: ${integration._id}`)
    console.log(`password: ${integration.clientKey}`)
    console.log(`done seedin the DB`)

    mongoose.disconnect()
}

seed()