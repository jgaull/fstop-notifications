# fstop-notifications

## Run Locally
[Watch the how to video](https://www.loom.com/share/ec565598d3f14855b8169d8fa5b11846)

- Install docker
- Install NVM
- `nvm use 14`
- `npm i` to install dependencies
- Create a copy of `.env.template` and name it `.env`
- `docker-compose up` to run the DB locally
- `npm run seed` to populate the db with initial data
- `npm start` to run locally
- Visit http://localhost:4000/ to test
- Set up your Authorization header

## Testing
- [Users](https://studio.apollographql.com/sandbox/explorer?endpoint=http%3A%2F%2Flocalhost%3A4000&explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4QB0k4I4wIBOAngAQCqAzsVWcDmWTDUXQ0k0wnAIYCWAG0ZcA%2BvzAimMAA5heKBGACCKKWShEECpapEBfHIdxI4MFAv4ROAYS07qxABQASfkhnn0ZO9sWOiAEkPcwBKehFNPwQAp3dPFG83EJRwji4yHgFhTjEJdVl5RRU1XKYonRKDIxwQABoQADdeIn5eACNBBCoMEHSyLBB480HvfqZBmV4qKgB3CCJJDAGQKZn5xcG69UGoawAzfiI4AAVpuYWl70nzjaXtspWsoVGVgCsIdoRugAsAATgEDACAgADo9oNqkh9CB9EA)
- [Integrations](https://studio.apollographql.com/sandbox/explorer?endpoint=http%3A%2F%2Flocalhost%3A4000&explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4QEcYIE4CeABAJKoIDmeAhigJYRIDORwAOkkUXeVbQ81YcuXAPp0wwkSgIAHBFK48UlGvUYBVJviTVEi7rzUCAyghT0kFJgZja8QziLESDXBHGp0ANgYC%2BUgFIQRxwMCj8jEQAwngItAhkKnzqSAAUACRxUBB4YOgxcQkA8kiJRpFIZLLhAIQAlI5cUEUqSaqVadm5%2BURZCDl5jexOXN15JJJOQSFIHKHhlUQAIgje5uXJxoyZEgUAsowUECTLDU1EYGsb7SkCaeK9GRLDBuNgk4Ecs-NIYRGpFbXNoVVJMTIAMx8KjwBQAYtD8AAlDwQABuCH21CQBFu2yqSBqKHOIy4V3WIK2lXBUO8MIKGVpMNeoyISHgAEEIRCBioplwZiAADQgNHUPB0agAI3WTAwIFJRDYIHeyoKiq4ypk8jVSpAKAA7nQUFAABaiM20ZVCgzKuz4XXKgBsAEYoBCABwAdilXoGACYnVKwC6ACz%2BqBO0NS0NgCHW20gZQdVJmCw8ay69neXzTG1OZWuDB611QKXehAQgCsAGZIxCwFKw16PVKq1WXdQEwWQEyHcWNXrtQpi1qjSbzZaUMqvsEQH4gA)
- [Notifications](https://studio.apollographql.com/sandbox/explorer?endpoint=http%3A%2F%2Flocalhost%3A4000&explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4QEcYIE4CeABAHIQoCWAZhVAIaURIDORwAOkkUUudbQwpNWHLtyKUUAGwSdxRKHgQMEYAIIo54xM2Z0A5rLHcUBAA5H5tJgFU8Urd3pSpAFQhqojJI6JSKSADWvmAMdL4BKAj6eIJMbL7cAPoUYIkS5pbiAL6%2BMMz4CcbiKWnF3AhwdBQOxbnFpVr19ZxwMChxXADCSipklDT03gAUACRKUBB4YOhEPcpRAPJICP38Q0JIAJJIZu0AhACURU69UWuDncMTUzNE4wiT08ei8jfTJ-IKZ6oa6Y11JqcFo%2BUHMGAAI2YigoZm8pD4l288xUYDG%2BXwsy2ABEjp9eAMBMifmiMXhZqMyS9fJIZL4dHpDDTMhFUNFYvDXl9TBZ-qlfPV5GTPvIAV8iJVqrV5ILxKEOhFJkg7NLxM43B4vJtfP4gr4phR9AFUX8GvyxM1OK12p0iNiEDJzoiiZtmGMwA6EE7CRthAAxGpRclEANSIMAJUqEAAbggALJ0JAEC4upg7PYoPFcj2O1bO30sYY0MOY%2B45r15n2dZihoPU4pIeBqKhUR5RMrcZogAA0IGjdDwFDoEJkzAwIC57BA7zSGBFRCntNkc6nACEKIEEF0YIOIPkp93fFOGQZl7Mp1tWCgABYUK%2B3pD6IhMAD8B6PIB5Z4XIACVAg77FFO8rhCuE7sBBIDMBAiDYmEEFTugCGfrerB3kQdBEPKlTIbkPYfpE7KdIhP4AGwAIxQFQAAcADsYBQI8ABMpEQmA5EACxMVApEcRCHFUExgHyFOZIkVOFFUXREK0cxrHsVxPF8RxYBUFOTSHmIwGet66zVrW%2BAkVy3CLhQ0jflOcYbggfp4DBXSJnQoTqRamkmSAYlgZJNG0TJclsZx3G8fxqkudkIDZEAA)
 
## Todo
- [x] Add required parameters to the API
- [x] Add input validation
- [x] Add support for any type objects
- [x] Add authentication for Integration Providers
- [x] Add subscription for Notifications
- [x] Deploy to the cloud
- [x] Mongo TTL
- [x] Check that integration authentication works correctly when the username or password is wrong
- [x] Add instructions for local development to README
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
