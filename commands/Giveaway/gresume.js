const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'gresume',
  aliases: ['resumegw'],
  category: 'giveaway',
  description: 'Resume a giveaway',
  args: false,
  usage: 'gresume <message id>',
  userPerms: ['ManageGuild'],
  botPerms: [],
  owner: false,
  run: async (client, message, args, prefix) => {

    let messageId = args[0];
    if (!messageId) {
      return message.channel.send({
        embeds: [new EmbedBuilder().setDescription(`\`${prefix}gresume <message id>\``).setColor(client.color)]
      });
    }
    const response = await resume(client, message.member, messageId);  // Pass client here
    message.channel.send(response);
    
  }
};

async function resume(client, member, messageId) {  // Receive client here

  const giveaway = client.giveawaysManager.giveaways.find(
    (g) => g.messageId === messageId && g.guildId === member.guild.id
  );

  if (!giveaway) {
    return {
      embeds: [
        new EmbedBuilder()
          .setDescription(`${client.emoji.cross} ${member}: Giveaway with Id \`${messageId}\` not found`)
          .setColor(client.color)
      ]
    };
  }

  if (giveaway.ended) {
    return {
      embeds: [
        new EmbedBuilder()
          .setDescription(`${client.emoji.cross} ${member}: The giveaway has already ended`)
          .setColor(client.color)
      ]
    };
  }

  if (!giveaway.paused) {
    return {
      embeds: [
        new EmbedBuilder()
          .setDescription(`${client.emoji.cross} ${member}: The giveaway is not paused`)
          .setColor(client.color)
      ]
    };
  }

  try {
    await giveaway.unpause();
    return {
      embeds: [
        new EmbedBuilder()
          .setDescription(`${client.emoji.tick} ${member}: Resumed the giveaway \`${messageId}\``)
          .setColor(client.color)
      ]
    };
  } catch (error) {
    console.log(error);
    return {
      embeds: [
        new EmbedBuilder()
          .setDescription(`I was unable to resume the giveaway \`${messageId}\``)
          .setColor(client.color)
      ]
    };
  }
}
