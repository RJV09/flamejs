const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'userinfo',
    aliases: ['ui', 'whois'],
    category: 'info',
    description: 'Get information about a user',
    run: async (client, message, args) => {
        const permissions = {
            [PermissionsBitField.Flags.Administrator]: 'Administrator',
            [PermissionsBitField.Flags.ManageGuild]: 'Manage Server',
            [PermissionsBitField.Flags.ManageRoles]: 'Manage Roles',
            [PermissionsBitField.Flags.ManageChannels]: 'Manage Channels',
            [PermissionsBitField.Flags.KickMembers]: 'Kick Members',
            [PermissionsBitField.Flags.BanMembers]: 'Ban Members',
            [PermissionsBitField.Flags.ManageNicknames]: 'Manage Nicknames',
            [PermissionsBitField.Flags.ManageEmojisAndStickers]: 'Manage Emojis',
            [PermissionsBitField.Flags.ManageWebhooks]: 'Manage Webhooks',
            [PermissionsBitField.Flags.ManageMessages]: 'Manage Messages',
            [PermissionsBitField.Flags.MentionEveryone]: 'Mention Everyone',
        };

        let mention = await getUserFromMention(message, args[0]);

        if (!mention) {
            try {
                mention = await client.users.fetch(args[0]);
            } catch (error) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.cross} | Please provide a valid user ID or mention a member.`),
                    ],
                });
            }
        }

        const member = message.guild.members.cache.get(mention.id);
        const nick = member?.nickname || 'None';
        const usericon = mention.displayAvatarURL({ dynamic: true });

        const mentionPermissions = member?.permissions?.toArray() || [];
        const finalPermissions = mentionPermissions.map((permission) => permissions[permission]).filter(Boolean);

        const flags = {
            DiscordEmployee: '<:emoji_1725940261022:1306040254909644800>',
            DiscordPartner: '<:emoji_1725940659651:1306050588152168498>',
            BugHunterLevel1: '<:bitzxier_badges:1309594344608632922>',
            BugHunterLevel2: '<:bitzxier_badges:1309594344608632922>',
            HypeSquadEvents: '<:bitzxier_badges:1309594344608632922>',
            HouseBrilliance: '<:bitzxier_badges:1309594344608632922>',
            HouseBravery: '<:ares_bitcoin:1309590911113756787>',
            HouseBalance: '<:ares_bitcoin:1309590911113756787>',
            EarlySupporter: '<:bitzxier_developer:1309591258343145492>',
            TeamUser: '<:bitzxier_developer:1309591258343145492>',
            VerifiedBot: '<:bitzxier_developer:1309591258343145492>',
            EarlyVerifiedBotDeveloper: '<:bitzxier_developer:1309591258343145492>',
        };

        const userFlags = mention.flags?.toArray() || [];
        const topRole = member?.roles?.highest;

        const isMemberInServer = message.guild.members.cache.has(mention.id);

        const userlol = new EmbedBuilder()
            .setAuthor({ name: `${mention.username}'s Information`, iconURL: usericon })
            .setThumbnail(usericon)
            .addFields(
                {
                    name: 'General Information',
                    value: `Name: \`${mention.username}#${mention.discriminator}\`\nNickname: \`${nick}\`\n\n`,
                },
                {
                    name: 'Overview',
                    value: `Badges: ${userFlags.length ? userFlags.map((flag) => flags[flag]).join(' ') : 'None'}\nType: ${mention.bot ? 'Bot' : 'Human'}\n\n`,
                },
            );

        if (isMemberInServer) {
            userlol.addFields({
                name: 'Server Related Information',
                value: `Top Role: ${topRole}\nRoles: ${member.roles.cache.size > 1 ? member.roles.cache.filter((r) => r.name !== '@everyone').map((role) => role).join(', ') : 'None'}\nKey Permissions: ${finalPermissions.length ? finalPermissions.map((permission) => `\`${permission}\``).join(', ') : 'None'}\n\n`,
            });
        } else {
            userlol.addFields({
                name: 'Misc Information',
                value: `Created On: ${moment(mention.createdTimestamp).format('llll')}\nThis user is not in this server.\n\n`,
            });
        }

        userlol
            .setColor(client.color)
            .setFooter({ text: `Requested By: ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        message.channel.send({ embeds: [userlol] });
    },
};

function getUserFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;

    const id = matches[1];
    return message.client.users.fetch(id);
}