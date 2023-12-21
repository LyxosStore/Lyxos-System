const { Events, InteractionType } = require("discord.js");
const { EmbedBuilder, PermissionsBitField, Embed } = require("discord.js");

const config = require("../config.js")

module.exports = {
    name: Events.GuildMemberAdd,
    execute: async(member) => {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Project Lyxos')
            .setDescription(`# Welcome:\n\n:wave: A new __person__ is on our __discord__, please welcome <@${member.id}>, please check out our Rules: <#${config.rulesChannelId}>.`)
            .setTimestamp()
            .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: Automod`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });

        const channel = member.guild.channels.cache.get(config.welcomeChannelId)
        channel.send({ embeds: [embed] })

        var role = member.guild.roles.cache.find(role => role.name == config.autoRoleNameOnJoin)
        member.roles.add(role);

        // Initialize Client
        const client = member.client

        // Initialize Invites
        const { INVITES } = require('../../index.js');

        // To compare, we need to load the current invite list.
        const newInvites = await member.guild.invites.fetch()

        // This is the *existing* invites for the guild.
        const oldInvites = INVITES.get(member.guild.id);

        // Look through the invites, find the one for which the uses went up.
        const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));

        // This is just to simplify the message being sent below (inviter doesn't have a tag property)
        const inviter = await client.users.fetch(invite.inviter.id);

        // Get the log channel (change to your liking)
        const logChannel = member.guild.channels.cache.find(channel => channel.id === config.logChannelId);

        // A real basic message with the information we need. 
        inviter
            ?
            logChannel.send(`${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times since its creation.`) :
            logChannel.send(`${member.user.tag} joined but I couldn't find through which invite.`);
    }
}