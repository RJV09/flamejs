const { EmbedBuilder } = require('discord.js');
const tord = require('better-tord');

module.exports = {
  name: "truth or dare",
  aliases: ["t or d","td"],
  edesc: "tord",
  description: "Sends a random T_or_D question",
  userPermissions: [],
  botPermissions: [],
  category: "fun",
  cooldown: 5,

  execute: async (client, message, args) => {
    // Delete the command message after 300ms
    message.delete({ timeout: 300 });

    // Get a random T_or_D question from the better-tord module
    const t_or_d = tord.get_random_question();

    // Create an embed with the T_or_D question
    const emb = new EmbedBuilder()
      .setColor("FF0000")
      .setTitle("Random T_or_D")
      .addFields(
        {
          name: "Challenge:",
          value: t_or_d
        }
      );

    // Send the embed to the channel
    message.channel.send({ embeds: [emb] });
  }
};