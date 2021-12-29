

module.exports.addOneToManyRelation = (parentModel, key, dbKey) => {

    const projection = {}

    if (dbKey) {
        projection[dbKey] = true
    }
    else {
        projection[key] = true
    }

    const moduleName = parentModel.schema.paths[key].options.ref.toLowerCase()
    const childModel = require(`./${moduleName}`)

    parentModel.typeComposer.addRelation(key, {

        resolver: () => childModel.typeComposer.mongooseResolvers.findById(),
        prepareArgs: { 
            _id: source => source[key] || null,
        },
        projection,
    })
}
