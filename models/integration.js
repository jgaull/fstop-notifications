
const mongoose = require('mongoose')
const { composeMongoose } = require('graphql-compose-mongoose')
const utils = require('./model-utils')
const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10

const schema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        index: true,
        enum: ['twitch-chat', 'webhook', 'apollo-studio']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        required: true
    },
    clientKey: {
        type: String,
        required: true,
        index: true,
        default: () => bcrypt.hashSync(
            Date().toString(),
            SALT_WORK_FACTOR
        )
    },
    integrationUsername: String,
    integrationAuthToken: String,
    integrationSettings: {
        type: mongoose.Schema.Types.Mixed,
        description: 'Settings specific to each integration'
    }
},
{
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
})

//schema.method({method: () => 'thing' }) for future reference

const model = mongoose.model('Integration', schema)

const typeComposer = composeMongoose(model, {
    removeFields: [
        'clientKey',
        'integrationAuthToken'
    ]
})
model.typeComposer = typeComposer

const resolvers = typeComposer.mongooseResolvers

model.graphQueries = {
    integrations: resolvers.findMany(),
    integration: resolvers.findById()
}

const inputSettings = {
    record: {
        removeFields: [ 'createdAt', 'updatedAt' ]
    }
}

model.graphMutations = {
    createIntegration: resolvers.createOne(inputSettings),
    updateIntegration: resolvers.updateById(inputSettings),
    deleteIntegration: resolvers.removeById(),
    deleteIntegrations: resolvers.removeMany()
}

utils.addOneToManyRelation(model, 'user')

module.exports = model