const {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    Partials,
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    shards: "auto",
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ],
});

// Anti Crash
const process = require('node:process');

process.on('unhandledRejection', async(reason, promise) => {
    console.log('Unhandled Rejection at: ', promise, 'reason: ', reason);
});

process.on('uncaughtException', (err) => {
    console.log('Uncaught Execption: ', err);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('Uncaught Exception Monitor: ', err, origin);
});
// Anti Crash

const config = require("./src/config.js");
const { readdirSync } = require("fs");
const moment = require("moment");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

let token = config.token;

client.commands = new Collection();
client.slashcommands = new Collection();
client.commandaliases = new Collection();

const rest = new REST({ version: "10" }).setToken(token);

const log = (x) => {
    console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`);
};

// Command handler
const commands = [];
readdirSync("./src/commands/normal").forEach(async(file) => {
    const command = await require(`./src/commands/normal/${file}`);
    if (command) {
        client.commands.set(command.name, command);
        commands.push(command.name, command);
        if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach((alias) => {
                client.commandaliases.set(alias, command.name);
            });
        }
    }
});

// Slash command handler
const slashcommands = [];
readdirSync("./src/commands/slash").forEach(async(file) => {
    const command = await require(`./src/commands/slash/${file}`);
    slashcommands.push(command.data.toJSON());
    client.slashcommands.set(command.data.name, command);
});

// Importing Wait
const wait = require("timers/promises").setTimeout;
// Importing Wait

const invites = new Collection();

exports.INVITES = invites;

client.on(Events.ClientReady, async() => {
    await wait(1000);
    try {
        await rest.put(Routes.applicationCommands(client.user.id), {
            body: slashcommands,
        });
    } catch (error) {
        console.error(error);
    }

    try {
        // Loop over all the guilds
        client.guilds.cache.forEach(async(guild) => {
            // Fetch all Guild Invites
            const firstInvites = await guild.invites.fetch();

            // Set the key as Guild ID, and create a map which has the invite code, and the number of uses
            invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
        });

        log(`Invite Collection Initialized & Loaded!`)
    } catch (error) {
        console.error(error)
    }
    log(`${client.user.username} Activated!`);
});

// Event handler
readdirSync("./src/events").forEach(async(file) => {
    const event = await require(`./src/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
});

// Process listeners
process.on("unhandledRejection", (e) => {
    console.log(e);
});
process.on("uncaughtException", (e) => {
    console.log(e);
});
process.on("uncaughtExceptionMonitor", (e) => {
    console.log(e);
});

// Giveaway & MySQL Manager
// Load mysql
const MySQL = require('mysql');

const sql = MySQL.createPool({
    connectionLimit: 10,
    host: config.mysqlHost,
    user: config.mysqlUser,
    password: config.mysqlPassword,
    database: config.mysqlDatabase,
    charset: 'utf8mb4' // In order to save emojis correctly
});

sql.getConnection(function(err, connection) {
    if (err) {
        throw err;
    }

    console.log('[SQL] Connected to the MySQL server!');
});

// Port Listenr
const http = require('http');
const ws = require('ws');

const https = require('https');

const server = http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write('Lyxos API is available');
    res.end();
}).listen(6325);

const wsServer = new ws.Server({ server });

// On Websocket Connection
//wsServer.on('connection', socket => {
//    // On Message
//    socket.on('message', message => {
//        if (message == 'lyxosac-get-version') {
//            socket.send('4.0.0 | Beta')
//        }
//    });
//});
// Connection Manager

// Create giveaways table
sql.query(
    `
	CREATE TABLE IF NOT EXISTS \`giveaways\`
	(
		\`id\` INT(1) NOT NULL AUTO_INCREMENT,
		\`message_id\` VARCHAR(20) NOT NULL,
		\`data\` JSON NOT NULL,
		PRIMARY KEY (\`id\`)
	);
`,
    (err) => {
        if (err) console.error(err);
        console.log('[SQL] Created table `giveaways`');
    }
);

const { GiveawaysManager } = require('discord-giveaways');
const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    // This function is called when the manager needs to get all giveaways which are stored in the database.
    async getAllGiveaways() {
        return new Promise((resolve, reject) => {
            sql.query('SELECT `data` FROM `giveaways`', (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                const giveaways = res.map((row) =>
                    JSON.parse(row.data, (_, v) =>
                        typeof v === 'string' && /BigInt\("(-?\d+)"\)/.test(v) ? eval(v) : v
                    )
                );
                resolve(giveaways);
            });
        });
    }

    // This function is called when a giveaway needs to be saved in the database.
    async saveGiveaway(messageId, giveawayData) {
        return new Promise((resolve, reject) => {
            sql.query(
                'INSERT INTO `giveaways` (`message_id`, `data`) VALUES (?,?)', [messageId, JSON.stringify(giveawayData, (_, v) => (typeof v === 'bigint' ? `BigInt("${v}")` : v))],
                (err, res) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    resolve(true);
                }
            );
        });
    }

    // This function is called when a giveaway needs to be edited in the database.
    async editGiveaway(messageId, giveawayData) {
        return new Promise((resolve, reject) => {
            sql.query(
                'UPDATE `giveaways` SET `data` = ? WHERE `message_id` = ?', [JSON.stringify(giveawayData, (_, v) => (typeof v === 'bigint' ? `BigInt("${v}")` : v)), messageId],
                (err, res) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    resolve(true);
                }
            );
        });
    }

    // This function is called when a giveaway needs to be deleted from the database.
    async deleteGiveaway(messageId) {
        return new Promise((resolve, reject) => {
            sql.query('DELETE FROM `giveaways` WHERE `message_id` = ?', messageId, (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                resolve(true);
            });
        });
    }
};

// Create a new instance of your new class
const manager = new GiveawayManagerWithOwnDatabase(client, {
    default: {
        botsCanWin: false,
        embedColor: `#ff0000`,
        embedColorEnd: `#400000`,
        reaction: '🎉'
    }
});
// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager;
// Giveaway & MySQL Manager

const Main = class {
    async getConfig() {
        return config
    }

    async getInviteCollection() {
        return invites
    }
}

client.main = new Main();

client.login(token);