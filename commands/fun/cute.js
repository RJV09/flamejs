const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'cute',
    aliases: ['adorable', 'cutepic', 'cutest'],
    category: 'fun',
    run: async (client, message, args) => {
        // List of cute image/GIF URLs
        const cuteImages = [
            'https://media.giphy.com/media/26AOlzVfNTZvi4pe0/giphy.gif',
            'https://media.giphy.com/media/26tn33aiTi1jks2f6/giphy.gif',
            'https://media.giphy.com/media/3o6Zt8iXkxLf2eDZY8/giphy.gif',
            'https://media.giphy.com/media/26gJsz3CvcopItgQS/giphy.gif',
            'https://media.giphy.com/media/l3q2K5jinAlp7W3mg/giphy.gif',
            'https://media.giphy.com/media/9J7td3pmyDN2S/giphy.gif',
            'https://media.giphy.com/media/1hPfa6qH8iwYPiQX3Q/giphy.gif'
        ];

        // Get a random cute image/GIF
        const randomCuteImage = cuteImages[Math.floor(Math.random() * cuteImages.length)];

        // Create the embed with a cute message and image
        const embed = new EmbedBuilder()
            .setTitle('🌸 Here’s Something Cute! 🌸')
            .setDescription(`${message.author} wanted to share something cute! 😍`)
            .setColor('FF0000')
            .setImage(randomCuteImage)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        // Send the embed response
        message.channel.send({ embeds: [embed] });
    }
};
