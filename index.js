
require('dotenv').config()

const mongoose = require('mongoose')
const schema = require('./schema')

const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const express = require('express')
const http = require('http')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')

var jwt = require('express-jwt')
var jwks = require('jwks-rsa')

// Required logic for integrating with Express
const app = express()
const httpServer = http.createServer(app)

app.use(jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-cg0y3hxy.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://fstop.live/notifications',
  issuer: 'https://dev-cg0y3hxy.us.auth0.com/',
  algorithms: ['RS256']
}))

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
        //require('./apollo-authentication-plugin'),
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
    context: async ({ req, ...rest }) => {

        let isAuthenticated = false;
        try {
            const authHeader = req.headers.authorization || '';
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                const payload = await verifyToken(token);
                isAuthenticated = payload && payload.sub ? true : false;
            }
        } catch (error) {
            console.error(error);
        }
        return { ...rest, req, auth: { isAuthenticated } };
    },
    schema
})

async function main() {

    await mongoose.connect(process.env.DATABASE_URL)

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
