const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Displays bot latency and api gateway latency.'),

    execute(message){
        message.reply('billa dumb');
    },

    executeSlash(interaction){

    }

}
