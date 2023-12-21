const { EmbedBuilder, PermissionsBitField, Embed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const https = require('https');

var helpMessageList = JSON.parse("{}")

function getproblems() {
    https.get('https://api.cloudassets.eu/gethelpmessages', res => {
        const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
        console.log(' ');
        console.log('Getting Help Messages..');
        console.log('Status Code:', res.statusCode);
        console.log(' ');

        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            helpMessageList = JSON.parse(data)
        });

    }).on('error', err => {
        console.log('Error while getting error codes: ', err.message);
    });
}

getproblems()

setInterval(getproblems, 5000);

function getTokenIdentifier(token, identifier) {
    var token = token
    var identifier = identifier
    var found = false
    var id = 0

    for (var code in helpMessageList) {
        if (helpMessageList[code].problem == token) {
            found = true
            id = code
        }
    }

    if (found) {
        if (identifier == "problem") {
            if (helpMessageList[id].problem) {
                return helpMessageList[id].problem
            } else {
                return false
            }
        } else if (identifier == "helpmessages") {
            if (helpMessageList[id].helpmessage) {
                return helpMessageList[id].helpmessage
            } else {
                return false
            }
        } else {
            return false
        }
    } else {
        return false
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Ehhhh, i need help owo')
        .addStringOption(option =>
            option
            .setName('problem')
            .setDescription('The Problem')
            .setRequired(true)),
    run: async(client, interaction) => {
        if (getTokenIdentifier([interaction.options.getString('problem')], "problem")) {
            let problem = interaction.options.getString('problem')
            let helpMessage = getTokenIdentifier(problem, "helpmessages")

            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Project Lyxos')
                .setDescription(`# Your Personal Helper :). ✅\n\n__Your Help:__\n${helpMessage}`)
                .setTimestamp()
                .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });
            interaction.reply({ embeds: [embed] })
        } else {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Project Lyxos')
                .setDescription(`# Ohhh, i think i can't help you! ❌\n\nAn error occurred when searching for help pepeSad, either the help does not exist or it is not yet entered in our database... :x:`)
                .setTimestamp()
                .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });
            interaction.reply({ embeds: [embed] })
        }
    }
};