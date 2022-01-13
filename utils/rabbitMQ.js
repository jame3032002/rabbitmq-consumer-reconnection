const amqp = require('amqplib')

const { retry } = require('./retry')

const RABBITMQ_URI = 'amqp://kajame:111111@localhost:5672'
const RABBITMQ_QUEUE = 'message-queue'
const RABBITMQ_EXCHANGE = 'kajame-exchange'
let alClose = false // already close

async function startMessaging (onConnection) {
  async function makeConnection () {
    const messagingConnection = await retry(() => amqp.connect(RABBITMQ_URI, { reconnect: true }), 1000, 5000)

    alClose = false

    messagingConnection.on('close', () => {
      if (!alClose) {
        console.log('connection closed! Will attempt reconnection')
        alClose = true

        makeConnection()
          .then(() => console.log('reconnected to rabbit'))
          .catch(() => console.log('failed to reconnect to Rabbit'))
      }
    })

    messagingConnection.on('error', () => console.log('error from rabbit'))

    const promise = onConnection(messagingConnection)
    if (promise) {
      promise
        .then(() => console.log('connection callback completed'))
        .catch(() => console.log('connection callback error'))
    }
  }

  await makeConnection()
}

module.exports = {
  startMessaging,
  RABBITMQ_URI,
  RABBITMQ_QUEUE,
  RABBITMQ_EXCHANGE
}
