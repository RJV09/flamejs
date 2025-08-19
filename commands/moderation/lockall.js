const { ChannelType } = require("discord.js");

const cooldowns = new Map();
const LOCKALL_COOLDOWN = 60000;

module.exports = {
  name: "lockall",
  UserPerms: ["ManageChannels"],
  BotPerms: ["EmbedLinks", "ManageRoles"],
  voteOnly: true,
  category: 'mod',
  run: async function (client, message, args) {
    if (message.author.id !== message.guild.ownerId) {
      return message.channel.send("❌ | This command can only be used by the server owner.");
    }

    let msg = await message.channel.send({
      content: `<a:emoji_1725906208338:1306038739369197723> | Your request is currently being processed. Please kindly await.`,
    });

    const cooldownKey = `${message.author.id}_${this.name}`;
    const currentTime = Date.now();

    if (cooldowns.has(cooldownKey)) {
      const expirationTime = cooldowns.get(cooldownKey) + LOCKALL_COOLDOWN;
      if (currentTime < expirationTime) {
        const timeLeft = (expirationTime - currentTime) / 1000;
        return message.channel.send(
          `❌ | Please wait ${timeLeft.toFixed(
            1
          )} seconds before using the command again.`
        );
      }
    }

    cooldowns.set(cooldownKey, currentTime);
    setTimeout(() => cooldowns.delete(cooldownKey), LOCKALL_COOLDOWN);

    const channels = message.guild.channels.cache;

    const lockedChannels = [];

    for (const [, channel] of channels) {
      if (channel.manageable) {
        await channel.permissionOverwrites.edit(message.guild.id, {
          SendMessages: false,
          Connect: false,
          reason: `${message.author.tag} (${message.author.id})`,
        });

        lockedChannels.push(channel.name);
      }
    }
    setTimeout(() => {
      msg.edit(
        `✅ | Successfully locked all channels (${lockedChannels.length}).`
      );
    }, 5000);
  },
};