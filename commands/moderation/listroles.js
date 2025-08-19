const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'listroles',
    aliases: ['lr'],
    category: 'mod',
    premium: false,
    run: async (client, message, args) => {
        // Ensure that the command is run in a guild (server)
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
            // Fetch all roles in the server
            const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position);

            if (roles.size === 0) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription('There are no roles in this server.')
                    ]
                });
            }

            const rolesArray = Array.from(roles.values());
            const rolesPerPage = 5;
            let currentPage = 0;

            // Function to generate the embed for a specific page
            const generateEmbed = () => {
                const start = currentPage * rolesPerPage;
                const end = start + rolesPerPage;
                const rolesOnPage = rolesArray.slice(start, end);

                // Generate the role list to show on the embed
                const roleList = rolesOnPage
                    .map((role, index) => `**#${start + index + 1}** - ${role.name} (ID: ${role.id})`)
                    .join('\n');

                return new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle('Roles List')
                    .setDescription(roleList)
                    .setFooter({ text: `Page ${currentPage + 1} of ${Math.ceil(rolesArray.length / rolesPerPage)}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();
            };

            // Function to generate buttons
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
                            .setDisabled(currentPage === Math.ceil(rolesArray.length / rolesPerPage) - 1),
                        new ButtonBuilder()
                            .setCustomId('fast-back')
                            .setLabel('<<')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(currentPage <= 0),
                        new ButtonBuilder()
                            .setCustomId('fast-forward')
                            .setLabel('>>')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(currentPage >= Math.ceil(rolesArray.length / rolesPerPage) - 1)
                    );
            };

            // Send the initial message with the first embed and buttons
            const msg = await message.channel.send({
                embeds: [generateEmbed()],
                components: [generateButtons()]
            });

            // Create a button interaction collector
            const filter = (interaction) => interaction.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({
                filter,
                time: 60000, // Time to wait for interaction (1 minute)
            });

            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'back') {
                    currentPage--;
                } else if (interaction.customId === 'forward') {
                    currentPage++;
                } else if (interaction.customId === 'fast-back') {
                    currentPage = Math.max(0, currentPage - 5);
                } else if (interaction.customId === 'fast-forward') {
                    currentPage = Math.min(Math.ceil(rolesArray.length / rolesPerPage) - 1, currentPage + 5);
                }

                // Update the embed and buttons after the user clicks a button
                await interaction.update({
                    embeds: [generateEmbed()],
                    components: [generateButtons()]
                });
            });

            collector.on('end', () => {
                // Disable all buttons after the collector ends
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
            console.error('Error fetching roles:', error);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('There was an error fetching the roles list.')
                ]
            });
        }
    },
};
