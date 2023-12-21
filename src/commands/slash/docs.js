const { EmbedBuilder, PermissionsBitField, Embed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('docs')
        .setDescription('Our docs'),
    run: async(client, interaction) => {

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Project Lyxos')
            .setDescription('# Documentation:\n\nYou can find our Docs here: https://docs.lyxos.de/')
            .setTimestamp()
            .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });
        interaction.reply({ embeds: [embed] })
    }
};