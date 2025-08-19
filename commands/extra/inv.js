const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'invite',
    aliases: ['botinvite', 'addbot'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        // Replace with your bot's client ID and permission integer
        const clientId = '1303617045455310888'; // Replace with your bot's client ID
        const permissions = 'PERMISSION_INTEGER'; // Replace with the required permissions integer

        // Create the invite link
        const inviteLink = `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot&permissions=${permissions}`;

        // Create the embed to send to the user
        const embed = new EmbedBuilder()
            .setColor(client.color || 'BLUE')
            .setTitle('Invite Me to Your Server!')
            .setDescription(`Click the link below to invite me to your server!`)
            .addField('https://discord.com/oauth2/authorize?client_id=1303617045455310888&permissions=8&integration_type=0&scope=bot', `[Click Here to Invite Me!](${inviteLink})`)
            .setFooter({
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        // Send the embed to the channel
        await message.channel.send({ embeds: [embed] });
    },
};
