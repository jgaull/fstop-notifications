
require('dotenv').config()

const mongoose = require('mongoose')
const schema = require('./schema')

const { ApolloServer } = require('apollo-server')
const server = new ApolloServer({
    plugins: [require('./apollo-authentication-plugin')],
    schema
});

async function main() {

    await mongoose.connect(process.env.DATABASE_URL)

    // The `listen` method launches a web server.
    const { url } = await server.listen()
    console.log(`🚀  Server ready at ${url}`)
}

main().catch(err => console.log(`error initializing the server: ${err.stack}`))
