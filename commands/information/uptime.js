const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'uptime',
    category: 'info',
    premium: false,

    run: async (client, message, args) => {
        const durationInSeconds = Math.round(client.uptime / 1000);

        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(durationInSeconds / (24 * 3600));
        const hours = Math.floor((durationInSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds % 60;

        // Create a formatted string for uptime with each on a new line
        const uptimeString = `
            **<a:icons_online:1322878596565565440> | Days:** ${days}
            **<a:icons_online:1322878596565565440> | Hours:** ${hours}
            **<a:icons_online:1322878596565565440> | Minutes:** ${minutes}
            **<a:icons_online:1322878596565565440> | Seconds:** ${seconds}
        `;

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`**<a:stolen_emoji:1338588519509000262> | I have been online continuously for:**\n${uptimeString}`);

        await message.channel.send({ embeds: [embed] });
    }
};
