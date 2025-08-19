const { Message, Client, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
  name: 'roleicon',
  category: 'info',
  premium: true,
  run: async (client, message, args) => {
    const embed = new EmbedBuilder().setColor(client.color);
    const isOwner = message.author.id === message.guild.ownerId;

    if (!message.member.permissions.has('MANAGE_ROLES')) {
      return message.channel.send({
        embeds: [
          embed
            .setDescription(
              `${client.emoji.cross} | You must have \`Manage Roles\` permissions to use this command.`
            )
        ]
      });
    }

    if (!message.guild.members.me.permissions.has('MANAGE_ROLES')) {
      return message.channel.send({
        embeds: [
          embed
            .setDescription(
              `${client.emoji.cross} | I don't have \`Manage Roles\` permissions to execute this command.`
            )
        ]
      });
    }

    if (!isOwner && message.member.roles.highest.position <= message.guild.members.me.roles.highest.position) {
      return message.channel.send({
        embeds: [
          embed
            .setDescription(
              `${client.emoji.cross} | You must have a higher role than me to use this command.`
            )
        ]
      });
    }

    // Check if the server is boosted to Level 2 or higher
    if (message.guild.premiumTier === 'NONE' || parseInt(message.guild.premiumTier) < 2) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `${client.emoji.cross} | Your Server Doesn't Meet The **Roleicon** Requirements. Servers with level **2** boosts are allowed to set role icons`
            )
        ]
      });
    }

    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.cross} | Usage: \`${message.guild.prefix}roleicon <role> <emoji>\``)
        ]
      });
    }

    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!role) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.cross} | Provide a valid role.`)
        ]
      });
    }

    if (role && !role.editable) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.cross} | ${role} is above my role in the hierarchy.`)
        ]
      });
    }

    // If the role already has an icon and no emoji is provided
    if (role.iconURL() && !args[1]) {
      try {
        await role.setIcon(null);
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(`${client.emoji.tick} | Successfully removed the icon from ${role}.`)
          ]
        });
      } catch (err) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(`${client.emoji.cross} | I cannot edit ${role}'s icon due to hierarchy. Check my role position.`)
          ]
        });
      }
    }

    // If no emoji is provided
    if (!args[1]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.cross} | Please provide an emoji.`)
        ]
      });
    }

    const emojiRegex = /<a?:\w{2,}:\d{17,20}>/g;
    if (!args[1].match(emojiRegex)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.cross} | Please provide a **valid** emoji.`)
        ]
      });
    }

    const emojiID = args[1].replace(/[^0-9]/g, '');
    const baseUrl = `https://cdn.discordapp.com/emojis/${emojiID}.png`; // Fixed emoji URL

    try {
      await role.setIcon(baseUrl);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.tick} | Successfully set the icon for ${role}.`)
        ]
      });
    } catch (err) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.cross} | I cannot set the icon for ${role}. Ensure my role is high enough.`)
        ]
      });
    }
  }
};
