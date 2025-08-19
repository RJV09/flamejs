const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'adminlist',
    aliases: ['al'],
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
            const members = await message.guild.members.fetch();

            const adminMembers = members.filter((member) =>
                member.permissions.has(PermissionsBitField.Flags.Administrator)
            );

            if (adminMembers.size === 0) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription('There are no admins in this server.')
                    ]
                });
            }

            const usersPerPage = 5;
            let currentPage = 0;
            const adminArray = Array.from(adminMembers.values());
            const generateEmbed = () => {
                const start = currentPage * usersPerPage;
                const end = start + usersPerPage;
                const adminsOnPage = adminArray.slice(start, end);
                const userList = adminsOnPage
                    .map((member, index) => `**#${start + index + 1}** - ${member.user.tag}`)
                    .join('\n');

                return new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle('Admin List')
                    .setDescription(userList)
                    .setFooter({ text: `Page ${currentPage + 1} of ${Math.ceil(adminArray.length / usersPerPage)}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
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
                            .setDisabled(currentPage === Math.ceil(adminArray.length / usersPerPage) - 1),
                        new ButtonBuilder()
                            .setCustomId('fast-back')
                            .setLabel('<<')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(currentPage <= 0),
                        new ButtonBuilder()
                            .setCustomId('fast-forward')
                            .setLabel('>>')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(currentPage >= Math.ceil(adminArray.length / usersPerPage) - 1)
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
                    currentPage = Math.min(Math.ceil(adminArray.length / usersPerPage) - 1, currentPage + 5);
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
            console.error('Error fetching admins:', error);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(client.color)
                        .setDescription('There was an error fetching the admin list.')
                ]
            });
        }
    },
};
