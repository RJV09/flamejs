const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('../../models/boost.js');

module.exports = {
    name: 'setboost',
    aliases: ['boost'],
    category: 'info',
    run: async (client, message, args) => {
        // Check if the user has the ADMINISTRATOR permission
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Administrator\` perms to run this command.`,
                        ),
                ],
            });
        }

        // Check if the user wants to disable the boost message
        const disable = args[0] ? args[0].toLowerCase() === 'off' : null;

        let channel, hasPerms = null;

        // Fetch the channel if not disabling
        if (!disable) {
            channel =
                message.mentions.channels.first() ||
                message.guild.channels.cache.get(args[0]);

            // Validate the channel
            if (!channel) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | You didn't provide a valid channel.`,
                            ),
                    ],
                });
            }

            // Check if the bot has permissions to send messages in the channel
            hasPerms = message.guild.members.me
                .permissionsIn(channel)
                .has(PermissionsBitField.Flags.SendMessages);

            if (!hasPerms) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | I don't have permissions to send messages in <#${channel.id}>.`,
                            ),
                    ],
                });
            }
        }

        // Fetch or create the boost data
        let data = await db.findOne({ Guild: message.guildId });
        if (!data) {
            data = new db({
                Guild: message.guild.id,
                Boost: disable ? null : channel.id,
            });
        } else {
            data.Boost = disable ? null : channel.id;
        }

        // Save the data
        await data.save();

        // Send confirmation message
        message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        disable
                            ? `<a:Tick:1306038825054896209> | I'll not send messages when someone boosts the server.`
                            : `<a:Tick:1306038825054896209> | I'll now send messages to <#${channel.id}> when someone boosts the server.`,
                    ),
            ],
        });
    },
};