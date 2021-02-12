const fs = require('fs')
const { Client, Intents, Collection } = require('discord.js')
let intents = new Intents(Intents.NON_PRIVILEGED)
intents.add('GUILD_MEMBERS')
const client = new Client({ ws: { intents: intents } })

// async function test() {
//   let user = await client.api.users('2628').get()
//   console.log(user)
// }
// test()

// console.log(client.api.users('2628').get())

// client.users.fetch(true)

// client.users.get('username', 'testacct')
// const list = client.guilds.cache.get('798324804075388938')
// console.log(list)

// list.members.cache.forEach((member) => console.log(member.user))
// async function getAllUsers() {
//   const users = await client.users.fetch('2628')
//   console.log(users)
// }

// getAllUsers()
// console.log(client.guilds.get(process.env.DISCORD_CLIENT_ID))

// console.log(client.users.cache)
// console.log(guild.members.filter(member))
// client.guilds.cache.find((guild) => {
//   console.log(guild)
// })

client.commands = new Collection()
const cooldowns = new Collection()

const commandFiles = fs
  .readdirSync('./lib/commands')
  .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)

  client.commands.set(command.name, command)
}

const { prefix } = require('./config.json')
const { cooldown } = require('./commands/pings')
const members = require('./commands/members')

client.once('ready', async () => {
  console.log('Your Bot Is Ready')
  // const guilds = await client.guilds.cache.map((guild) => guild.id)
  // const guild = await client.guilds.cache.get('798324804075388938')

  // const memberList = await guild.members.fetch()
  //   .then((members) => console.log(members))
  //   .catch((error) => console.log(error))
  // console.log(memberList)

  // console.log(guild)

  // console.log(guild.channels)
  // guild.channels.cache.map((channel) => {
  //   console.log({ id: channel.id, name: channel.name })
  // })
  // client.guilds
  //   .get(guild.id)
  //   .fetchMembers()
  //   .then((r) => {
  //     r.members.array().forEach((r) => {
  //       console.log(r.user.username)
  //     })
  //   })
  // const members = await guild.members.cache.map(
  //   (member) => member.user.username
  // )
  // console.log(members)
  // const generalChannel = await client.channels.cache.get('798324804075388941')
  // generalChannel.send('!ping')
  // console.log(generalChannel.members.map((member) => member.id))
  // console.log(guilds)
})

client.on('message', (message) => {
  // LIMIT USER MANAGEMENT STUFF TO BOT OR ADMIN
  if (!message.content.startsWith(prefix) || message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  const args = message.content.slice(prefix.length).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    )

  if (!command) return

  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply(`I cant execute that command inside DMs`)
  }

  if (command.permissions) {
    const authorPerms = message.channel.permissionsFor(message.author)
    if (!authorPerms || !authorPerms.has(command.permissions)) {
      return message.reply('You cant do this')
    }
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`

    if (command.usage) {
      reply += `\n The proper usage would be: \ ${prefix}${command.name} ${command.usage}`
    }

    return message.channel.send(reply)
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 3) * 1000

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return message.reply(
        `pleasee wait ${timeLeft.toFixed(
          1
        )} more seconds before reusing the \${command.name}\ command.`
      )
    }
  }

  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

  try {
    command.execute(message, args)
  } catch (error) {
    console.log(error)
    message.reply('there was an error trying to execute that command')
  }
})

module.exports = client
