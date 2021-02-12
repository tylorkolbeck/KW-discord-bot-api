const client = require('../../lib/discord')
const GUILD_ID = process.env.DISCORD_GUILD_ID

const discordController = {
  async inviteLink(req, res) {
    try {
      const channel = await client.channels.fetch('798324804075388941')

      channel
        .createInvite({ unique: true, maxUses: 1 })
        .then((invite) => res.send(invite))
        .catch((error) => {
          console.log(error)
          res.send(500)
        })
    } catch (error) {
      console.log(error)
      res.send(500)
    }
  },

  async editRole(req, res) {
    try {
      const { action } = req.params
      const { username, role } = req.body

      if (!action || !username || !role) {
        return res.send(
          'You must provide an action to perform with a role and the user to act on.'
        )
      }
      const guild = await client.guilds.cache.get(GUILD_ID)

      const roleToAdd = await guild.roles.cache.find(
        (guildRole) => guildRole.name === role
      )

      if (!roleToAdd) {
        return res.send('Role was not found')
      }

      const guildMember = await guild.members.fetch({
        query: username,
        limit: 1
      })

      const member = guildMember.first()

      if (!member) {
        return res.send('That user was not found')
      }

      if (action === 'add') {
        member.roles.add(roleToAdd)
        return res.send({ username, role, memberId: member.id })
      }

      if (action === 'remove') {
        member.roles.remove(roleToAdd)
        return res.send({ username, role, memberId: member.id })
      }
    } catch (error) {
      console.log(error)
      res.send(500)
    }
  },

  async addRole(req, res) {
    try {
      const { username, role } = req.body
      const guild = await client.guilds.cache.get(GUILD_ID)

      const roleToAdd = await guild.roles.cache.find(
        (guildRole) => guildRole.name === role
      )

      if (!roleToAdd) {
        return res.send('Role was not found')
      }

      const guildMember = await guild.members.fetch({
        query: username,
        limit: 1
      })

      const member = guildMember.first()

      if (!member) {
        return res.send('That user was not found')
      }

      member.roles.add(roleToAdd)

      res.send({ username, role, memberId: member.id })
    } catch (error) {
      console.log(error)
      res.send(500)
    }
  },

  async sendMessage(req, res) {
    const { channelName, message } = req.body
    if (!message) {
      return res.send('Please inlcude a message to send to the channel')
    }

    if (!channelName) {
      return res.send(
        'Please include the name of the channel that you like to message'
      )
    }
    try {
      const sendChannel = client.channels.cache.find(
        (channel) => channel.name === channelName
      )

      if (!sendChannel) {
        return res.send(`Channel ${channelName} was not found on your server`)
      }

      sendChannel.send(message)
      res.send(200)
    } catch (error) {
      console.log(error)
      res.send(500)
    }
  }
}

module.exports = discordController
