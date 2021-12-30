
const { schemaComposer } = require('graphql-compose')

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