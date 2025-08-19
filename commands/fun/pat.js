const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'pat',
    aliases: ['pet', 'patpet'],
    category: 'fun',
    run: async (client, message, args) => {
        // Ensure the user is mentioned
        const user = message.mentions.users.first();

        if (!user) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription('Please mention a user to pat! Usage: `pat @User`')
                ]
            });
        }

        // List of cute pat-related GIFs
        const patGifs = [
            'https://media.giphy.com/media/l0Exv5aO0I2oFZ2u4/giphy.gif', // Cute pat GIF 1
            'https://media.giphy.com/media/JwMjk3AfTQmCs/giphy.gif',     // Cute pat GIF 2
            'https://media.giphy.com/media/2vnIZPYVG9jle/giphy.gif',     // Cute pat GIF 3
            'https://media.giphy.com/media/TzkgTSQF9zM8s/giphy.gif',     // Cute pat GIF 4
            'https://media.giphy.com/media/xT1R9vC7mjyzQ7wLfc/giphy.gif'  // Cute pat GIF 5
        ];

        // Get a random pat GIF
        const randomPatGif = patGifs[Math.floor(Math.random() * patGifs.length)];

        // Create the embed with the pat message
        const embed = new EmbedBuilder()
            .setTitle(`🤗 Patting Time!`)
            .setDescription(`${message.author} is patting ${user} on the head! 😇`)
            .setColor('FF0000')
            .setImage(randomPatGif)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        // Send the embed response
        message.channel.send({ embeds: [embed] });
    }
};
