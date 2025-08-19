const { PermissionsBitField, ChannelType } = require("discord.js");
const cooldowns = new Map();
const HIDEALL_COOLDOWN = 60000;

module.exports = {
  name: "hideall",
  description: "Hides all channels from everyone (Server Owner Only)",
  category: 'mod',
  botPermissions: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.EmbedLinks],
  voteOnly: true,
  run: async function (client, message, args) {
    if (!message.guild) {
      return message.reply({ content: "❌ | This command can only be used in a server." });
    }
    if (message.author.id !== message.guild.ownerId) {
      return message.reply({ 
        content: "❌ | This command can only be used by the server owner." 
      });
    }
    const botMember = await message.guild.members.fetch(client.user.id);
    if (!botMember.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply({ 
        content: "❌ | I need the **Manage Channels** permission to execute this command." 
      });
    }
    const cooldownKey = `${message.guild.id}_${this.name}`;
    const currentTime = Date.now();

    if (cooldowns.has(cooldownKey)) {
      const expirationTime = cooldowns.get(cooldownKey) + HIDEALL_COOLDOWN;
      if (currentTime < expirationTime) {
        const timeLeft = (expirationTime - currentTime) / 1000;
        return message.reply({ 
          content: `⏳ | Please wait ${timeLeft.toFixed(1)} seconds before using this command again.` 
        });
      }
    }
    const processingMsg = await message.reply({ 
      content: "🔄 | Processing request to hide all channels..." 
    });

    cooldowns.set(cooldownKey, currentTime);
    setTimeout(() => cooldowns.delete(cooldownKey), HIDEALL_COOLDOWN);
    try {
      const channels = message.guild.channels.cache;
      let hiddenCount = 0;

      for (const channel of channels.values()) {
        if (channel.manageable && channel.type !== ChannelType.GuildCategory) {
          await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
            ViewChannel: false,
            reason: `Hideall command executed by ${message.author.tag}`
          });
          hiddenCount++;
        }
      }
      await processingMsg.edit({
        content: `✅ | Successfully hid ${hiddenCount} channels.`
      });

    } catch (error) {
      console.error("HideAll Error:", error);
      await processingMsg.edit({
        content: `❌ | Failed to hide channels: ${error.message}`
      });
    }
  },
};