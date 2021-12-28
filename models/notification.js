
const mongoose = require('mongoose')
const { composeMongoose } = require('graphql-compose-mongoose')
const utils = require('./model-utils')

const User = require('./user')
const Integration = require('./integration')

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
    integration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Integration'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

//schema.method({method: () => 'thing' }) for future reference

const model = mongoose.model('Notification', schema)

const typeComposer = composeMongoose(model, {})
model.typeComposer = typeComposer

const resolvers = typeComposer.mongooseResolvers

model.graphQueries = {
    notifications: resolvers.findMany()
}

model.graphMutations = {
    createNotification: resolvers.createOne(),
    deleteNotification: resolvers.removeById(),
    deleteNotifications: resolvers.removeMany(),
}

utils.addOneToManyRelation(model, 'user', User)
utils.addOneToManyRelation(model, 'integration', Integration)

module.exports = model