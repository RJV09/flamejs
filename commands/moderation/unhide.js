const {
    Message,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SelectMenuBuilder
} = require('discord.js')

module.exports = {
    name: 'unhide',
    category: 'mod',
    premium: false,

    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                    `You must have \`Manage Channels\` permission to use this command.`
                )
            return message.channel.send({ embeds: [error] })
        }
        const channel =
            message.mentions.channels.first() ||
            message.guild.channels.cache.get(args[0]) ||
            message.channel
        if (channel.manageable) {
            channel.permissionOverwrites.edit(message.guild.id, {
                VIEW_CHANNEL: true,
                reason: `${message.author.tag} (${message.author.id})`
            })
            const emb = new EmbedBuilder()
                .setDescription(
                    `<a:Tick:1306038825054896209> | ${channel} is now visible to @everyone role`
                )
                .setColor(client.color)
            return message.channel.send({ embeds: [emb] })
        } else {
            const embi = new EmbedBuilder()
                .setDescription(
                    `<:emoji_1725906884992:1306038885293494293>  | I don't have adequate permissions to unhide this channel.`
                )
                .setColor(client.color)
            return message.channel.send({ embeds: [embi] })
        }
    }
}
