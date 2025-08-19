const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'purgespam',
    aliases: ['purgebots', 'cleanspam'],
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
            // Fetch the messages to check for spam (sent in the last `limit` messages)
            const messages = await message.channel.messages.fetch({ limit });

            // Filter out messages that are too similar (e.g., same content sent repeatedly in a short time)
            const spamMessages = messages.filter(msg => {
                // Check for spam based on repetitive message content (same message sent multiple times in quick succession)
                return (
                    msg.content.length > 5 && // Message is not too short (to avoid bot command issues)
                    messages.some(m => m.content === msg.content && m.author.id === msg.author.id) // Same message from same user
                );
            });

            // If no spam messages are found
            if (spamMessages.size === 0) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription("<:emoji_1725906884992:1306038885293494293> | No spam found to purge.")
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            }

            // Purge spam messages
            await message.channel.bulkDelete(spamMessages, true);

            // Send confirmation message
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`<a:Tick:1306038825054896209> | Successfully purged ${spamMessages.size} spam message(s) from this channel.`)
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
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | There was an error trying to purge spam messages.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }
    }
};
