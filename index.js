
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
    user: mongoose.ObjectId
})

const Notification = mongoose.model('Notification', notificationSchema);

const userSchema = new mongoose.Schema({
    name: String
})

const User = mongoose.model('User', userSchema);


const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

    type User {
        name: String
        _id: ID
    }

    input UserInput {
        name: String
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
        user: ID
    }

    type Query {
        notifications: [Notification]
        notificationsForUser(userId: ID): [Notification]

        users: [User]
    }

    type Mutation {
        createNotification(notification: NotificationInput): Notification
        deleteNotification(id: ID): Notification

        createUser(user: UserInput): User
    }
`

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        notifications: async () => Notification.find({}),
        notificationsForUser: async (nothing, params) => await Notification.find({ user: params.userId }),
        users: async () => User.find({})
    },
    Mutation: {
        createNotification: async (nothing, params) => {
            const notification = new Notification(params)
            console.log(`creating a new notification: ${JSON.stringify(notification)}`)
            return notification.save()
        },
        deleteNotification: async (nothing, params) => {
            return Notification.findByIdAndDelete(params.id)
        },
        createUser: async (nothing, params) => {
            const user = new User(params.user)
            console.log(`creating a new user: ${JSON.stringify(user)}`)
            return user.save()
        }
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
