const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "rolelog",
    aliases: ["rolelogging"],
    description: "Role Log",
    category: "logging",
    adminPermit: true,
    cooldown: 5,
    run: async (client, message, args, prefix) => {
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have \`MANAGE SERVER\` permissions to use this command.`
                        )
                ]
            });
        }

        let channel = getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
        if (!channel) {
            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Invalid Channel')
                        .setDescription('Please provide a valid channel for channel logs.')
                ]
            });
            return;
        }

        let data2 = await client.data.get(`logs_${message.guild.id}`);
        if (!data2) {
            await client.data.set(`logs_${message.guild.id}`, {
                voice: null,
                channel: null,
                rolelog: null,
                modlog: null,
                message: null,
                memberlog: null
            });

            const initialMessage = await message.channel.send({
                embeds: [new EmbedBuilder().setColor(client.color).setDescription('Configuring your server...')],
            });

      
            initialMessage.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Server Configuration Successful')
                        .setDescription('Your server has been successfully configured for logging.')
                ]
            });
        }

        if (data2) {
            await client.data.set(`logs_${message.guild.id}`, {
                voice: data2?.voice || null,
                channel: data2?.channel || null,
                rolelog: channel.id,
                modlog: data2?.modlog || null,
                message: data2?.message || null,
                memberlog: data2?.memberlog || null
            });

            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Role Logs Configured')
                        .setDescription(`The channel ${channel} has been successfully configured for logging role-related events.`)
                        .addFields(
                            { name: 'Types of Role Logging Enabled', value: '`Role Create`\n`Role Delete`\n`Role Update`' },
                            { name: 'What happens now?', value: 'The bot will log role creation, deletion, and updates in the configured channel.' }
                        )
                ]
            });
        }
    }
};

function getChannelFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<#(\d+)>$/);
    if (!matches) return null;

    const channelId = matches[1];
    return message.guild.channels.cache.get(channelId);
}
