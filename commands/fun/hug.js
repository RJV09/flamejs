const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "hug",
    aliases: ["hug"],
    description: "hug someone.",
    category: "fun",
    cooldown: 5,
    premium: false,
    options: [
        {
            name: "user",
            description: "The user you want to hug.",
            type: 6, // USER type
            required: true,
        }
    ],
    run: async (client, message, args) => {
        let user = args[0] ? await message.client.users.fetch(args[0].replace(/[<@!>]/g, '')) : null;
        if (!user) return message.reply("Please provide a valid user.");
        if (user.id === message.author.id) return message.reply("You cannot hug yourself.");

        try {
            const fetch = (await import('node-fetch')).default;

            let response = await fetch('https://nekos.life/api/v2/img/hug');
            let body = await response.json();

            if (!body || !body.url) return message.reply("Failed to fetch hug image.");

            let embed = new EmbedBuilder()
                .setDescription(`**${message.author.username} huged ${user.username}**`)
                .setImage(body.url)
                .setColor(client.color);

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching hug image:', error);
            message.reply('Failed to fetch hug image. Please try again later.');
        }
    }
};