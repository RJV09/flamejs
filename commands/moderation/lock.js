const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'lock',
    category: 'mod',
    premium: false,

    run: async (client, message, args) => {
        const isAdmin = message.member.permissions.has(PermissionFlagsBits.Administrator);
        if (!isAdmin) {
            const botMember = await message.guild.members.fetch(client.user.id);
            const botHighestRole = botMember.roles.highest.position;
            const userHighestRole = message.member.roles.highest.position;
            if (userHighestRole <= botHighestRole) {
                const error = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(
                        `❌ You must have a higher role than me or have Administrator permission to use this command.`
                    );
                return message.channel.send({ embeds: [error] });
            }
        }
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            const error = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription(
                    `❌ You must have \`Manage Channels\` permission to use this command.`
                );
            return message.channel.send({ embeds: [error] });
        }
        const channel =
            message.mentions.channels.first() ||
            message.guild.channels.cache.get(args[0]) ||
            message.channel;
        if (channel.manageable) {
            try {
                await channel.permissionOverwrites.edit(message.guild.id, {
                    [PermissionFlagsBits.SendMessages]: false,
                    reason: `${message.author.tag} (${message.author.id})`,
                });

                const emb = new EmbedBuilder()
                    .setDescription(`<a:Tick:1306038825054896209> ${channel} has been locked for @everyone role`)
                    .setColor('#00FF00');
                return message.channel.send({ embeds: [emb] });
            } catch (err) {
                console.error(err);
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(`❌ There was an error locking the channel. Please check my permissions.`);
                return message.channel.send({ embeds: [errorEmbed] });
            }
        } else {
            const embi = new EmbedBuilder()
                .setDescription(`❌ I don't have adequate permissions to lock this channel.`)
                .setColor('#FF0000');
            return message.channel.send({ embeds: [embi] });
        }
    },
};