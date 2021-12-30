const mongoose = require('mongoose')

const { Mongo } = require('@accounts/mongo')
const { AccountsServer } = require('@accounts/server')
const { AccountsPassword } = require('@accounts/password')
const { AccountsModule } = require('@accounts/graphql-api')

const { ApolloServer } = require('apollo-server')
const { makeExecutableSchema } = require('graphql-tools')

async function main() {

    await mongoose.connect('mongodb://localhost:27017/test')

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

    const accountsSchema = makeExecutableSchema({
        typeDefs: accountsGraphQL.typeDefs,
        resolvers: accountsGraphQL.resolvers,
        schemaDirectives: {
            ...accountsGraphQL.schemaDirectives,
        },
    })

    const { schemaComposer } = require('graphql-compose')
    schemaComposer.merge(require('./schema'))
    schemaComposer.merge(accountsSchema)

    // When we instantiate our Apollo server we use the schema and context properties
    const config = {
        schema: schemaComposer.buildSchema(),
        context: accountsGraphQL.context,
    }

    const server = new ApolloServer(config)

    // The `listen` method launches a web server.
    const { url } = await server.listen()
    console.log(`🚀  Server ready at ${url}`)
}

main().catch(err => console.log(`error initializing the server: ${err.stack}`))
