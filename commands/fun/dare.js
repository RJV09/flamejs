const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'dare',
    aliases: [],
    category: 'fun',
    run: async (client, message, args) => {
        // A list of dares
        const dares = [
            "Do 10 push-ups right now!",
            "Sing a song in the voice channel.",
            "Send a selfie to the chat.",
            "Change your profile picture to something silly for an hour.",
            "Type your next message using only emojis.",
            "Talk in third person for the next 10 messages.",
            "Act like a cat for the next 5 minutes.",
            "Send a random meme to the chat.",
            "Say 'I love pineapples on pizza' in general chat.",
            "Make up a 1-minute story and tell it in the voice channel."
        ];

        // Select a random dare
        const randomDare = dares[Math.floor(Math.random() * dares.length)];

        // Create an embed message
        const embed = new EmbedBuilder()
            .setTitle("Dare Time!")
            .setDescription(randomDare)
            .setColor("FF0000")
            .setTimestamp();

        // Send the dare in the channel
        message.channel.send({ embeds: [embed] });
    }
};