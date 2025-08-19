const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'unlock',
    category: 'mod',
    premium: false,

    run: async (client, message, args) => {
        // Check if the user has the necessary permissions
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            const error = new EmbedBuilder()
                .setColor('#FF0000') // Color for error message
                .setDescription(
                    `<a:cr:1290949952922718230>You must have \`Manage Channels\` permission to use this command.`
                );
            return message.channel.send({ embeds: [error] });
        }

        // Get the channel to unlock
        const channel =
            message.mentions.channels.first() ||
            message.guild.channels.cache.get(args[0]) ||
            message.channel;

        // Check if the channel is manageable (bot has permission to edit it)
        if (channel.manageable) {
            // Unlock the channel by allowing SEND_MESSAGES permission for @everyone
            channel.permissionOverwrites.edit(message.guild.id, {
                [PermissionFlagsBits.SendMessages]: true, // Correct permission flag for SendMessages
                reason: `${message.author.tag} (${message.author.id})`,
            }).catch(err => {
                // In case there's an error (e.g., missing permissions), catch it and notify the user
                console.error(err);
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(`There was an error unlocking the channel. Please check my permissions.`);
                return message.channel.send({ embeds: [errorEmbed] });
            });

            const emb = new EmbedBuilder()
                .setDescription(
                    `<a:Tick:1306038825054896209> ${channel} has been unlocked for @everyone role`
                )
                .setColor('#00FF00'); // Color for success message
            return message.channel.send({ embeds: [emb] });
        } else {
            const embi = new EmbedBuilder()
                .setDescription(
                    `<a:cr:1290949952922718230>I don't have adequate permissions to unlock this channel.`
                )
                .setColor('#FF0000');
            return message.channel.send({ embeds: [embi] });
        }
    }
};
