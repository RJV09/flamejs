const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'wlisted',
    aliases: ['wlist', 'whitelisted'],
    category: 'security',
    premium: true,
    run: async (client, message, args) => {
        // Check if the server has at least 1 member
        if (message.guild.memberCount < 1) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Your server does not meet the requirements for accommodating my 30-member criteria.`
                        )
                ]
            });
        }

        // Check if the user is the server owner or an extra owner
        const isOwner = message.author.id === message.guild.ownerId;
        const isExtraOwner = await client.util.isExtraOwner(message.author, message.guild);

        if (!isOwner && !isExtraOwner) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Only the server owner or an additional owner is authorized to run this command.`
                        )
                ]
            });
        }

        // Check if the user has a higher role than the bot
        const botMember = message.guild.members.cache.get(client.user.id);
        const userMember = message.member;

        if (!isOwner && !(botMember.roles.highest.position <= userMember.roles.highest.position)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Only the server owner or an extra owner with a higher role than mine is authorized to run this command.`
                        )
                ]
            });
        }

        // Check if the antinuke module is enabled
        const antinuke = await client.db.get(`${message.guild.id}_antinuke`);
        if (!antinuke) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Seems that the antinuke module is not enabled in this server.`
                        )
                ]
            });
        }

        // Fetch whitelist data
        let data = await client.db.get(`${message.guild.id}_wl`);

        // If no data exists, initialize it
        if (!data) {
            await client.db.set(`${message.guild.id}_wl`, { whitelisted: [] });
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Please run this command again as the database was not previously assigned.`
                        )
                ]
            });
        }

        // If whitelist data exists
        const users = data.whitelisted;
        if (users.length === 0) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | There are no whitelisted members in this server.`
                        )
                ]
            });
        }

        // Create a list of whitelisted users
        const mentions = users.map(userId => `${client.emoji.dot} <@${userId}> (${userId})`).join('\n');

        // Send the whitelist embed
        const whitelistedEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle('__**Whitelisted Users**__')
            .setDescription(mentions);

        return message.channel.send({ embeds: [whitelistedEmbed] });
    }
};