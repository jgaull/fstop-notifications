
const mongoose = require('mongoose')
const { composeMongoose } = require('graphql-compose-mongoose')

const schema = new mongoose.Schema({
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

//schema.method({method: () => 'thing' }) for future reference

const model = mongoose.model('Notification', schema)
const composer = composeMongoose(model, {})
const resolvers = composer.mongooseResolvers

model.graphQueries = {
    notifications: resolvers.findMany()
}

model.graphMutations = {
    createNotification: resolvers.createOne(),
    deleteNotification: resolvers.removeById(),
    deleteNotifications: resolvers.removeMany(),
}

module.exports = model