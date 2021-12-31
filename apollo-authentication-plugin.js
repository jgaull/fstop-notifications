
const basicAuthParser = require('basic-auth-parser')

const Integration = require('./models/integration')

module.exports = {
    
    async requestDidStart(initialRequestContext) {

        const authorization = initialRequestContext.request.http.headers.get('authorization')
        const { username, password } = basicAuthParser(authorization)

        let integration
        try {
            integration = await Integration.find({
                _id: username,
                clientKey: password
            })
        }
        catch (error) {
            console.log(`Error authentication integration: ${error.message}`)
        }
        
        if (!integration) {
            throw new Error(`Integration ID and Client Key combination does not match a valid integration`)
        }

        initialRequestContext.context.integration = integration
    }
}
