const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getSettingsar } = require('../../models/autorole');

module.exports = {
    name: 'welcomereset',
    category: 'welcomer',
    run: async (client, message, args) => {
        // Check server member count requirement
        if (message.guild.memberCount < 30) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Your Server Doesn't Meet My 30 Member Criteria`
                        )
                ]
            });
        }

        const settings = await getSettingsar(message.guild);

        // Permission checks
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `You must have \`Administration\` perms to run this command.`
                        )
                ]
            });
        }

        // Ownership and hierarchy checks
        const isown = message.author.id === message.guild.ownerId;
        if (!isown && !client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have a higher role than me to use this command.`
                        )
                ]
            });
        }

        // Check if welcomer is already disabled
        if (!settings.welcome.enabled) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `The welcomer module for this server is already disabled.`
                        )
                ]
            });
        }

        // Reset the welcomer module
        try {
            await reset(client, settings);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.check} | Successfully reset the welcomer module.`
                        )
                ]
            });
        } catch (error) {
            console.error('Error resetting welcomer:', error);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF0000')
                        .setDescription(
                            `${client.emoji.cross} | An error occurred while resetting the welcomer module.`
                        )
                ]
            });
        }
    }
};

async function reset(client, settings) {
    settings.welcome = {
        enabled: false,
        channel: null,
        content: null,
        autodel: 0,
        embed: {
            image: null,
            description: null,
            color: null,
            title: null,
            thumbnail: false,
            footer: null
        }
    };
    await settings.save();
}