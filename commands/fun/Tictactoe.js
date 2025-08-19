const { EmbedBuilder } = require('discord.js');
const simplydjs = require('simply-djs');

module.exports = {
  name: 'tictactoe',
  aliases: ["ttt","tictac"],
  edesc: 'ttt @user',
  description: 'Play tic-tac-toe',
  userPermissions: [],
  botPermissions: [],
  category: 'fun',
  cooldown: 5,

  execute: async (client, message, args) => {
    // Create an embed for the tic-tac-toe game
    const embed = new EmbedBuilder()
      .setTitle('Tic-Tac-Toe')
      .setDescription('Let\'s play Tic-Tac-Toe! React with the corresponding emojis to make your move.')
      .setColor(client.color);

    // Send the embed and start the game
    await message.channel.send({ embeds: [embed] });

    // Start the tic-tac-toe game
    await simplydjs.tictactoe(message, {});
  }
};