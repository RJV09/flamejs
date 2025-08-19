const { EmbedBuilder } = require('discord.js');

const botOwners = ['1387826587172343990', '1387826587172343990'];

module.exports = {
    data: {
        name: 'gwarn',
        description: 'Send a warning to a user',
    },
    async execute(interaction) {
        if (!botOwners.includes(interaction.user.id)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:anxCross:1317554876712222794> | You don't have permission to use this command.`)
                ],
                ephemeral: true,
            });
        }
        let userId = interaction.options.getString('user');
        if (!userId) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:anxCross:1317554876712222794> | Please provide a valid user ID or mention a user.`)
                ],
                ephemeral: true,
            });
        }
        let user;
        try {
            user = await interaction.client.users.fetch(userId.replace(/[<@!>]/g, ''));
        } catch (error) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:anxCross:1317554876712222794> | Unable to fetch user. Please check the provided ID.`)
                ],
                ephemeral: true,
            });
        }
        try {
            const embed = new EmbedBuilder()
                .setTitle('FlaMe Global Warning | <:stolen_emoji:1317791407695462480>')
                .setDescription(
                    `You have received a warning from the server: **${interaction.guild.name}**.\n\n` +
                    `**Reason:** ${interaction.options.getString('reason') || 'No specific reason provided.'}`
                )
                .setColor('#000000')
                .setFooter({ text: 'Please ensure you follow the server rules to avoid further action.' });

            await user.send({ embeds: [embed] });
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('GREEN')
                        .setDescription(`<:stolen_emoji:1317791407695462480> Successfully sent a warning to **${user.tag}**.`)
                ],
                ephemeral: true,
            });
        } catch (error) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:anxCross:1317554876712222794> | Failed to send a warning. The user might have DMs disabled.`)
                ],
                ephemeral: true,
            });
        }
    }
};
