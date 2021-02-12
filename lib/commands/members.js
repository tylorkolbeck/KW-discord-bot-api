module.exports = {
  name: 'members',
  description: 'Get a list of all members',
  guildOnly: true,
  // permissions: 'KICK_MEMBERS',
  execute(message, args) {
    console.log(`getting all members `)
    console.log(message.guild.available)
    const guildmembers = message.guild.members
    console.table(guildmembers)
  }
}
