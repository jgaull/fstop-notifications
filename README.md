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
- [ ] Add authentication for Users
- [ ] Add authentication for Integration Providers
- [ ] Add subscription for Notifications
- [ ] Deploy to the cloud
- [ ] Add instructions for local development to README
- [ ] Share project with Mike
- [ ] Integration testing for core-services
- [ ] Unit testing for the twitch-chat integration
- [ ] Add support for more Twitch notifications
- [ ] Add webhook Integration Provider
- [ ] Password reset flow
- [ ] Make integration tokens "secret"
