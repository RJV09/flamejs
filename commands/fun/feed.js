const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'feed',
    aliases: ['givefood', 'feedme', 'feedbot'],
    category: 'fun',
    run: async (client, message, args) => {
        // Ensure the user is mentioned
        const user = message.mentions.users.first();

        if (!user) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription('Please mention a user to feed! Usage: `feed @User`')
                ]
            });
        }

        // List of food images/GIFs
        const foodGifs = [
            'https://media.giphy.com/media/1zTQ7hDoyHtja/giphy.gif', // Cookie feeding GIF
            'https://media.giphy.com/media/3o7TKzjLvT0F1Zk8vw/giphy.gif', // Pizza feeding GIF
            'https://media.giphy.com/media/xT0xeJpnrK5zYFwzBm/giphy.gif', // Cake feeding GIF
            'https://media.giphy.com/media/3oFzmrNh6ygfzR6e9m/giphy.gif', // Ice cream feeding GIF
            'https://media.giphy.com/media/26gJsqHDZomng/giiphy.gif'  // Sandwich feeding GIF
        ];

        // Get a random food image/GIF
        const randomFoodGif = foodGifs[Math.floor(Math.random() * foodGifs.length)];

        // Create the embed with the feeding message
        const embed = new EmbedBuilder()
            .setTitle(`🍔 Feeding Time!`)
            .setDescription(`${message.author} is feeding ${user} some delicious food! 🍕🍪`)
            .setColor('FF0000')
            .setImage(randomFoodGif)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        // Send the embed response
        message.channel.send({ embeds: [embed] });
    }
};
