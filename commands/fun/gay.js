const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'gay',
    aliases: ['howgay', 'gaypercentage'],
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
                            "Please mention a user to calculate their gay percentage.\nUsage: `gay @User`"
                        )
                ]
            });
        }

        // Generate a random gay percentage
        const gayPercentage = Math.floor(Math.random() * 101); // 0 to 100

        // Generate a reply based on the percentage
        let description;
        let gifUrl;

        if (gayPercentage >= 80) {
            description = `🌈 Wow, ${user} is **very gay**! Gay percentage: **${gayPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/3o6Zt8iXkxLf2eDZY8/giphy.gif"; // Fun gay GIF
        } else if (gayPercentage >= 50) {
            description = `🌈 ${user} is pretty gay! Gay percentage: **${gayPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/3oEjI4sFlpZr9y1lmY/giphy.gif"; // Fun moderate gay GIF
        } else if (gayPercentage >= 20) {
            description = `🌈 Hmm, ${user} might be exploring! Gay percentage: **${gayPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/1BdD1hbVNKC22/giphy.gif"; // Fun gif for exploration
        } else {
            description = `🌈 ${user} is **not that gay** but hey, it's all good! Gay percentage: **${gayPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/1oF1pV1GeBczdbjAGw/giphy.gif"; // Fun low gay GIF
        }

        // Create the embed for the response
        const embed = new EmbedBuilder()
            .setTitle("🌈 Gay Percentage")
            .setDescription(description)
            .setColor(gayPercentage >= 50 ? 'FF0000' : 'FF0000')
            .setImage(gifUrl) // Add the GIF here
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        // Send the response
        message.channel.send({ embeds: [embed] });
    }
};