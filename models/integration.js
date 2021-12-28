
const mongoose = require('mongoose')
const { composeMongoose } = require('graphql-compose-mongoose')
const utils = require('./model-utils')

const User = require('./user')

const schema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['twitch-chat', 'webhook']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    integrationUsername: String,
    integrationAuthToken: String,
    integrationSettings: {
        type: mongoose.Schema.Types.Mixed,
        description: 'Settings specific to each integration'
    }
})

//schema.method({method: () => 'thing' }) for future reference

const model = mongoose.model('Integration', schema)

const typeComposer = composeMongoose(model, {})
model.typeComposer = typeComposer

const resolvers = typeComposer.mongooseResolvers

model.graphQueries = {
    integrations: resolvers.findMany(),
    integration: resolvers.findById()
}

model.graphMutations = {
    createIntegration: resolvers.createOne(),
    updateIntegration: resolvers.updateById(),
    deleteIntegration: resolvers.removeById(),
    deleteIntegrations: resolvers.removeMany()
}

utils.addOneToManyRelation(model, 'user', User)

module.exports = model