const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'purgeemoji',
    aliases: ['purgeemojis', 'cleanspamemoji'],
    category: 'mod',
    cooldown: 5,
    permissions: ['PermissionsBitField.Flags.ManageMessages'],
    run: async (client, message, args) => {
        const embed = new EmbedBuilder().setColor(client.color);

        // Check if the user has the required permission
        if (!message.member.permissions.has('PermissionsBitField.Flags.ManageMessages')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | You don't have `PermissionsBitField.Flags.ManageMessages` permission to use this command.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        // Set the number of messages to check (default: 100 messages)
        let limit = parseInt(args[0]) || 100; // Default to 100 if no number is provided

        if (limit > 100) limit = 100; // Limit to a maximum of 100 messages

        try {
            // Fetch the messages to check for excessive emoji usage
            const messages = await message.channel.messages.fetch({ limit });

            // Filter messages that contain excessive emojis
            const emojiMessages = messages.filter(msg => {
                // Count the number of emojis in the message
                const emojiCount = (msg.content.match(/<a?:\w+:\d+>/g) || []).length;

                // Check if the message contains more than a specified number of emojis (e.g., 5)
                return emojiCount >= 5;
            });

            // If no messages with excessive emojis are found
            if (emojiMessages.size === 0) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription("<:emoji_1725906884992:1306038885293494293> | No emoji spam found to purge.")
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            }

            // Purge messages with excessive emojis
            await message.channel.bulkDelete(emojiMessages, true);

            // Send confirmation message
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`<a:Tick:1306038825054896209> | Successfully purged ${emojiMessages.size} message(s) containing excessive emojis.`)
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });

        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | There was an error trying to purge messages with excessive emojis.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }
    }
};
