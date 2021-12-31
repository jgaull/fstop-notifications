
const mongoose = require('mongoose')
const schema = require('./schema')

const { ApolloServer } = require('apollo-server');
const server = new ApolloServer({
    plugins: [require('./apollo-authentication-plugin')],
    schema
});

async function main() {

    await mongoose.connect('mongodb://localhost:27017/test');

    // The `listen` method launches a web server.
    const { url } = await server.listen()
    console.log(`🚀  Server ready at ${url}`)
}

main().catch(err => console.log(`error initializing the server: ${err.stack}`))
