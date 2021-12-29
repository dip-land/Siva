require('dotenv').config();
const { prefixes } = require("./config.json");

const { Client, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const client = new Client(
    {
        intents: [
            'GUILDS',
            'GUILD_PRESENCES',
            'GUILD_MEMBERS',
            'GUILD_BANS',
            'GUILD_INVITES',
            'GUILD_MESSAGES',
            'GUILD_VOICE_STATES',
        ]
    }
)

client.cooldowns = new Collection();
client.commands = new Collection();
client.REST = new REST({ version: '9' }).setToken(process.env.token);

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

require('./handlers/userdataHandler').start(sequelize, Sequelize)

require("glob")('./commands/**/*.js', function (err, res) {
    res.forEach(async cmd => {
        try{
            const command = require(cmd);
            client.commands.set(command.data.name.toLowerCase(), command)
        }catch(err){console.log(err)}
    });
})

client.once('ready', () => {
    console.log('Online.');
    require('./handlers/userdataHandler').sync();
});

client.on('messageCreate', (message) => {
    let prefix = prefixes.find(p => message.content.startsWith(p));
    require('./handlers/commandHandler').execute(message, client, prefix);
    require('./handlers/userdataHandler').execute(message, client, prefix);
})

client.login(process.env.TOKEN);
