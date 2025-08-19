const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'smug',
    aliases: ['smugface', 'smugreaction'],
    category: 'fun',
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || message.author; // Mentioned user or the author if no mention

        // List of smug GIFs or images
        const smugGifs = [
            'https://media.giphy.com/media/4tE2HqakF9mqs/giphy.gif',
            'https://media.giphy.com/media/3o6fJ7pD4Wojs4kHCo/giphy.gif',
            'https://media.giphy.com/media/xT8qB5vW8rjV7C2rw4/giphy.gif',
            'https://media.giphy.com/media/3ohs4oCxijFbHfm6xO/giphy.gif'
        ];

        // Select a random smug GIF from the array
        const smugGif = smugGifs[Math.floor(Math.random() * smugGifs.length)];

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle(`${user.username} is feeling smug!`)
            .setImage(smugGif)
            .setColor('FF0000')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        // Send the embed
        message.channel.send({ embeds: [embed] });
    }
};
