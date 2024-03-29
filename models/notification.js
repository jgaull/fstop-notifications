
const mongoose = require('mongoose')
const { composeMongoose } = require('graphql-compose-mongoose')
const utils = require('./model-utils')
const Joi = require('joi')
const { schemaComposer } = require('graphql-compose')

const { PubSub, withFilter } = require('graphql-subscriptions');
const pubsub = new PubSub();

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    type: {
        type: String,
        required: true,
        enum: ['info', 'warning', 'error']
    },
    integration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Integration',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        description: 'arbitrary data from the source system'
    },
    iconUrl: {
        type: String,
        validate: value => {
            const validationResult = Joi.string().uri().validate(value)
            if (validationResult.error) {
                throw new Error(`"${value}" is not a valid url.`)
            }
        }
    },
    callToAction: String,
    link: {
        type: String,
        validate: value => {
            const validationResult = Joi.string().uri().validate(value)
            if (validationResult.error) {
                throw new Error(`"${value}" is not a valid url.`)
            }
        }
    },
    originatedAt: Date,
    createdAt: {
        type: Date,
        expires: process.env.NOTIFICATIONS_TTL_MINUTES * 60,
        default: Date.now
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
    createNotification: () => {
        const resolver = resolvers.createOne()

        const originalResolver = resolver.resolve
        resolver.resolve = async (rp) => {
            
            const result = await originalResolver(rp)
            pubsub.publish('NOTIFICATION_CREATED', {
                notificationCreated: result.record.toObject()
            })
            return result
        }

        return resolver
    },
    deleteNotification: resolvers.removeById(),
    deleteNotifications: resolvers.removeMany(),
}

model.graphSubscriptions = {
    notificationCreated: {
        type: 'Notification',
        subscribe: withFilter(
            () => pubsub.asyncIterator(['NOTIFICATION_CREATED']),
            (payload, variables) => {
                const payloadUser = payload.notificationCreated.user._id.toString()
                const filterByUser = variables.user
                return payloadUser == filterByUser
            }
        ),
        args: { // input arguments
            user: 'ID!'
        }
    }
}

utils.addOneToManyRelation(model, 'user')
utils.addOneToManyRelation(model, 'integration')

module.exports = model