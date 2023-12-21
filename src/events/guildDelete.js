const { Events, InteractionType } = require("discord.js");
const { EmbedBuilder, PermissionsBitField, Embed } = require("discord.js");

const config = require("../config.js")

module.exports = {
    name: Events.GuildDelete,
    execute: async(guild) => {
        const { INVITES } = require('../../index.js');

        INVITES.delete(guild.id);
    }
}