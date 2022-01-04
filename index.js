
require('dotenv').config()

const mongoose = require('mongoose')

const { Mongo } = require('@accounts/mongo')
const { AccountsServer } = require('@accounts/server')
const { AccountsPassword } = require('@accounts/password')
const { AccountsModule } = require('@accounts/graphql-api')
const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const express = require('express')
const http = require('http')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')

// making this a dictionary because I feel like that will be useful later on.
const modelRegistry = {
    /* User: require('./models/user'), */
    Notification: require('./models/notification'),
    Integration: require('./models/integration')
}

const buildSchema = require('./schema')

// Required logic for integrating with Express
const app = express()
const httpServer = http.createServer(app)

async function main() {

    await mongoose.connect(process.env.DATABASE_URL)

    const accountsServer = new AccountsServer({
        // We link the mongo adapter we created in the previous step to the server
        db: new Mongo(mongoose.connection),
        // Replace this value with a strong random secret
        tokenSecret: 'my-super-random-secret',
    },
    {
        // We pass a list of services to the server, in this example we just use the password service
        password: new AccountsPassword({}),
    })

    // We generate the accounts-js GraphQL module
    const accountsGraphQL = AccountsModule.forRoot({ accountsServer });

    // When we instantiate our Apollo server we use the schema and context properties

    const schema = buildSchema(modelRegistry, accountsGraphQL.schema)

    const subscriptionServer = SubscriptionServer.create({
        // This is the `schema` we just created.
        schema,
        // These are imported from `graphql`.
        execute,
        subscribe,
        }, {
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // Pass a different path here if your ApolloServer serves at
        // a different path.
        path: '/'
    })

    const server = new ApolloServer({
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                    async drainServer() {
                        subscriptionServer.close()
                    }
                    }
                }
            }
        ],
        schema,
        context: accountsGraphQL.context
    })

    await server.start();
    server.applyMiddleware({
        app,
        path: '/'
    });

    // The `listen` method launches a web server.
    await new Promise(resolve => httpServer.listen({ port: process.env.PORT }, resolve))
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
}

main().catch(err => console.log(`error initializing the server: ${err.stack}`))
