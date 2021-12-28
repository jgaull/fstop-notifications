
const mongoose = require('mongoose')
const { composeMongoose } = require('graphql-compose-mongoose')

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

model.typeComposer = typeComposer

typeComposer.addRelation('user', {

        resolver: () => User.typeComposer.mongooseResolvers.findById(),
        prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
            _id: source => source.user || null,
        },
        projection: { user: true }, // point fields in source object, which should be fetched from DB
    }
);

module.exports = model