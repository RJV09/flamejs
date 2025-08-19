const { EmbedBuilder } = require("discord.js");

const cooldowns = new Map();
const UNLOCKALL_COOLDOWN = 60000;

// Define the emojis you want to use
const loadingEmoji = '🔄';
const crossEmoji = '❌';
const tickEmoji = '✅';

module.exports = {
  name: "unlockall",
  UserPerms: ['ManageChannels'],
  BotPerms: ['EmbedLinks', 'ManageChannels'],
  category: 'mod',
  voteOnly: true,
  run: async function (client, message, args) {

    let msg = await message.channel.send({ content: `${loadingEmoji} | Your request is currently being processed. Please kindly await.` });

    const cooldownKey = `${message.author.id}_${this.name}`;
    const currentTime = Date.now();

    if (cooldowns.has(cooldownKey)) {
      const expirationTime = cooldowns.get(cooldownKey) + UNLOCKALL_COOLDOWN;
      if (currentTime < expirationTime) {
        const timeLeft = (expirationTime - currentTime) / 1000;
        return message.channel.send({ content: `${crossEmoji} | Please wait ${timeLeft.toFixed(1)} seconds before using the command again.` });
      }
    }

    cooldowns.set(cooldownKey, currentTime);
    setTimeout(() => cooldowns.delete(cooldownKey), UNLOCKALL_COOLDOWN);

    const channels = message.guild.channels.cache;

    const unlockedChannels = [];

    for (const [, channel] of channels) {
      if (channel.manageable) {
        await channel.permissionOverwrites.edit(message.guild.id, {
          SendMessages: null,
          Connect: null,
          reason: `${message.author.tag} (${message.author.id})`,
        });

        unlockedChannels.push(channel.name);
      }
    }

    setTimeout(() => {
      msg.edit({ content: `${tickEmoji} | Successfully unlocked all channels (${unlockedChannels.length}).` });
    }, 5000);
  },
};
