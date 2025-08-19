const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'rockpaperscissors',
    aliases: ['rockpaperscissors', 'rpsgame'],
    category: 'fun',
    run: async (client, message, args) => {
        // Define the valid choices
        const choices = ['rock', 'paper', 'scissors'];

        // Ensure the user provides a valid choice
        const userChoice = args[0]?.toLowerCase();
        if (!userChoice || !choices.includes(userChoice)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription('Please choose either rock, paper, or scissors! Usage: `rps <rock/paper/scissors>`')
                ]
            });
        }

        // Get the bot's random choice
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        // Determine the winner
        let result;
        if (userChoice === botChoice) {
            result = 'It\'s a tie!';
        } else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = 'You win!';
        } else {
            result = 'You lose!';
        }

        // Create the result embed
        const embed = new EmbedBuilder()
            .setTitle('🪓 Rock, Paper, Scissors 🧻')
            .setDescription(`
                **You chose:** ${userChoice}
                **Bot chose:** ${botChoice}

                **Result:** ${result}
            `)
            .setColor(result === 'You win!' ? 'GREEN' : result === 'You lose!' ? 'RED' : 'YELLOW')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        // Send the result embed
        message.channel.send({ embeds: [embed] });
    }
};
