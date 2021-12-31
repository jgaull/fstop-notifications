# fstop-notifications

## Local Development

- Install docker
- Install NVM
- `nvm use 14`
- `docker-compose up` to run the DB locally
- Visit http://localhost:4000/
index.js to test
- `npm start` to start the core services
- `cd twitch-chat && npm start` to start the Twitch Chat integration
 
## Todo
- [x] Add required parameters to the API
- [x] Add input validation
- [x] Add support for any type objects
- [x] Add authentication for Integration Providers
- [x] Add subscription for Notifications
- [x] Deploy to the cloud
- [x] Mongo TTL
- [x] Check that integration authentication works correctly when the username or password is wrong
- [ ] Add instructions for local development to README
- [ ] Share project with Mike
- [ ] [Move authentication to ApolloServer context](https://www.apollographql.com/docs/apollo-server/data/resolvers/#the-context-argument)
- [ ] [Add authentication for Users](https://www.apollographql.com/blog/backend/auth/email-password-authentication-with-accounts-js/)
- [ ] Integration testing for core-services
- [ ] Unit testing for the twitch-chat integration
- [ ] Add support for more Twitch notifications
- [ ] Add webhook Integration Provider
- [ ] Password reset flow
- [ ] Make integration tokens "secret"
- [ ] Authenticate subscriptions
