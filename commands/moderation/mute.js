const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'mute',
    aliases: ['timeout', 'stfu', 'kys'],
    category: 'mod',
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Timeout Members\` permissions to use this command.`
                        )
                ]
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I must have \`Timeout Members\` permissions to run this command.`
                        )
                ]
            });
        }

        let user = await getUserFromMention(message, args[0]);
        if (!user) {
            try {
                user = await message.guild.members.fetch(args[0]);
            } catch (error) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | You didn't mention the member whom you want to mute.\n${message.guild.prefix}mute \`<member>\` \`<time>\` \`<reason>\``
                            )
                    ]
                });
            }
        }

        let reason = args.slice(2).join(' ');
        if (!reason) reason = 'No reason given';

        let time = args[1];
        if (!time) time = '27d';  // Default to 27 days

        let dur = ms(time);
        if (!dur) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You didn't mention the time for the mute.\n${message.guild.prefix}mute \`<member>\` \`<time>\` \`<reason>\``
                        )
                ]
            });
        }

        if (user.communicationDisabledUntilTimestamp) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | <@${user.user.id}> is already muted!`
                        )
                ]
            });
        }

        if (user.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | <@${user.user.id}> has \`Administrator\` permissions!`
                        )
                ]
            });
        }

        if (user.id === client.user.id) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You can't mute me!`
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
                            `<:emoji_1725906884992:1306038885293494293>  | You can't mute the server owner!`
                        )
                ]
            });
        }

        if (user.id === message.member.id) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You can't mute yourself!`
                        )
                ]
            });
        }

        if (!user.manageable) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I don't have enough permissions to mute <@${user.user.id}>`
                        )
                ]
            });
        }

        const muteMessage = new EmbedBuilder()
    .setAuthor({
        name: message.author.tag, // This will be the author's name (username#discriminator)
        iconURL: message.author.displayAvatarURL({ dynamic: true }) // This will be the author's avatar URL
    })
    .setDescription(
        `You have been muted in ${message.guild.name}\nExecutor: ${message.author.tag}\nReason: \`${reason}\``
    )
    .setColor(client.color)
    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));


        await user.timeout(dur, `${message.author.tag} | ${reason}`).then(() => {
            user.send({ embeds: [muteMessage] }).catch(() => null);  // Send message to the user if possible
        });

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        `<a:Tick:1306038825054896209> | Successfully muted <@${user.user.id}> for ${ms(dur, { long: true })}!`
                    )
            ]
        });
    }
};

function getUserFromMention(message, mention) {
    if (!mention) return null;
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;
    const id = matches[1];
    return message.guild.members.fetch(id);
}
