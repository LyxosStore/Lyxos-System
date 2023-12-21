const { Events, InteractionType } = require("discord.js");
const { EmbedBuilder, PermissionsBitField, Embed } = require("discord.js");

const config = require("../config.js")

module.exports = {
    name: Events.InviteCreate,
    execute: async(invite) => {
        const { INVITES } = require('../../index.js');

        INVITES.get(invite.guild.id).set(invite.code, invite.uses);
    }
}