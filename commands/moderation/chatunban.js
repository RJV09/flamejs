const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'chatunban',
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

        // Get the mentioned member or by ID
        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<a:anxCross2:1321773462699642991> | You must mention a user or provide their ID to chatunban.`
                        ),
                ],
            });
        }

        // Retrieve the chatban info
        const channelId = await client.db.get(`chatban_${message.guild.id}_${member.id}`);
        if (!channelId) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<a:anxCross2:1321773462699642991> | This user is not chatbanned.`),
                ],
            });
        }

        try {
            // Remove the chatban from DB
            await client.db.delete(`chatban_${message.guild.id}_${member.id}`);

            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209>  | Successfully chatunbanned <@${member.user.id}>.`
                        ),
                ],
            });
        } catch (err) {
            console.error(`Chatunban error: ${err.message}`);
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<a:anxCross2:1321773462699642991> | An error occurred while trying to chatunban <@${member.user.id}>.`
                        ),
                ],
            });
        }
    },
};
