
const { schemaComposer } = require('graphql-compose')

// making this a dictionary because I feel like that will be useful later on.
const modelRegistry = {
    /* User: require('./models/user'), */
    Notification: require('./models/notification'),
    Integration: require('./models/integration')
}

for (const key in modelRegistry) {

    if (Object.hasOwnProperty.call(modelRegistry, key)) {

        const model = modelRegistry[key]
        schemaComposer.Query.addFields(model.graphQueries)
        schemaComposer.Mutation.addFields(model.graphMutations)
    }
}

//If you get the error "Definition object should contain 'type' property"
// then it's probably because you accidentally assigned something other than
// a mongooseResolver to either the graphQueries or graphMutations property of
// one of the registered models
module.exports = schemaComposer.buildSchema()