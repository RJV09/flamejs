const { PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    name: "hide",
    description: "Hides a channel from @everyone",
    category: 'mod',
    premium: false,
    userPermissions: [PermissionsBitField.Flags.ManageChannels],
    botPermissions: [
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.ManageRoles,
        PermissionsBitField.Flags.ManageChannels
    ],
    run: async function (client, message, args) {
        const botMember = message.guild.members.me;
        const userMember = message.member;
        
        const userHasHigherRole = userMember.roles.highest.position > botMember.roles.highest.position;
        const userIsAdmin = userMember.permissions.has(PermissionsBitField.Flags.Administrator);

        if (!userHasHigherRole && !userIsAdmin) {
            return message.reply({
                content: "<:emoji_1725906884992:1306038885293494293> You need either:\n- A higher role than me\n- Administrator permissions\n\nto use this command."
            });
        }

        const channel = getChannel(message, args);

        if (!channel || channel.type === ChannelType.GuildCategory) {
            return message.reply({
                content: "<:emoji_1725906884992:1306038885293494293> Please specify a valid text or voice channel."
            });
        }

        if (!channel.manageable) {
            return message.reply({
                content: "<:emoji_1725906884992:1306038885293494293> I don't have permission to manage this channel."
            });
        }
        try {
            await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                ViewChannel: false,
                reason: `Hidden by ${message.author.tag} (${message.author.id})`
            });

            return message.reply({
                content: `<a:Tick:1306038825054896209> ${channel} has been hidden from @everyone`
            });
        } catch (error) {
            console.error('Hide Command Error:', error);
            return message.reply({
                content: `<:emoji_1725906884992:1306038885293494293> Failed to hide channel: ${error.message}`
            });
        }
    },
};

function getChannel(message, args) {
    return (
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]) ||
        message.channel
    );
}