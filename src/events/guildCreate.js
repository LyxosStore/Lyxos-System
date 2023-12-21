const { Events, InteractionType } = require("discord.js");
const { EmbedBuilder, PermissionsBitField, Embed } = require("discord.js");

const config = require("../config.js")

module.exports = {
    name: Events.GuildCreate,
    execute: async(guild) => {
        const { INVITES } = require('../../index.js');

        // We've been added to a new Guild. Let's fetch all the invites, and save it to our cache
        guild.invites.fetch().then(guildInvites => {
            // This is the same as the ready event
            INVITES.set(guild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
        })
    }
}