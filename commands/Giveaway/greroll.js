const { EmbedBuilder } = require('discord.js'); // Import EmbedBuilder

module.exports = {
  name: 'greroll',
  aliases: ['rerollgw'],
  category: 'giveaway',
  description: 'Reroll a giveaway',
  args: false,
  usage: 'greroll <message id>',
  userPerms: ['ManageGuild'],
  botPerms: [],
  owner: false,

  run: async (client, message, args, prefix) => {

    let messageId = args[0];
    if(!messageId){
      return message.channel.send({
        embeds: [new EmbedBuilder().setDescription(`\`${prefix}greroll <message id>\``)] // Use EmbedBuilder
      });
    }
    
    const response = await reroll(message.member, messageId);
    message.channel.send(response);
    
  }
}

async function reroll(member, messageId){

  const giveaway = member.client.giveawaysManager.giveaways.find(
    (g) => g.messageId === messageId && g.guildId === member.guild.id
  );

  if (!giveaway) return {
    embeds: [new EmbedBuilder().setDescription(`${member.client.emoji.cross} ${member}: Giveaway with Id \`${messageId}\` not found`)]
  };

  if (!giveaway.ended) return {
    embeds: [new EmbedBuilder().setDescription(`${member.client.emoji.cross} ${member}: The giveaway has not ended`)]
  };

  try {
    await giveaway.reroll();
    return {
      embeds: [new EmbedBuilder().setDescription(`${member.client.emoji.tick} ${member}: Rerolled the giveaway \`${messageId}\``)]
    };
  } catch (error) {
    console.log(error);
    return {
      embeds: [new EmbedBuilder().setDescription(`I was unable to reroll the giveaway \`${messageId}\``)]
    };
  }
}
