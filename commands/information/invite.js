const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

// Command
module.exports = {
    name: 'invite',
    aliases: ['i'],
    category: 'info',
    premium: true,

    run: async (client, message, args) => {
        // Create the invite button
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Invite Me')
                .setStyle(5) // LINK style for buttons (value 5 is LINK style)
                .setURL(
                    `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`
                )
        );

        // Sending the message with embed and button
        await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color || '#ff0000')  // Default color is red if client.color is undefined
                    .setDescription(
                        `[Click here to invite me](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`
                    )
            ],
            components: [button]
        });
    }
};
