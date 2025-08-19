const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channelcount',
    aliases: ['cc'],
    category: 'mod',
    premium: false,
    run: async (client, message, args) => {
        if (!message.guild) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('This command can only be used in a server.')
                ]
            });
        }
        const totalChannels = message.guild.channels.cache.size;

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle('Channel Count')
            .setDescription(`This server has a total of **${totalChannels}** channels.`)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
        return message.channel.send({ embeds: [embed] });
    }
};
