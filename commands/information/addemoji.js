const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const axios = require('axios'); // For fetching emoji data
const { AttachmentBuilder } = require('discord.js'); // For handling emoji uploads

module.exports = {
    name: 'addemoji',
    aliases: ['addemote', 'steal'],
    cooldown: 5,
    category: 'info',
    run: async (client, message, args) => {
        // Check user permissions
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | You must have \`Manage Emoji\` perms to use this command.`)
                ]
            });
        }

        // Check bot permissions
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | I must have \`Manage Emoji\` perms to use this command.`)
                ]
            });
        }

        const emoji = args[0];
        if (!emoji) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | You didn't provide any emoji to add.`)
                ]
            });
        }

        // Regex to match custom emojis (animated and non-animated, including WebP)
        const emojiRegex = /<a?:(\w+):(\d+)>/;
        const urlRegex = /https:\/\/cdn.discordapp.com\/emojis\/(\d+)\.(png|jpg|jpeg|gif|webp)/;

        let match = emoji.match(emojiRegex);
        let emojiId;
        let emojiName = 'FlaMe_OP'; // Default name is "flameop"
        let emojiUrl;

        if (match) {
            emojiId = match[2];
            emojiName = match[1]; // If a custom name is provided, use it
            const isAnimated = emoji.startsWith('<a:');
            // Determine the emoji extension (gif, png, or webp)
            let emojiExtension = isAnimated ? 'gif' : 'png';
            emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.${emojiExtension}`;
        } else {
            match = emoji.match(urlRegex);
            if (match) {
                emojiId = match[1];
                emojiUrl = emoji;  // The URL itself is the emoji URL
                emojiName = args[1] || 'flameop';  // If no custom name is provided, default to "flameop"
            } else {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.cross} | You provided an invalid emoji.`)
                    ]
                });
            }
        }

        // Fetch the emoji image to check its size
        try {
            const response = await axios.get(emojiUrl, { responseType: 'arraybuffer' });
            const emojiSize = Buffer.byteLength(response.data);

            // Check if the emoji size exceeds Discord's limits
            const maxSize = message.guild.premiumTier >= 2 ? 1024 * 1024 : 256 * 1024; // 1 MB for boosted servers, 256 KB otherwise
            if (emojiSize > maxSize) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.cross} | The emoji is too large. Maximum size is ${maxSize / 1024} KB.`)
                    ]
                });
            }

            // Add the emoji to the server
            const createdEmoji = await message.guild.emojis.create({
                attachment: response.data,
                name: emojiName
            });

            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.tick} | Successfully added the emoji ${createdEmoji.toString()}.`)
                ]
            });
        } catch (err) {
            console.error(err);
            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | I was unable to add the emoji.\nPossible Reasons: \`Invalid Emoji URL\`, \`Emoji Size Too Large\`, \`Server Emoji Slots Full\`.`)
                ]
            });
        }
    }
};
