

module.exports.addOneToManyRelation = (parentModel, key, childModel, dbKey) => {

    const projection = {}

    if (dbKey) {
        projection[dbKey] = true
    }
    else {
        projection[key] = true
    }

    parentModel.typeComposer.addRelation(key, {

        resolver: () => childModel.typeComposer.mongooseResolvers.findById(),
        prepareArgs: { 
            _id: source => source[key] || null,
        },
        projection,
    })
}
