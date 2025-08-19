const { EmbedBuilder } = require('discord.js'); // Import EmbedBuilder

module.exports = {
  name: 'gpause',
  aliases: ['pausegw'],
  category: 'giveaway',
  description: 'Pause a giveaway',
  args: false,
  usage: 'gpause <message id>',
  userPerms: ['ManageGuild'],
  botPerms: [],
  owner: false,

  run: async (client, message, args, prefix) => {
    let messageId = args[0];
    if (!messageId) {
      return message.channel.send({
        embeds: [new EmbedBuilder().setDescription(`\`${prefix}gpause <message id>\``)] // Use EmbedBuilder here
      });
    }
    const response = await pause(message.member, messageId);
    message.channel.send(response);
  }
};

async function pause(member, messageId) {
  const giveaway = member.client.giveawaysManager.giveaways.find(
    (g) => g.messageId === messageId && g.guildId === member.guild.id
  );

  if (!giveaway) {
    return {
      embeds: [new EmbedBuilder().setDescription(`${member.client.emoji.cross} ${member}: Giveaway with Id \`${messageId}\` not found`)]
    };
  }

  if (giveaway.ended) {
    return {
      embeds: [new EmbedBuilder().setDescription(`${member.client.emoji.cross} ${member}: The giveaway has already ended`)]
    };
  }

  if (giveaway.paused) {
    return {
      embeds: [new EmbedBuilder().setDescription(`${member.client.emoji.cross} ${member}: The giveaway is already paused`)]
    };
  }

  try {
    await giveaway.pause();
    return {
      embeds: [new EmbedBuilder().setDescription(`${member.client.emoji.tick} ${member}: Paused the giveaway \`${messageId}\``)]
    };
  } catch (error) {
    console.log(error);
    return {
      embeds: [new EmbedBuilder().setDescription(`I was unable to pause the giveaway \`${messageId}\``)]
    };
  }
}
