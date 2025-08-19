const { Discord,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
  } = require("discord.js");
  
  module.exports = {
    name: "logall",
    aliases: ["loggingall"],
    description: "All Logs",
    category: "logging",
    adminPermit : true,
    cooldown: 5,
    run: async (client, message, args, prefix) => {     
        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
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
        if (!client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have a higher role than me to use this command.`
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
        
        if (channel) {
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
                
                await client.util.sleep(2000);
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
                    voice: channel.id,
                    channel: channel.id,
                    rolelog: channel.id,
                    modlog: channel.id,
                    message: channel.id,
                    memberlog: channel.id
                });
                
                await message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setTitle('Logging All Events Configured')
                            .setDescription(`The channel ${channel} has been successfully configured for logging all types of events.`)
                            .addFields(
                                { name: 'Types of Logging Enabled', value: '`Message (Update, Delete)`\n`Member (Join, Leave, Role Update)`\n`Role (Create, Update, Delete)`\n`Channel (Create, Update, Delete)`\n`Modlog (Ban, Unban, Kick)`\n`Voice Logs (Member join, leave, move)`' },
                                { name: 'What happens now?', value: 'The bot will log various events in the configured channel, including messages, member actions, role changes, server updates, and channel modifications.' }
                            )
                    ]
                });
            }
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
