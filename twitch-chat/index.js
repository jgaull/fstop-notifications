require('dotenv').config()
const tmi = require('tmi.js')
const { request, gql } = require('graphql-request')

// Define configuration options
const opts = {
  channels: [
    process.env.CHANNEL_NAME
  ]
}

// Create a client with our options
const client = new tmi.client(opts)

// Register our event handlers (defined below)
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

// Connect to Twitch:
client.connect()

// Called every time a message comes in
async function onMessageHandler (target, context, message, self) {
  /*
  console.log('new chat message:')
  console.log(`   target: ${JSON.stringify(target)}`)
  console.log(`   context: ${JSON.stringify(context)}`)
  console.log(`   msg: ${JSON.stringify(message)}`)
  console.log(`   self: ${JSON.stringify(self)}`)
  */

  const query = gql`
  mutation CreateNotification($notification: NotificationInput) {
    createNotification(notification: $notification) {
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

  const variables = { 
    notification: {
      title: context['display-name'],
      type: "Info",
      data: JSON.stringify(context),
      integration: "twitch-chat",
      message
    }
  }

  try {
    await request(process.env.INGEST_PATH, query, variables)
    console.log(`success sending twitch chat message to ingest server!`)
  }
  catch (error) {
    console.log(`error sending notification from ${target} to the ingest server: ${error.stack}`)
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
}