const {
    Client,
    EmbedBuilder,
    PermissionsBitField
} = require('discord.js');

module.exports = {
    name: "memberlog",
    aliases: ["memberlogging"],
    description: "Member Log",
    category: "logging",
    adminPermit: true,
    cooldown: 5,
    run: async (client, message, args, prefix) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
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
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Invalid Channel')
                        .setDescription('Please provide a valid channel for channel logs.')
                ],
            });
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
                ],
            });
        }

        if (data2) {
            await client.data.set(`logs_${message.guild.id}`, {
                voice: data2.voice || null,
                channel: data2.channel || null,
                rolelog: data2.rolelog || null,
                modlog: data2.modlog || null,
                message: data2.message || null,
                memberlog: channel.id
            });
            
            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Member Logs Configured')
                        .setDescription(`The channel ${channel} has been successfully configured for logging member-related events.`)
                        .addFields(
                            { name: 'Types of Member Logging Enabled', value: '\`Member Join\`\n\`Member Leave\`\n\`Member Role Update\`' },
                            { name: 'What happens now?', value: 'The bot will log member joins, leaves, and member role updates in the configured channel.' }
                        )
                ],
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
