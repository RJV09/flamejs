const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ban',
    aliases: ['hackban', 'fuckban', 'fuckoff'],
    category: 'mod',
    premium: false,

    /**
     * @param {Client} client 
     * @param {import('discord.js').Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            console.log('No permission to ban members'); 
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293> | You must have \`Ban Members\` permissions to use this command.`
                        )
                ]
            });
        }
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            console.log('Bot has no permission to ban members');
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293> | I must have \`Ban Members\` permissions to use this command.`
                        )
                ]
            });
        }


        let user = await getUserFromMention(message, args[0]);

        if (!user) {
            try {
                user = await client.users.fetch(args[0]);
            } catch (error) {
                console.log('Error fetching user by ID: ', error);
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
            console.log('User not found');
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`<:emoji_1725906884992:1306038885293494293> | User not found`)
                        .setColor(client.color)
                ]
            });
        }
        if (user.id === client.user.id) {
            console.log('Attempt to ban the bot itself');
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293> | If you ban me, then who will protect your server?`
                        )
                ]
            });
        }
        if (user.id === message.guild.ownerId) {
            console.log('Attempt to ban the server owner');
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293> | I can't ban the owner of this server.`
                        )
                ]
            });
        }
        try {
            const member = await message.guild.members.fetch(user.id);
            if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) {
                console.log('Bot role is lower or equal to the member\'s highest role'); 
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293> | My highest role is below or the same as **<@${user.id}>**'s highest role, so I can't ban them.`
                            )
                    ]
                });
            }
            const banMessage = new EmbedBuilder()
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                })
                .setDescription(
                    `**You Have Been Banned From** ${message.guild.name} \nExecutor : ${message.author.tag} \nReason : \`${reason}\``
                )
                .setColor(client.color)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

            await message.guild.members.ban(user.id, { reason });
            try {
                await member.send({ embeds: [banMessage] });
            } catch (err) {
                console.log('Error sending DM to banned user:', err);
            }

            const doneEmbed = new EmbedBuilder()
                .setDescription(
                    `<a:Tick:1306038825054896209> | Successfully banned **<@${user.id}>** from the server.`
                )
                .setColor(client.color);

            return message.channel.send({ embeds: [doneEmbed] });

        } catch (error) {
            console.log('Error while banning: ', error); 
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`<:emoji_1725906884992:1306038885293494293> | An error occurred while banning the user.`)
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
