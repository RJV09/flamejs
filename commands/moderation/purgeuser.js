const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'purgeuser',
    aliases: ['purgeusermessages', 'purgeusermsgs'],
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

        // Check if a user was mentioned or a user ID was provided
        const user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!user) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | Please mention a user or provide their ID to purge their messages.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        // Set the number of messages to check (default: 100 messages)
        let limit = parseInt(args[1]) || 100; // Default to 100 if no number is provided
        if (limit > 100) limit = 100; // Limit to a maximum of 100 messages

        try {
            // Fetch the messages to check for the specified user
            const messages = await message.channel.messages.fetch({ limit });

            // Filter messages from the specific user
            const userMessages = messages.filter(msg => msg.author.id === user.id);

            // If no messages from the user are found
            if (userMessages.size === 0) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(`<:emoji_1725906884992:1306038885293494293> | No messages found from ${user.tag} to purge.`)
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            }

            // Purge the user's messages
            await message.channel.bulkDelete(userMessages, true);

            // Send confirmation message
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`<a:Tick:1306038825054896209> | Successfully purged ${userMessages.size} message(s) from ${user.tag}.`)
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
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | There was an error trying to purge messages from this user.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }
    }
};
