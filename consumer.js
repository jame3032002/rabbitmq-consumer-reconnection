const {
  startMessaging,
  RABBITMQ_QUEUE,
  RABBITMQ_EXCHANGE
} = require('./utils/rabbitMQ')

function consumer () {
  startMessaging(async messagingConnection => {
    const channel = await messagingConnection.createChannel()

    channel.assertExchange(RABBITMQ_EXCHANGE, 'direct', { durable: true, autoDelete: false })
    channel.assertQueue(RABBITMQ_QUEUE, { durable: true, autoDelete: false })
    channel.bindQueue(RABBITMQ_QUEUE, RABBITMQ_EXCHANGE, '')
    channel.consume(RABBITMQ_QUEUE, async function (msg) {
      if (msg.content) {
        const message = msg.content.toString()
        console.log(message, '<- message')
      }
    }, { noAck: true })
  })
}

consumer()
