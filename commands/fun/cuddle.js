const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'cuddle',
    aliases: ['snuggle'],
    category: 'fun',
    run: async (client, message, args) => {
        // Ensure the user is mentioned
        const user = message.mentions.users.first();

        if (!user) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription(
                            "Please mention a user to cuddle! Usage: `cuddle @User`"
                        )
                ]
            });
        }

        // List of cuddle GIF URLs
        const cuddleGifs = [
            'https://media.giphy.com/media/3o7TKlzJDe7aWqSHlo/giphy.gif',
            'https://media.giphy.com/media/26tPplpQGlY5r5dZo/giphy.gif',
            'https://media.giphy.com/media/WXnpBf0g4gDbW/giphy.gif',
            'https://media.giphy.com/media/ntNu10avtd3sw/giphy.gif',
            'https://media.giphy.com/media/3o85xkBr3diT57u0AQ/giphy.gif'
        ];

        // Get a random cuddle GIF
        const randomGif = cuddleGifs[Math.floor(Math.random() * cuddleGifs.length)];

        // Create the embed with the cuddle message and GIF
        const embed = new EmbedBuilder()
            .setTitle(`🤗 Cuddle Time!`)
            .setDescription(`${message.author} is giving ${user} a warm cuddle! 🤗`)
            .setColor('FF0000')
            .setImage(randomGif)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        // Send the embed response
        message.channel.send({ embeds: [embed] });
    }
};
