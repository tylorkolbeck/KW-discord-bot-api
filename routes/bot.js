var express = require('express')
var router = express.Router()
const discordController = require('./controllers/discord.controller')

// add authentication to all of these routes

/**
 * GET invitelink
 * Generate an invite link to the general channel
 */
router.get('/invitelink', discordController.inviteLink)

/**
 * POST /user/role/:action
 * Remove or add a role to a user
 */
router.post('/user/role/:action', discordController.editRole)

router.post('/channel/message', discordController.sendMessage)

module.exports = router
