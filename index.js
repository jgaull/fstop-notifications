const mongoose = require('mongoose')

const { Mongo } = require('@accounts/mongo')
const { AccountsServer } = require('@accounts/server')
const { AccountsPassword } = require('@accounts/password')
const { AccountsModule } = require('@accounts/graphql-api')

const { ApolloServer } = require('apollo-server')

const buildSchema = require('./schema')

// making this a dictionary because I feel like that will be useful later on.
const modelRegistry = {
    /* User: require('./models/user'), */
    Notification: require('./models/notification'),
    Integration: require('./models/integration')
}

async function main() {

    mongoose.connect('mongodb://localhost:27017/test')

    const accountsMongo = new Mongo(mongoose.connection)
    const accountsPassword = new AccountsPassword({})

    const accountsServer = new AccountsServer({
        // We link the mongo adapter we created in the previous step to the server
        db: accountsMongo,
        // Replace this value with a strong random secret
        tokenSecret: 'my-super-random-secret',
    },
    {
        // We pass a list of services to the server, in this example we just use the password service
        password: accountsPassword,
    })

    // We generate the accounts-js GraphQL module
    const accountsGraphQL = AccountsModule.forRoot({ accountsServer });

    // When we instantiate our Apollo server we use the schema and context properties
    const server = new ApolloServer({
        schema: buildSchema(modelRegistry, accountsGraphQL.schema),
        context: accountsGraphQL.context,
    })

    // The `listen` method launches a web server.
    const { url } = await server.listen()
    console.log(`🚀  Server ready at ${url}`)
}

main().catch(err => console.log(`error initializing the server: ${err.stack}`))
