const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'wouldyourather',
    aliases: ['wyr', 'would-you-rather'],
    category: 'fun',
    run: async (client, message, args) => {
        // Define a list of "Would You Rather" questions
        const questions = [
            {
                question: "Would you rather fight 100 duck-sized horses or one horse-sized duck?",
                answer1: "100 duck-sized horses",
                answer2: "One horse-sized duck"
            },
            {
                question: "Would you rather always have to sing instead of speak or always have to dance instead of walk?",
                answer1: "Sing instead of speak",
                answer2: "Dance instead of walk"
            },
            {
                question: "Would you rather never be able to use the internet again or never be able to watch TV again?",
                answer1: "Never use the internet again",
                answer2: "Never watch TV again"
            },
            {
                question: "Would you rather have the ability to teleport anywhere or be able to read minds?",
                answer1: "Teleport anywhere",
                answer2: "Read minds"
            },
            {
                question: "Would you rather be a dog or a cat for a day?",
                answer1: "Be a dog",
                answer2: "Be a cat"
            }
        ];

        // Randomly select a question from the array
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

        // Create the embed for the question
        const embed = new EmbedBuilder()
            .setTitle("🎮 Would You Rather? 🎮")
            .setDescription(randomQuestion.question)
            .addFields(
                { name: "Option 1", value: randomQuestion.answer1, inline: true },
                { name: "Option 2", value: randomQuestion.answer2, inline: true }
            )
            .setColor('FF0000')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        // Send the embed to the channel
        message.channel.send({ embeds: [embed] });
    }
};
