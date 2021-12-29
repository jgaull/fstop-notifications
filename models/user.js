
const mongoose = require('mongoose')
const { composeMongoose } = require('graphql-compose-mongoose')
const bcrypt = require('bcrypt')

//Create a new Schema
const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false,
        minLength: 6
    }
},
{
    timestamps: { 
        createdAt: true,
        updatedAt: true
    }
})

//pre and post hooks
const SALT_WORK_FACTOR = 10
schema.pre('save', async function(next) {

    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next()

    try {
        // generate a salt
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)

        // hash the password using our new salt
        const hash = await bcrypt.hash(this.password, salt)

        // override the cleartext password with the hashed one
        this.password = hash
        next()
    }
    catch (error) {
        next(error)
    }
})

//schema methods
schema.methods.comparePassword = candidatePassword => {
    return bcrypt.compare(candidatePassword, this.password)
}

// create a new model
const model = mongoose.model('User', schema)
const typeComposer = composeMongoose(model, {
    removeFields: [
        'password'
    ]
})

//attach the typeComposer to the model
model.typeComposer = typeComposer

//generate custom types
model.customInputTypes = [{
    name: 'CreateUserInput',
    fields: {
        email: 'String!',
        password: 'String!',
        confirmPassword: 'String',
    },
}]

//map resolvers
const mongooseResolvers = typeComposer.mongooseResolvers

model.graphQueries = {
    users: mongooseResolvers.findMany(),
    user: mongooseResolvers.findById(),
}

model.graphMutations = {
    createUser: createUser(),
    updateUser: mongooseResolvers.updateOne(),
    deleteUser: mongooseResolvers.removeById(),
    deleteUsers: mongooseResolvers.removeMany()
}

//custom resolvers
function createUser() {
    return {
        type: 'User', // the return type
        args: { // input arguments
            input: 'CreateUserInput'
        },
        resolve: (source, args, context, info) => { //a resolver function

            const { email, password, confirmPassword } = args.input

            const newPassword = confirmPassword || password

            if ( newPassword != password ) {
                throw new Error('Passwords do not match')
            }

            const newUser = new model({
                password: newPassword,
                email
            })

            return newUser.save()
        },
    }
}

//export the model
module.exports = model