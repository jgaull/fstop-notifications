
const mongoose = require('mongoose')
const { composeMongoose } = require('graphql-compose-mongoose')
const { schemaComposer } = require('graphql-compose')
const bcrypt = require('bcrypt')
const Joi = require('joi')

//Create a new Schema
const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        lowercase: true,
        validate: value => {
            const validationResult = Joi.string().email().validate(value)
            if (validationResult.error) {
                throw new Error(`"${value}" is not a valid email address.`)
            }
        }
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
schema.pre('save', async function(next) {

    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next()

    try {
        
        // override the cleartext password with the hashed one
        this.password = await hashPassword(this.password)
        next()
    }
    catch (error) {
        next(error)
    }
})

const SALT_WORK_FACTOR = 10
schema.statics.hashPassword = hashPassword

async function hashPassword (password) {
    // generate a salt
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)

    // hash the password using our new salt
    return bcrypt.hash(password, salt)
}

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
            input: schemaComposer.createInputTC({ //This can also be a string name of an already defined input object
                name: 'CreateUserInput',
                fields: {
                    email: 'String!',
                    password: 'String!',
                    confirmPassword: 'String',
                }
            })
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