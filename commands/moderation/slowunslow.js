const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'slowmode',
    aliases: ['sm'],
    category: 'mod',
    cooldown: 5,
    permissions: ['MANAGE_CHANNELS'], // Ensure the user has permission to manage channels
    run: async (client, message, args) => {
        const embed = new EmbedBuilder().setColor(client.color);
        
        // Check if the user has permission to manage channels
        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038885293494293> | You need the `MANAGE_CHANNELS` permission to use this command.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        // Get the time in seconds from arguments
        const time = args[0];

        // If no time is provided, show the current slowmode status
        if (!time) {
            const currentSlowmode = message.channel.rateLimitPerUser;
            if (currentSlowmode === 0) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription('<a:Tick:1306038825054896209> | Slowmode is currently disabled in this channel.')
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            } else {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(`<a:Tick:1306038825054896209> | Slowmode is currently set to ${currentSlowmode} seconds in this channel.`)
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            }
        }

        // Check if the time is a valid number
        if (isNaN(time) || time < 0 || time > 21600) { // 21600 seconds = 6 hours
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038884992> | Please provide a valid number of seconds (1 - 21600).')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        // Set the slowmode (in seconds)
        try {
            await message.channel.setRateLimitPerUser(time);
            const successEmbed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`<a:Tick:1306038825054896209> | Slowmode has been set to ${time} seconds in this channel.`)
                .setTimestamp()
                .setFooter(client.user.username, client.user.displayAvatarURL());

            message.channel.send({ embeds: [successEmbed] });

        } catch (err) {
            console.error(err);
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038884992> | There was an error setting the slowmode.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }
    }
};
