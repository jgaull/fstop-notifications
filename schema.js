
const { schemaComposer } = require('graphql-compose')
const { makeExecutableSchema } = require('graphql-tools')

//If you get the error "Definition object should contain 'type' property"
// then it's probably because you accidentally assigned something other than
// a mongooseResolver to either the graphQueries or graphMutations property of
// one of the registered models
//module.exports = schemaComposer.buildSchema()

module.exports = (modelRegistry, schemas) => {

    for (const key in modelRegistry) {

        if (Object.hasOwnProperty.call(modelRegistry, key)) {

            const model = modelRegistry[key]
            schemaComposer.Query.addFields(model.graphQueries)
            schemaComposer.Mutation.addFields(model.graphMutations)
        }
    }

    if (!Array.isArray(schemas)) {
        schemas = [schemas]
    }

    schemas.forEach(schema => {
        schemaComposer.merge(schema)
    })
    
    return schemaComposer.buildSchema()
}