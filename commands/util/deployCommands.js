const { SlashCommandBuilder } = require('@discordjs/builders');
const { Routes } = require('discord-api-types/v9');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('deploy')
    .setDescription('deploys slash commands.'),

    execute(client){
        const clientId = '909232603771568158', guildId = '708032158614159432';
        let cmds = [];
        (async () => {
            try{
                console.log('Started refreshing application (/) commands.');
                client.commands.forEach( (cmd) => {
                    cmds.push(cmd.data)
                })
                await client.REST.put(
                    Routes.applicationGuildCommands(clientId, guildId), {
                        body: cmds
                    }
                );
                //await rest.put(Routes.applicationCommands(clientId),{body:commands});
                console.log('Successfully reloaded application (/) commands.');
                console.log(`online`);
            }catch(err){console.log(err)}
        })();
    }
}
