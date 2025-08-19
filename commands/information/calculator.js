const { EmbedBuilder } = require('discord.js');
const simplydjs = require('simply-djs');

module.exports = {
    name: 'calculator',
    category: 'info',
    aliases: ['calc'],
    usage: '!calculator or !calc',
    run: async (client, message, args) => {
        simplydjs.calculator(message, {
            embedColor: client.color,
            credit: false // Ensuring credit is set to false
        });

        // Create a message collector to monitor new messages in the channel
        const filter = (m) => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 15000 });

        collector.on('collect', (collectedMessage) => {
            // Check if the unwanted credit text appears in the message content
            if (collectedMessage.content.includes("©️ Rahuletto. npm i simply-djs")) {
                collectedMessage.delete() // Delete the unwanted credit message
                    .catch(err => console.error("Failed to delete message:", err)); // Error handling for delete
            }
        });

        // Optional: Send a custom footer embed to replace the credit text
        const footerEmbed = new EmbedBuilder()
            .setFooter({ text: '2025 All Rights Reserved Pulse Development' });

        message.channel.send({ embeds: [footerEmbed] });
    }
};
