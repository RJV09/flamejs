const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { getSettingsar } = require('../../models/autorole');

module.exports = {
    name: 'welcometest',
    category: 'welcomer',
    run: async (client, message, args) => {
        if (message.guild.memberCount < 30) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} Your server doesn't meet the 30 member requirement`)
                ]
            });
        }

        const settings = await getSettingsar(message.guild);

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('❌ You need **Administrator** permissions to use this command')
                ]
            });
        }

        if (
            message.author.id !== message.guild.ownerId && 
            !client.util.hasHigher(message.member)
        ) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.cross} You need a higher role than me to use this command`)
                ]
            });
        }
        try {
            const preview = await client.util.sendPreview(settings, message.member);
            
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(settings.welcome.embed?.color || client.color)
                        .setDescription(preview)
                        .setFooter({ text: 'Welcome Message Preview' })
                        .setTimestamp()
                ]
            });
        } catch (error) {
            console.error('Welcome Test Error:', error);
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${client.emoji.cross} Failed to generate preview: ${error.message}`)
                ]
            });
        }
    }
};