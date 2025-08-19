const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'dick',
    aliases: ['dicksize', 'penis', 'dicksizer'],
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
                            "Please mention a user to calculate their dick size! Usage: `dick @User`"
                        )
                ]
            });
        }

        // List of random playful responses
        const dickSizes = [
            '10 inches of pure power!',
            '3 inches of raw might!',
            'A modest 6 inches, not bad!',
            'Too big for the world to handle.',
            'That’s classified information! 🤐',
            'Probably something small, but who knows? 😏',
            'Does size really matter though? 😉',
            'The size of a skyscraper! 🏙️',
            'A microbe could outsize that! 😅',
            'Why ask? We all know it’s huge! 😎'
        ];

        // Get a random response
        const randomDickSize = dickSizes[Math.floor(Math.random() * dickSizes.length)];

        // Create the embed with the playful message
        const embed = new EmbedBuilder()
            .setTitle(`🍆 Dick Size Information`)
            .setDescription(`${user}’s dick size is... **${randomDickSize}**`)
            .setColor('FF0000')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        // Send the embed response
        message.channel.send({ embeds: [embed] });
    }
};
