const amqp = require('amqplib/callback_api')

const {
  RABBITMQ_URI,
  RABBITMQ_QUEUE,
  RABBITMQ_EXCHANGE
} = require('./utils/rabbitMQ')

amqp.connect(RABBITMQ_URI, function (error0, connection) {
  if (error0) {
    throw error0
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1
    }

    const message = 'Hello World!'

    channel.assertExchange(RABBITMQ_EXCHANGE, 'direct', { durable: true, autoDelete: false })
    channel.assertQueue(RABBITMQ_QUEUE, { durable: true, autoDelete: false })
    channel.bindQueue(RABBITMQ_QUEUE, RABBITMQ_EXCHANGE, '')
    channel.publish(RABBITMQ_EXCHANGE, '', Buffer.from(message))

    console.log(' [x] Sent %s', message)
  })

  setTimeout(function () {
    connection.close()
  }, 500)
})
