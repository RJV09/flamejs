const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'reaction',
    aliases: ['react', 'reactemoji'],
    category: 'fun',
    run: async (client, message, args) => {
        // Ensure the user mentions a message and provides an emoji
        const mentionedMessage = message.mentions.messages.first();
        const emoji = args[1]; // The emoji to react with

        if (!mentionedMessage) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription('Please mention a message to react to! Usage: `reaction <messageID> <emoji>`')
                ]
            });
        }

        if (!emoji) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription('Please provide an emoji to react with! Usage: `reaction <messageID> <emoji>`')
                ]
            });
        }

        try {
            // React to the mentioned message with the specified emoji
            await mentionedMessage.react(emoji);

            // Create a confirmation embed
            const embed = new EmbedBuilder()
                .setTitle("✅ Reaction Added!")
                .setDescription(`I have reacted to the message with the emoji: ${emoji}`)
                .setColor('FF0000')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

            // Send the confirmation embed
            message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription('Sorry, I was unable to react to the message. Please check the message ID or the emoji.')
                ]
            });
        }
    }
};
