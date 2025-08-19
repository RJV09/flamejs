const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "kiss",
    aliases: ["kiss"],
    description: "kiss someone.",
    category: "fun",
    cooldown: 5,
    premium: false,
    options: [
        {
            name: "user",
            description: "The user you want to kiss.",
            type: 6, // USER type
            required: true,
        }
    ],
    run: async (client, message, args) => {
        let user = args[0] ? await message.client.users.fetch(args[0].replace(/[<@!>]/g, '')) : null;
        if (!user) return message.reply("Please provide a valid user.");
        if (user.id === message.author.id) return message.reply("You cannot kiss yourself.");

        try {
            const fetch = (await import('node-fetch')).default;

            let response = await fetch('https://nekos.life/api/v2/img/kiss');
            let body = await response.json();

            if (!body || !body.url) return message.reply("Failed to fetch kiss image.");

            let embed = new EmbedBuilder()
                .setDescription(`**${message.author.username} kissed ${user.username}**`)
                .setImage(body.url)
                .setColor(client.color);

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching slap image:', error);
            message.reply('Failed to fetch kiss image. Please try again later.');
        }
    }
};