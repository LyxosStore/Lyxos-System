const { Events, InteractionType } = require("discord.js");
const { EmbedBuilder, PermissionsBitField, Embed } = require("discord.js");

const config = require("../config.js")

module.exports = {
    name: Events.InviteDelete,
    execute: async(invite) => {
        const { INVITES } = require('../../index.js');

        INVITES.get(invite.guild.id).delete(invite.code);
    }
}