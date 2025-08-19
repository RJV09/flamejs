const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'chatban',
    category: 'mod',
    run: async (client, message, args) => {
        // Check if the user has ManageChannels permission or is the guild owner
        if (
            !message.member.permissions.has(PermissionsBitField.Flags.ManageChannels) &&
            message.guild.ownerId !== message.member.id
        ) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<a:anxCross2:1321773462699642991> | You must be the **Guild Owner** or have \`Manage Channels\` permission to use this command.`
                        ),
                ],
            });
        }

        // Get mentioned member or by ID
        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<a:anxCross2:1321773462699642991> | You must mention a user or provide their ID to chatban.`
                        ),
                ],
            });
        }

        try {
            const channelId = message.channel.id;

            // Store the chatban info in your database
            await client.db.set(`chatban_${message.guild.id}_${member.id}`, channelId);

            // Acknowledge success
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209>  | Successfully chatbanned <@${member.user.id}>.`
                        ),
                ],
            });

            // Attempt to DM the user
            try {
                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(
                                `You are currently chatbanned and cannot send messages in <#${channelId}> in **${message.guild.name}**.`
                            ),
                    ],
                });
            } catch (err) {
                console.error(`Could not DM user: ${err.message}`);
            }
        } catch (err) {
            console.error(`Chatban error: ${err.message}`);
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<a:anxCross2:1321773462699642991> | An error occurred while trying to chatban <@${member.user.id}>.`
                        ),
                ],
            });
        }
    },
};
