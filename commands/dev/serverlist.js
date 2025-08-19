const { EmbedBuilder, Colors } = require('discord.js'); 
const config = require(`${process.cwd()}/config.json`);

module.exports = {
    name: 'serverslist',
    category: 'Owner',
    aliases: ['slist'],
    description: 'Shows the list of servers',
    usage: 'servers-list',
    run: async (client, message, args) => {
        if (!config.admin.includes(message.author.id)) return;
        let servers = [];
        client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .forEach((guild) => {
                servers.push(guild);
            });
        let serverslist = servers.map((guild, index) => {
            return `${index + 1}) ${guild.name} (${guild.id})`;
        });
        const embed = new EmbedBuilder()
            .setTitle(`**Server List Of ${client.user.username}**`)
            .setDescription(serverslist.join('\n'))
            .setColor(Colors.Blue)
            .setTimestamp();
        return message.channel.send({ embeds: [embed] });
    }
};
