const { Message, Client, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'membercount',
    aliases: ['mc'],
    category: 'info',
    premium: false,

    run: async (client, message, args) => {
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`**<a:warn:1306038705747660870> MemberCount**`)
            .setDescription(`<:users:1306927091413024819> ${message.guild.memberCount}`)
            .setTimestamp()

        message.channel.send({ embeds: [embed] })
    }
}
