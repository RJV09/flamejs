const { Client, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'firstmsg',
    aliases: ['firstmessage'],
    category: 'info',
    run: async (client, message, args) => {
        // Fetch the first message after the latest one (with a limit of 1 message)
        const fetchMessages = await message.channel.messages.fetch({
            after: 1,
            limit: 1
        });

        const msg = fetchMessages.first();

        if (!msg) {
            return message.channel.send('No message found.');
        }

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle(`First Message in ${message.guild.name}`)
            .setURL(msg.url)
            .setDescription('Content: ' + msg.content)
            .addFields(
                { name: 'Author', value: `${msg.author.tag}`, inline: true },
                { name: 'Message ID', value: `${msg.id}`, inline: true },
                { name: 'Created At', value: `${msg.createdAt.toLocaleDateString()}`, inline: true }
            )
            .setColor(client.color || '#0099ff'); // Use the client's color or fallback to a default one

        // Send the embed
        message.channel.send({ embeds: [embed] });
    }
};
