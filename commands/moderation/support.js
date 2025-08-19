const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'support',
    aliases: ['helpserver', 'supportserver'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        // Replace with your support server invite link
        const supportServerLink = 'https://discord.gg/rfzop';
        
        // Create a new embed message with some basic information and animation (you can use a GIF URL here)
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle('Need Help? Join Our Support Server!')
            .setDescription(
                `If you need any assistance or have any questions, feel free to join our support server. Our team is always ready to assist you!`
            )
            .addField('Support Server Link', `[Click here to join the support server](${supportServerLink})`)
            .setImage('https://media.giphy.com/media/l0MYy9YxeJZ2JOUda/giphy.gif') // Example gif link (replace with your own if needed)
            .setFooter({
                text: `If you're having trouble, our staff is always ready to assist you!`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();

        // Create buttons with actions for the user
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Join Support Server')
                    .setStyle('LINK')
                    .setURL(supportServerLink),
                new ButtonBuilder()
                    .setLabel('More Info')
                    .setStyle('PRIMARY')
                    .setCustomId('more_info') // Custom ID for handling button interaction
            );

        // Send the embed along with the buttons
        const sentMessage = await message.channel.send({
            embeds: [embed],
            components: [row],
        });

        // Handle the button interactions (when the user clicks "More Info")
        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'more_info') {
                // Update the message to give more info (You can customize this part)
                await interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setTitle('More Info About the Support Server')
                            .setDescription('Here you can find more details about how we handle support requests.')
                            .addField('Support Hours', '24/7 support available.')
                            .addField('Available Channels', 'We have channels for general support, bot issues, and suggestions.')
                            .setFooter({
                                text: `Requested by ${message.author.tag}`,
                                iconURL: message.author.displayAvatarURL({ dynamic: true }),
                            })
                            .setTimestamp(),
                    ],
                    components: [row], // Keep the buttons
                });
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                sentMessage.edit({
                    components: [], // Remove buttons after 15 seconds
                });
            }
        });
    },
};
