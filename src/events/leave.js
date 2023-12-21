const { Events, InteractionType } = require("discord.js");
const { EmbedBuilder, PermissionsBitField, Embed } = require("discord.js");

const config = require("../config.js")

module.exports = {
    name: Events.GuildMemberRemove,
    execute: async(member) => {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Project Lyxos')
            .setDescription(`# Bye:\n\n:wave: A __person__ has left our __Discord__, Goodbye <@${member.id}>.`)
            .setTimestamp()
            .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: Automod`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });

        const channel = member.guild.channels.cache.get(config.goodbyeChannelId)
        channel.send({ embeds: [embed] })

    }
}