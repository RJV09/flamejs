const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'getserverinvite',
    aliases: ['serverinvite', 'getinvite'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        const ownerIDs = ['1387826587172343990', '1387826587172343990']; 
        if (!ownerIDs.includes(message.author.id)) {
            return message.reply("Only FlaMe Developers, Can Use This Command.");
        }
        if (!args[0]) {
            return message.reply("Please provide the server ID.");
        }
        const guildId = args[0];
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return message.reply("I am not in the server with the provided ID.");
        }
        const channel = guild.channels.cache.find(ch => ch.isTextBased());
        if (!channel) {
            return message.reply("No text channel found in the server.");
        }
        const botMember = guild.members.cache.get(client.user.id);
        if (!botMember || !botMember.permissions.has('CreateInstantInvite')) {
            return message.reply("I do not have the required permissions to create an invite in this channel.");
        }
        try {
            const invite = await channel.createInvite({
                maxAge: 0,
                maxUses: 1, 
                unique: true,
            });
            const embed = new EmbedBuilder()
                .setTitle('Server Invite Link')
                .setDescription(`Here is the invite link for the server: [Click here to join](https://discord.gg/${invite.code})`)
                .setColor(client.color || '#FF0000') 
                .setFooter({ text: `Requested by ${message.author.tag}` });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error generating server invite:', error);
            return message.reply("An error occurred while trying to generate the invite link. Please check the console for more details.");
        }
    }
};
