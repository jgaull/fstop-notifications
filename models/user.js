
const mongoose = require('mongoose')
const { composeMongoose } = require('graphql-compose-mongoose');

const schema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

//schema.method({method: () => 'thing' }) for future reference

const model = mongoose.model('User', schema)
const composer = composeMongoose(model, {})
const resolvers = composer.mongooseResolvers

model.graphQueries = {
    users: resolvers.findMany()
}

model.graphMutations = {
    createUser: resolvers.createOne(),
    updateUser: resolvers.updateOne(),
    deleteUser: resolvers.removeById(),
    deleteUsers: resolvers.removeMany()
}

module.exports = model