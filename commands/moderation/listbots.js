const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

module.exports = {
    name: 'listbots',
    aliases: ['bots'],
    category: 'mod',
    premium: false,
    run: async (client, message, args) => {
        if (!message.guild) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription('This command can only be used in a server.')
                ]
            });
        }

        try {
            const members = await message.guild.members.fetch();
            const botMembers = members.filter(member => member.user.bot);

            if (botMembers.size === 0) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setDescription('There are no bots in this server.')
                    ]
                });
            }

            const botsPerPage = 5;
            let currentPage = 0;
            const botMembersArray = Array.from(botMembers.values());
            const generateEmbed = () => {
                const start = currentPage * botsPerPage;
                const end = start + botsPerPage;
                const botsOnPage = botMembersArray.slice(start, end);
                const botList = botsOnPage
                    .map((member, index) => `**#${start + index + 1}** - ${member.user.tag}`)
                    .join('\n');

                return new EmbedBuilder()
                    .setColor(Colors.Blue)
                    .setTitle('Bot List')
                    .setDescription(botList)
                    .setFooter({ text: `Page ${currentPage + 1} of ${Math.ceil(botMembersArray.length / botsPerPage)}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();
            };
            const generateButtons = () => {
                return new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('back')
                            .setLabel('Back')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === 0),
                        new ButtonBuilder()
                            .setCustomId('forward')
                            .setLabel('Forward')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === Math.ceil(botMembersArray.length / botsPerPage) - 1),
                        new ButtonBuilder()
                            .setCustomId('fast-back')
                            .setLabel('<<')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(currentPage <= 0),
                        new ButtonBuilder()
                            .setCustomId('fast-forward')
                            .setLabel('>>')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(currentPage >= Math.ceil(botMembersArray.length / botsPerPage) - 1)
                    );
            };
            const msg = await message.channel.send({
                embeds: [generateEmbed()],
                components: [generateButtons()]
            });
            const filter = (interaction) => interaction.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({
                filter,
                time: 60000,
            });

            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'back') {
                    currentPage--;
                } else if (interaction.customId === 'forward') {
                    currentPage++;
                } else if (interaction.customId === 'fast-back') {
                    currentPage = Math.max(0, currentPage - 5);
                } else if (interaction.customId === 'fast-forward') {
                    currentPage = Math.min(Math.ceil(botMembersArray.length / botsPerPage) - 1, currentPage + 5);
                }
                await interaction.update({
                    embeds: [generateEmbed()],
                    components: [generateButtons()]
                });
            });

            collector.on('end', () => {
                msg.edit({
                    components: [generateButtons().setComponents(
                        new ButtonBuilder().setDisabled(true),
                        new ButtonBuilder().setDisabled(true),
                        new ButtonBuilder().setDisabled(true),
                        new ButtonBuilder().setDisabled(true)
                    )]
                });
            });
        } catch (error) {
            console.error('Error fetching bot members:', error);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red) 
                        .setDescription('There was an error fetching the bot members.')
                ]
            });
        }
    },
};
