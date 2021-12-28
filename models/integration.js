
const mongoose = require('mongoose')
const { composeMongoose } = require('graphql-compose-mongoose')

const schema = new mongoose.Schema({
    type: String,
    user: mongoose.ObjectId,
    integrationUsername: String,
    integrationAuthToken: String,
    integrationSettings: String
})

//schema.method({method: () => 'thing' }) for future reference

const model = mongoose.model('Integration', schema)
const composer = composeMongoose(model, {})
const resolvers = composer.mongooseResolvers

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

module.exports = model