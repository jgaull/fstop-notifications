
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: String,
    message: String,
    type: String,
    iconUrl: String,
    callToAction: String,
    link: String,
    timestamp: String,
    data: String,
    source: String,
    integration: String,
    user: mongoose.ObjectId
})

const Notification = mongoose.model('Notification', notificationSchema);

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = mongoose.model('User', userSchema)

const integrationSchema = new mongoose.Schema({
    type: String,
    user: mongoose.ObjectId,
    integrationUsername: String,
    integrationAuthToken: String,
    integrationSettings: String
})

const Integration = mongoose.model('Integration', integrationSchema)

const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

    type User {
        name: String,
        email: String,
        password: String
        _id: ID
    }

    input UserInput {
        name: String
    }

    type Integration {
        _id: ID
        type: String
        user: ID
        integrationUsername: String
        integrationAuthToken: String
        integrationSettings: String
    }

    input IntegrationInput {
        type: String
        user: ID
        integrationUsername: String
        integrationAuthToken: String
        integrationSettings: String
    }

    type BulkDeletionResult {
        deletedCount: Int
    }

    type Notification {
        title: String
        message: String
        type: String
        iconUrl: String
        callToAction: String
        link: String
        timestamp: String
        _id: ID
        data: String
        source: String
        integration: ID
        user: User
    }

    input NotificationInput {
        title: String
        message: String
        type: String
        iconUrl: String
        callToAction: String
        link: String
        timestamp: String
        data: String
        source: String
        integration: String
        user: ID
    }

    type Query {
        notifications: [Notification]
        notificationsForUser(userId: ID): [Notification]

        users: [User]

        integrations(query: IntegrationInput): [Integration]
        integration(id: ID): Integration
    }

    type Mutation {
        createNotification(notification: NotificationInput): Notification
        deleteNotification(id: ID): Notification
        deleteNotifications: BulkDeletionResult

        createUser(user: UserInput): User

        createIntegration(input: IntegrationInput): Integration
        updateIntegration(id: ID, input: IntegrationInput): Integration
        deleteIntegration(id: ID): Integration
        deleteIntegrations: BulkDeletionResult
    }
`

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        notifications: async () => Notification.find({}),
        notificationsForUser: async (nothing, params) => await Notification.find({ user: params.userId }),
        users: async () => User.find({}),
        integrations: async (nothing, params) => {
            return Integration.find(params.query)
        },
        integration: async (nothing, params) => Integration.findById(params.id)
    },
    Mutation: {
        createNotification: async (nothing, params) => {
            const notification = new Notification(params.notification)
            return notification.save()
        },
        deleteNotification: async (nothing, params) => Notification.findByIdAndDelete(params.id),
        deleteNotifications: async () => Notification.deleteMany({}),

        createUser: async (nothing, params) => {
            const user = new User(params.user)
            return user.save()
        },

        createIntegration: async (nothing, params) => {
            const integration = new Integration(params.input)
            return integration.save()
        },
        updateIntegration: async (nothing, params) => {
            const integration = new Integration(params.input)
            return integration.updateOne({ _id: params.id }, params.input)
        },
        deleteIntegration: async (nothing, params) => Integration.findByIdAndDelete(params.id),
        deleteIntegrations: async () => Integration.deleteMany({})
    }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

async function main() {

    await mongoose.connect('mongodb://localhost:27017/test');

    // The `listen` method launches a web server.
    const { url } = await server.listen()
    console.log(`🚀  Server ready at ${url}`)
}

main().catch(err => console.log(`error initializing the server: ${err.stack}`))
