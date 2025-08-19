const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'kick',
    aliases: ['expel', 'boot'],
    category: 'mod',
    premium: false,

    /**
     * @param {Client} client 
     * @param {import('discord.js').Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            console.log('No permission to kick members');
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293> | You must have \`Kick Members\` permissions to use this command.`
                        )
                ]
            });
        }
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293> | I must have \`Kick Members\` permissions to use this command.`
                        )
                ]
            });
        }
        let user = await getUserFromMention(message, args[0]);

        if (!user) {
            try {
                user = await client.users.fetch(args[0]);
                if (!user) {
                    throw new Error("User not found");
                }
            } catch (error) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293> | Please provide a valid user ID or mention a member.`
                            )
                    ]
                });
            }
        }

        let reason = args.slice(1).join(' ') || 'No reason provided';
        reason = `${message.author.tag} (${message.author.id}) | ` + reason;
        if (!user) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`<:emoji_1725906884992:1306038885293494293> | User not found`)
                        .setColor(client.color)
                ]
            });
        }
        if (user.id === client.user.id) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293> | If you kick me, then who will protect your server?`
                        )
                ]
            });
        }
        if (user.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293> | I can't kick the owner of this server.`
                        )
                ]
            });
        }
        try {
            const member = await message.guild.members.fetch(user.id);
            if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293> | My highest role is below or the same as **<@${user.id}>**'s highest role, so I can't kick them.`
                            )
                    ]
                });
            }
            const kickMessage = new EmbedBuilder()
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                })
                .setDescription(
                    `**You Have Been Kicked From** ${message.guild.name} \nExecutor : ${message.author.tag} \nReason : \`${reason}\``
                )
                .setColor(client.color)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

            await message.guild.members.kick(user.id, { reason });
            try {
                await member.send({ embeds: [kickMessage] });
            } catch (err) {
                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293> | Couldn't send a DM to the kicked user. They may have DMs disabled.`
                            )
                    ]
                });
            }

            const doneEmbed = new EmbedBuilder()
                .setDescription(
                    `<a:Tick:1306038825054896209> | Successfully kicked **<@${user.id}>** from the server.`
                )
                .setColor(client.color);

            return message.channel.send({ embeds: [doneEmbed] });

        } catch (error) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`<:emoji_1725906884992:1306038885293494293> | An error occurred while kicking the user.`)
                        .setColor(client.color)
                ]
            });
        }
    }
};
function getUserFromMention(message, mention) {
    if (!mention) return null;
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;

    const id = matches[1];
    return message.client.users.fetch(id);
}
