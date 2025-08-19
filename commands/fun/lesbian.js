const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'lesbian',
    aliases: ['howlesbian', 'lesbianpercentage'],
    category: 'fun',
    run: async (client, message, args) => {
        // Ensure the user is mentioned
        const user = message.mentions.users.first();

        if (!user) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription(
                            "Please mention a user to calculate their lesbian percentage.\nUsage: `lesbian @User`"
                        )
                ]
            });
        }

        // Generate a random lesbian percentage
        const lesbianPercentage = Math.floor(Math.random() * 101); // 0 to 100

        // Generate a reply based on the percentage
        let description;
        let gifUrl;

        if (lesbianPercentage >= 80) {
            description = `🌈 Wow, ${user} is **very lesbian**! Lesbian percentage: **${lesbianPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/3o6Zt8iXkxLf2eDZY8/giphy.gif"; // Fun lesbian GIF (same as gay for now)
        } else if (lesbianPercentage >= 50) {
            description = `🌈 ${user} is pretty lesbian! Lesbian percentage: **${lesbianPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/3oEjI4sFlpZr9y1lmY/giphy.gif"; // Fun moderate lesbian GIF
        } else if (lesbianPercentage >= 20) {
            description = `🌈 Hmm, ${user} might be exploring! Lesbian percentage: **${lesbianPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/1BdD1hbVNKC22/giphy.gif"; // Fun gif for exploration
        } else {
            description = `🌈 ${user} is **not that lesbian** but hey, it's all good! Lesbian percentage: **${lesbianPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/1oF1pV1GeBczdbjAGw/giphy.gif"; // Fun low lesbian GIF
        }

        // Create the embed for the response
        const embed = new EmbedBuilder()
            .setTitle("🌈 Lesbian Percentage")
            .setDescription(description)
            .setColor(lesbianPercentage >= 50 ? 'FF0000' : 'FF0000')
            .setImage(gifUrl) // Add the GIF here
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        // Send the response
        message.channel.send({ embeds: [embed] });
    }
};