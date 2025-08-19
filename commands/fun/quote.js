const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'quote',
    aliases: ['randomquote', 'inspireme', 'quoteoftheday'],
    category: 'fun',
    run: async (client, message, args) => {
        // List of predefined quotes
        const quotes = [
            "The only way to do great work is to love what you do. – Steve Jobs",
            "In three words I can sum up everything I've learned about life: it goes on. – Robert Frost",
            "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. – Ralph Waldo Emerson",
            "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. – Albert Schweitzer",
            "Life is what happens when you're busy making other plans. – John Lennon",
            "Get busy living or get busy dying. – Stephen King",
            "It is never too late to be what you might have been. – George Eliot",
            "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
            "You must be the change you wish to see in the world. – Mahatma Gandhi",
            "The only limit to our realization of tomorrow is our doubts of today. – Franklin D. Roosevelt"
        ];

        // Get a random quote from the array
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        // Create the embed with the quote
        const embed = new EmbedBuilder()
            .setTitle("💬 Random Quote")
            .setDescription(randomQuote)
            .setColor('FF0000')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        // Send the quote embed
        message.channel.send({ embeds: [embed] });
    }
};
