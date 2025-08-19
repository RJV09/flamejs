const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'vcban',
    category: 'mod',
    run: async (client, message, args) => {
        // Permission check: Only Guild Owner or users with Manage Channels can run this
        if (!message.member.permissions.has('MANAGE_CHANNELS') && message.guild.ownerId !== message.member.id) {
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

        // Get the member to be vcban
        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<a:anxCross2:1321773462699642991> | You must mention a user or provide their ID to vcban.`
                        ),
                ],
            });
        }

        // Try muting the member in the voice channel, if they're already in one
        if (member.voice.channel) {
            await member.voice.setMute(true, 'VC Ban by a Moderator');
        }

        // Save the VC ban status in memory or a database
        await client.db.set(`vcban_${message.guild.id}_${member.id}`, true);

        // Send success message in the channel
        message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        `<a:Tick:1306038825054896209>  | Successfully vc-banned <@${member.user.id}>. They are now muted in any voice channel they join.`
                    ),
            ],
        });

        // Try sending a DM to the user notifying them about the vcban
        try {
            await member.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `You have been **VC Banned** and cannot speak in any voice channel in **${message.guild.name}**.`
                        ),
                ],
            });
        } catch (err) {
            console.error(`Could not DM user: ${err.message}`);
        }
    },
};
