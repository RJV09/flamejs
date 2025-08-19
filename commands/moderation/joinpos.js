const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'joinposlist',
    aliases: ['jpl'],
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

        try {
            const members = await message.guild.members.fetch({ cache: true });
            
            const sortedMembers = Array.from(members.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp).values());

            if (sortedMembers.length === 0) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription('There are no members in this server.')
                    ]
                });
            }
            const usersPerPage = 10;
            let currentPage = 0;
            const totalPages = Math.ceil(sortedMembers.length / usersPerPage);
            const generateEmbed = () => {
                const start = currentPage * usersPerPage;
                const end = start + usersPerPage;
                const membersOnPage = sortedMembers.slice(start, end);

                const userList = membersOnPage
                    .map((member, index) => `**#${start + index + 1}** - ${member.user.tag} (Joined: <t:${Math.floor(member.joinedTimestamp / 1000)}:R>)`)
                    .join('\n');

                return new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle(`Join Position List - ${message.guild.name}`)
                    .setDescription(userList)
                    .setFooter({ 
                        text: `Page ${currentPage + 1}/${totalPages} • ${sortedMembers.length} total members`, 
                        iconURL: message.author.displayAvatarURL({ dynamic: true }) 
                    })
                    .setTimestamp();
            };
            const generateButtons = () => {
                return new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('fast-back')
                            .setLabel('<<')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(currentPage <= 0),
                        new ButtonBuilder()
                            .setCustomId('back')
                            .setLabel('<')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === 0),
                        new ButtonBuilder()
                            .setCustomId('forward')
                            .setLabel('>')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage >= totalPages - 1),
                        new ButtonBuilder()
                            .setCustomId('fast-forward')
                            .setLabel('>>')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(currentPage >= totalPages - 1),
                        new ButtonBuilder()
                            .setLabel(`${currentPage + 1}/${totalPages}`)
                            .setCustomId('page-indicator')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                    );
            };
            const msg = await message.channel.send({
                embeds: [generateEmbed()],
                components: [generateButtons()]
            });
            const filter = (interaction) => interaction.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({
                filter,
                time: 300000,
            });

            collector.on('collect', async (interaction) => {
                try {
                    switch (interaction.customId) {
                        case 'back':
                            currentPage = Math.max(0, currentPage - 1);
                            break;
                        case 'forward':
                            currentPage = Math.min(totalPages - 1, currentPage + 1);
                            break;
                        case 'fast-back':
                            currentPage = Math.max(0, currentPage - 5);
                            break;
                        case 'fast-forward':
                            currentPage = Math.min(totalPages - 1, currentPage + 5);
                            break;
                    }

                    await interaction.update({
                        embeds: [generateEmbed()],
                        components: [generateButtons()]
                    });
                } catch (error) {
                    console.error('Error handling interaction:', error);
                }
            });

            collector.on('end', () => {
                try {
                    const disabledRow = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('fast-back-disabled')
                            .setLabel('<<')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('back-disabled')
                            .setLabel('<')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('forward-disabled')
                            .setLabel('>')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('fast-forward-disabled')
                            .setLabel('>>')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setLabel(`${currentPage + 1}/${totalPages}`)
                            .setCustomId('page-indicator-disabled')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                    );

                    msg.edit({
                        components: [disabledRow]
                    }).catch(console.error);
                } catch (error) {
                    console.error('Error ending collector:', error);
                }
            });

        } catch (error) {
            console.error('Error in joinposlist command:', error);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('An error occurred while processing this command.')
                ]
            });
        }
    },
};