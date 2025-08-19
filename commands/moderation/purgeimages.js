const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'purgeimages',
    aliases: ['purgeimg', 'clearimages'],
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
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | You don't have the `PermissionsBitField.Flags.ManageMessages` permission to use this command.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        // Set the number of messages to check for attachments (max: 100 messages)
        let limit = parseInt(args[0]) || 100; // Default to 100 messages if no number is provided

        if (limit > 100) limit = 100; // Limit to a maximum of 100 messages per purge

        try {
            const messages = await message.channel.messages.fetch({ limit });

            const messagesWithImages = messages.filter(msg => msg.attachments.size > 0 && msg.attachments.every(attachment => attachment.height || attachment.width)); // Check if message contains an image

            // If no images are found
            if (messagesWithImages.size === 0) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription("<:emoji_1725906884992:1306038885293494293> | No images found to purge in the last 100 messages.")
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            }

            // Purge messages with images
            await message.channel.bulkDelete(messagesWithImages, true);

            // Send confirmation message
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`<a:Tick:1306038825054896209> | Successfully purged ${messagesWithImages.size} image(s) from this channel.`)
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
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | There was an error trying to purge images.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }
    }
};
