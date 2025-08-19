const { Client, Message, EmbedBuilder, PermissionsBitField } = require('discord.js');
const Warning = require('../../models/warning'); // Import the Warning model

module.exports = {
    name: 'warnlist',
    aliases: ['warnings', 'listwarn'],
    category: 'mod',
    premium: false,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        // Ensure the message is from a guild and not a DM
        if (!message.guild) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | This command cannot be used in DMs.`)
                ]
            });
        }

        // Ensure message.member and message.guild.me are defined
        if (!message.member || !message.guild.members.me) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | Something went wrong with the member or bot information.`)
                ]
            });
        }

        // Check if the user has the required permission ('PermissionsBitField.Flags.ManageMessages')
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | You must have \`Manage Messages\` permissions to use this command.`)
                ]
            });
        }

        // Check if the bot has the 'PermissionsBitField.Flags.ManageMessages' permission
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | I must have \`Manage Messages\` permissions to use this command.`)
                ]
            });
        }

        // Get the user from mention or ID
        let user = await getUserFromMention(message, args[0]);
        if (!user) {
            try {
                user = await client.users.fetch(args[0]);
            } catch (error) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`<:emoji_1725906884992:1306038885293494293>  | Please provide a valid user ID or mention a member.`)
                    ]
                });
            }
        }

        // Fetch warning data from MongoDB
        try {
            const warningDoc = await Warning.findOne({ userId: user.id });

            if (!warningDoc || warningDoc.warnings.length === 0) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`<:emoji_1725906884992:1306038885293494293> | **${user.tag}** has no warnings.`)
                    ]
                });
            }

            // Build the warning list embed
            const warnListEmbed = new EmbedBuilder()
                .setTitle(`Warnings for ${user.tag}`)
                .setColor(client.color)
                .setDescription(warningDoc.warnings.map((warn, index) => {
                    return `**#${index + 1}**\nReason: \`${warn.reason}\`\nIssued by: ${warn.warnedBy}\nDate: ${warn.date.toLocaleString()}\n`;
                }).join('\n'))
                .setThumbnail(user.displayAvatarURL({ dynamic: true }));

            // Send the warning list to the channel
            await message.channel.send({ embeds: [warnListEmbed] });
        } catch (err) {
            console.error('Error fetching warnings from MongoDB:', err);
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293> | Something went wrong while fetching the warning list.`)
                ]
            });
        }
    }
};

// Helper function to get a user from a mention or ID
function getUserFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;

    const id = matches[1];
    return message.client.users.fetch(id);
}
