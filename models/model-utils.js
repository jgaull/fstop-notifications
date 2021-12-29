

module.exports.addOneToManyRelation = (parentModel, key, dbKey) => {
    addRelation(parentModel, key, dbKey, 'findById', '_id')
}

module.exports.addManyToManyRelation = (parentModel, key, dbKey) => {
    addRelation(parentModel, key, dbKey, 'findByIds', '_ids')
}

function addRelation(parentModel, key, dbKey, resolverName, idArg) {

    const moduleName = parentModel.schema.paths[key].options.ref.toLowerCase()
    const childModel = require(`./${moduleName}`)

    parentModel.typeComposer.addRelation(key, {

        resolver: () => childModel.typeComposer.mongooseResolvers.findById(),
        prepareArgs: { 
            [idArg]: source => source[key] || null,
        },
        projection: {
            [dbKey || key]: true
        },
    })
}