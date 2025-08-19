const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "unbanall",
  aliases: ["unball"],
  UserPerms: ['BanMembers'],
  BotPerms: ['BanMembers'],
  voteOnly: false,
  category: 'mod',
  run: async (client, message, args) => {
    try {
      // Ensure the message is not from a bot
      if (message.author.bot) {
        return;
      }

      // Ensure message.member exists and the bot has GUILD_MEMBERS intent enabled
      if (!message.member) {
        return message.channel.send({ content: `<:emoji_1725906884992:1306038885293494293> | Couldn't retrieve your member data.` });
      }

      // Get the author's highest role and the bot's highest role
      const authorHighestRole = message.member.roles.highest;
      const botHighestRole = message.guild.members.me.roles.highest;

      // Check if the author has a higher role than the bot or if the author is an admin
      if (message.member.permissions.has(PermissionFlagsBits.Administrator) || authorHighestRole.position > botHighestRole.position) {
        const bans = await message.guild.bans.fetch();

        if (bans.size === 0) {
          return message.channel.send({ content: `<:emoji_1725906884992:1306038885293494293> | There are no banned users in this server.` });
        }

        const unbannedUsers = [];

        for (const ban of bans.values()) {
          await message.guild.members.unban(ban.user.id);
          unbannedUsers.push(ban.user.tag);
        }

        // Ensure we send a non-empty message
        if (unbannedUsers.length > 0) {
          await message.channel.send({ content: `<a:Tick:1306038825054896209> | Successfully *Unbanned* ${unbannedUsers.length} users from the server.` });
        } else {
          await message.channel.send({ content: "No users were unbanned." });
        }
      } else {
        return message.channel.send({ content: `<:emoji_1725906884992:1306038885293494293>  | You must have a higher role than me to use this command.` });
      }
    } catch (e) {
      console.error(e); // Log error for debugging

      // Ensure we don't send an empty message
      const errorEmbed = new EmbedBuilder()
        .setDescription("An error occurred while trying to run the command. Please try again later.")
        .setColor('ff0000');

      if (errorEmbed.data.description) {
        await message.channel.send({ embeds: [errorEmbed] });
      } else {
        await message.channel.send({ content: "An unexpected error occurred." });
      }
    }
  },
};
