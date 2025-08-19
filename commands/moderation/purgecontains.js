const { Message, Client, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'purgecontains',
    aliases: ['purgekeyword', 'purge'],
    category: 'mod',
    premium: false,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async (client, message, args) => {
        // Check if the user has administrator or manage messages permissions
        if (!message.member.permissions.has('PermissionsBitField.Flags.ManageMessages')) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000') // Red for error
                        .setDescription('You must have `Manage Messages` permission to purge messages.')
                ]
            });
        }

        // Ensure a keyword is specified
        const keyword = args.join(' ');
        if (!keyword) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000') // Red for error
                        .setDescription('Please provide a keyword or text to search for.')
                ]
            });
        }

        try {
            // Fetch messages from the channel
            const messages = await message.channel.messages.fetch({ limit: 100 });

            // Filter messages containing the keyword
            const messagesToDelete = messages.filter(msg => msg.content.toLowerCase().includes(keyword.toLowerCase()));

            // If no messages contain the keyword
            if (messagesToDelete.size === 0) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('FF0000') // Red for error
                            .setDescription(`No messages found containing the keyword \`${keyword}\`.`)
                    ]
                });
            }

            // Delete the messages
            await message.channel.bulkDelete(messagesToDelete, true);

            // Inform the user about the purge
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('00FF00') // Green for success
                        .setDescription(`Successfully purged ${messagesToDelete.size} messages containing the keyword \`${keyword}\`.`)
                ]
            });

        } catch (error) {
            console.error('Error purging messages:', error);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000') // Red for error
                        .setDescription('An error occurred while purging messages.')
                ]
            });
        }
    }
};
