
const { schemaComposer } = require('graphql-compose')

const modelRegistry = {
    User: require('./models/user')
}

for (const key in modelRegistry) {

    if (Object.hasOwnProperty.call(modelRegistry, key)) {

        const model = modelRegistry[key]
        schemaComposer.Query.addFields(model.graphQueries)
        schemaComposer.Mutation.addFields(model.graphMutations)
    }
}

module.exports = schemaComposer.buildSchema()