const { Client, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'banner',
    category: 'info',
    premium: true,

    run: async (client, message, args) => {
        // Fetch the user who is mentioned or the one provided as ID, else default to the message sender
        let user = message.mentions.users.first() || await client.users.fetch(args[0]) || message.author;

        try {
            // Fetch user data from Discord API using their user ID
            const { data } = await axios.get(`https://discord.com/api/v10/users/${user.id}`, {
                headers: {
                    Authorization: `Bot ${client.token}`,
                }
            });

            if (data.banner) {
                let url = data.banner.startsWith('a_')
                    ? `.gif?size=4096`
                    : `.png?size=4096`;
                url = `https://cdn.discordapp.com/banners/${user.id}/${data.banner}${url}`;

                // Send the embed with the banner image
                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color || '#0099FF') // Default to blue if no client color
                            .setDescription(`Banner of ${user.tag}`)
                            .setFooter({ text: `Requested By: ${message.author.tag}` })
                            .setImage(url)
                    ]
                });
            } else {
                // Send message if no banner is found
                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color || '#0099FF') // Default to blue
                            .setDescription(`This user doesn't have a banner.`)
                    ]
                });
            }
        } catch (err) {
            console.error(err);
            message.channel.send('There was an error fetching the banner data.');
        }
    }
};
