require('dotenv').config()
const tmi = require('tmi.js')
const { request, gql } = require('graphql-request')

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
}

// Create a client with our options
const client = new tmi.client(opts)

// Register our event handlers (defined below)
client.on('message', (target, context, msg, self) => {
  try {
    onMessageHandler(target, console, msg, self)
  }
  catch (error) {
    console.log(error.stack)
  }
})

client.on('connected', onConnectedHandler)

// Connect to Twitch:
client.connect()

// Called every time a message comes in
async function onMessageHandler (target, context, msg, self) {
  console.log('new chat message:')
  console.log(`   target: ${JSON.stringify(target)}`)
  console.log(`   context: ${JSON.stringify(context)}`)
  console.log(`   msg: ${JSON.stringify(msg)}`)
  console.log(`   self: ${JSON.stringify(self)}`)

  const query = gql`
  mutation createNotification {
    createNotification(notification: {
        title: "bikecurious"
        message: "hello"
        type: "Info"
        data: "some json"
        integration: "twitch-chat"
      })
      {
        title
        message
        type
        iconUrl
        callToAction
        link
        timestamp
        _id
        data
        source
        user {
          name
          _id
        }
      }
  }
  `

  const response = await request(process.env.INGEST_PATH, query)
  console.log(`response: ${JSON.stringify(response)}`)
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
}