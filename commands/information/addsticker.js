
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "stealsticker",
  cooldown: 5,
  category: 'info',
  UserPerms: ['MANAGE_EMOJIS'],
  BotPerms: ['EMBED_LINKS', 'MANAGE_EMOJIS'],
  run: async (client, message, args) => {
    if (!args[0]) {
      return message.reply({ content: `Please provide the sticker to steal!` });
    }

    try {
      // Match the sticker URL
      const stickerUrlRegex = /https:\/\/cdn.discordapp.com\/stickers\/(\d+)\.(png|jpg|jpeg|gif|webp)/;
      const match = args[0].match(stickerUrlRegex);

      if (match) {
        const stickerId = match[1];
        const stickerUrl = args[0];
        const stickerExtension = match[2];
        const stickerName = args[1] || `sticker_${stickerId}`;

        // Fetch the sticker file and convert the response to a buffer
        const response = await fetch(stickerUrl);
        const buffer = await response.arrayBuffer(); // Use arrayBuffer instead of buffer
        const stickerBuffer = Buffer.from(buffer); // Convert ArrayBuffer to Buffer

        // Create the sticker in the server
        await message.guild.stickers.create({ file: stickerBuffer, name: stickerName });

        let embed = new EmbedBuilder()
          .setColor("#ffffff")
          .setTitle('Added Sticker')
          .setImage(stickerUrl);
        message.reply({ embeds: [embed] });
      } else {
        message.reply({ content: `You must provide a valid sticker URL!` });
      }
    } catch (e) {
      console.error(e);
      message.reply(`Failed to create the sticker. Maybe slots are full or size exceeds Discord's limit.`);
    }
  }
};
