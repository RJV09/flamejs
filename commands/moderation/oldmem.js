const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'oldmember',
    aliases: ['old', 'checkold'],
    cooldown: 5,
    category: 'info',
    run: async (client, message, args) => {
        const embed = new EmbedBuilder().setColor(client.color);

        // Check if a member was mentioned
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        // Check if the member is valid
        if (!member) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | Please mention a valid member or use the command without arguments to check yourself.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        // Get the member's join date
        const joinDate = member.joinedAt;
        const currentDate = new Date();

        // Calculate the difference in time between the current date and the member's join date
        const diffTime = Math.abs(currentDate - joinDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Difference in days

        // Set the old member threshold (in this example, 6 months = 183 days)
        const threshold = 183;

        // Embed to show the result
        let oldMemberStatus = diffDays >= threshold ? 'Old Member' : 'New Member';

        return message.channel.send({
            embeds: [
                embed
                    .setTitle(`${member.user.tag} is an ${oldMemberStatus}`)
                    .setDescription(
                        `**Join Date**: ${joinDate.toDateString()}\n` +
                        `**Days Since Joined**: ${diffDays} days\n` +
                        `This user is considered an **${oldMemberStatus}**.\n\n` +
                        `Threshold for being an old member is ${threshold} days.`
                    )
                    .setTimestamp()
                    .setFooter(client.user.username, client.user.displayAvatarURL())
            ]
        });
    }
};
