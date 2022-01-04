
const { schemaComposer } = require('graphql-compose')

module.exports = (modelRegistry, schemas) => {

    for (const key in modelRegistry) {
        
        const model = modelRegistry[key]

        if (model.graphQueries) {
            schemaComposer.Query.addFields(model.graphQueries)
        }
        
        if (model.graphMutations) {
            schemaComposer.Mutation.addFields(model.graphMutations)
        }
        
        if (model.graphSubscriptions) {
            schemaComposer.Subscription.addFields(model.graphSubscriptions)
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