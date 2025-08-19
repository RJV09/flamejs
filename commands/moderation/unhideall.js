const { ChannelType } = require("discord.js");
const cooldowns = new Map();
const HIDEALL_COOLDOWN = 60000;

module.exports = {
  name: "unhideall",
  UserPerms: ["ManageChannels"],
  BotPerms: ["EmbedLinks", "ManageRoles"],
  voteOnly: true,
  category: 'mod',
  run: async function (client, message, args) {
    // Check if the message is from a guild (server)
    if (!message.guild) {
      return message.channel.send("❌ | This command can only be used in a server.");
    }

    // Ensure the bot's member is fetched (for v14 compatibility)
    const botMember = await message.guild.members.fetch(client.user.id);
    const userMember = message.guild.members.cache.get(message.author.id);

    // Check if the user has a higher role than the bot or is an administrator
    if (
      !userMember ||
      userMember.roles.highest.position <= botMember.roles.highest.position
    ) {
      // Check if the user is an administrator, if so, bypass the role check
      if (!message.member.permissions.has("ADMINISTRATOR")) {
        return message.channel.send(
          `❌ | You need a higher role than the bot or be an administrator to use this command.`
        );
      }
    }

    let msg = await message.channel.send({
      content: `🔄 | Your request is currently being processed. Please kindly await.`,
    });

    const cooldownKey = `${message.author.id}_${this.name}`;
    const currentTime = Date.now();

    if (cooldowns.has(cooldownKey)) {
      const expirationTime = cooldowns.get(cooldownKey) + HIDEALL_COOLDOWN;
      if (currentTime < expirationTime) {
        const timeLeft = (expirationTime - currentTime) / 1000;
        return message.channel.send(
          `❌ | Please wait ${timeLeft.toFixed(1)} seconds before using the command again.`
        );
      }
    }

    cooldowns.set(cooldownKey, currentTime);
    setTimeout(() => cooldowns.delete(cooldownKey), HIDEALL_COOLDOWN);

    const channels = message.guild.channels.cache;
    const unhiddenChannels = [];

    for (const [, channel] of channels) {
      if (channel.manageable) {
        await channel.permissionOverwrites.edit(message.guild.id, {
          ViewChannel: true,
          reason: `${message.author.tag} (${message.author.id})`,
        });
        unhiddenChannels.push(channel.name);
      }
    }

    setTimeout(() => {
      msg.edit(
        `✅ | Successfully unhidden all channels (${unhiddenChannels.length}).`
      );
    }, 5000);
  },
};
