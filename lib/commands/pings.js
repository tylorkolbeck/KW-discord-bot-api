module.exports = {
  name: 'ping',
  description: 'Ping!',
  aliases: ['test', 'hello'],
  cooldown: 5,
  execute(message, args) {
    message.channel.send('Pong.')
  }
}
