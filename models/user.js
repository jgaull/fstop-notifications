
const mongoose = require('mongoose')
const { composeMongoose } = require('graphql-compose-mongoose')

const schema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

//schema.method({method: () => 'thing' }) for future reference

const model = mongoose.model('User', schema)
const typeComposer = composeMongoose(model, {})
const resolvers = typeComposer.mongooseResolvers

model.graphQueries = {
    users: resolvers.findMany(),
    user: resolvers.findById(),
}

model.graphMutations = {
    createUser: resolvers.createOne(),
    updateUser: resolvers.updateOne(),
    deleteUser: resolvers.removeById(),
    deleteUsers: resolvers.removeMany()
}

model.typeComposer = typeComposer

module.exports = model