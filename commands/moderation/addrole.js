const { Message, Client, EmbedBuilder, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const moment = require('moment');
require('moment-duration-format');

let roleAssignmentInterval;
let startTime;

module.exports = {
    name: 'role',
    aliases: ['r'],
    category: 'mod',
    premium: false,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const embed = new EmbedBuilder().setColor(client.color);
        const own = message.author.id === message.guild.ownerId;

        if (!message.guild.me) {
            try {
                await message.guild.members.fetch(client.user.id);
            } catch (err) {
                return message.channel.send({
                    embeds: [
                        embed.setColor(client.color).setDescription("Bot is not properly initialized in this server.")
                    ]
                });
            }
        }

        const botMember = message.guild.members.cache.get(client.user.id);
        if (!botMember || !botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I don't have \`Manage Roles\` permissions to execute this command.`
                        )
                ]
            });
        }

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Manage Roles\` permissions to use this command.`
                        )
                ]
            });
        }
        if (!own && message.member.roles.highest.position <= botMember.roles.highest.position) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have a higher role than me to use this command.`
                        )
                ]
            });
        }
        let role = await findMatchingRoles(
            message.guild,
            args.slice(1).join(' ')
        );

        if (!role || !role.length) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You didn't provide a valid role.\n\`${message.guild.prefix}role <user> <role>\``
                        )
                ]
            });
        }

        role = role[0];

        if (role.managed) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | This role is managed by an integration.`
                        )
                ]
            });
        }

        if (role.position >= botMember.roles.highest.position) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I can't provide this role as my highest role is either below or equal to the provided role.`
                        )
                ]
            });
        }
        let member =
            message.guild.members.cache.get(args[0]) ||
            message.mentions.members.first();

        if (!member) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You didn't use the command correctly.\n\`${message.guild.prefix}role <user> <role>\``
                        )
                ]
            });
        }

        let hasRole = member.roles.cache.has(role.id);
        if (hasRole) {
            member.roles.remove(
                role.id,
                `${message.author.tag}(${message.author.id})`
            );
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | Successfully removed <@&${role.id}> from <@${member.id}>.`
                        )
                ]
            });
        } else {
            member.roles.add(
                role.id,
                `${message.author.tag}(${message.author.id})`
            );
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | Successfully added <@&${role.id}> to <@${member.id}>.`
                        )
                ]
            });
        }
    }
};

function findMatchingRoles(guild, query) {
    const ROLE_MENTION = /<?@?&?(\d{17,20})>?/;
    if (!guild || !query || typeof query !== 'string') return [];

    const patternMatch = query.match(ROLE_MENTION);
    if (patternMatch) {
        const id = patternMatch[1];
        const role = guild.roles.cache.find((r) => r.id === id);
        if (role) return [role];
    }

    const exact = [];
    const startsWith = [];
    const includes = [];
    guild.roles.cache.forEach((role) => {
        const lowerName = role.name.toLowerCase();
        if (role.name === query) exact.push(role);
        if (lowerName.startsWith(query.toLowerCase())) startsWith.push(role);
        if (lowerName.includes(query.toLowerCase())) includes.push(role);
    });
    if (exact.length > 0) return exact;
    if (startsWith.length > 0) return startsWith;
    if (includes.length > 0) return includes;
    return [];
}
