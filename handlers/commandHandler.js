const { Collection } = require('discord.js');
const { toHMS } = require('../functions/toHMS');

module.exports = {
    execute(message, client, prefix) {
        if(prefix === undefined || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const cmdName = args.shift().toLowerCase();
        const cmd = client.commands.get(cmdName);

        if(!cmd || cmd.nsfw && !message.channel.nsfw) return;
        if(message.author.id === '439039443744063488'){
            try {
                return cmd.execute(message, args, client);
            } catch (error) {
                message.reply(`ERROR.\n\`\`\`${error}\`\`\``);
                return console.error(error);
            }
        }
        if(cmd.disabled) return message.reply('This command is currently disabled.');
        if(cmd.permissions){
            if(!message.member.permissions.has(cmd.permissions)) return message.reply(`You need to have the permission \`${command.permissions}\` to use this command.`);
        }

        if(!client.cooldowns.has(cmdName)){
            client.cooldowns.set(cmdName, new Collection());
        }
        const now = Date.now();
        const timestamps = client.cooldowns.get(cmdName);
        const cooldownAmount = (cmd.cooldown || 2.5) * 1000;
        if(timestamps.has(message.author.id)){
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if(now < expirationTime){
                return message.reply(`Please wait \`${toHMS(((expirationTime - now) / 1000).toFixed(1))}\` before reusing the \`${command.name}\` command.`);
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            cmd.execute(message, args, client);
        } catch (error) {
            message.reply(`Sorry, but there was an error with that command.\n\`\`\`${error}\`\`\`If error persists please contact shhh#7612.`);
            console.error(error);
        }
    }
}
