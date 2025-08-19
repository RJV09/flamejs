const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const config = require(`${process.cwd()}/config.json`);

module.exports = {
    name: 'blacklist',
    aliases: ['bl'],
    category: 'owner',
    run: async (client, message, args) => {
        if (!config.admin.includes(message.author.id)) return;

        const embed = new EmbedBuilder().setColor(client.color);
        const prefix = message.guild.prefix;
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}blacklist \`<add/remove/list>\` \`<user id>\``
                        )
                ]
            });
        }
        if (args[0].toLowerCase() === 'list') {
            let listing = (await client.db.get(`blacklist_${client.user.id}`)) || [];
            let info = [];

            if (listing.length < 1) {
                info.push('No Users ;-;');
            } else {
                for (let i = 0; i < listing.length; i++) {
                    const user = await client.users.fetch(listing[i]);
                    info.push(`${i + 1}) ${user.tag} (${user.id})`);
                }
            }

            return await client.util.pagination(
                message,
                info,
                '**Blacklist Users List** :-'
            );
        }
        if (!args[1]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}blacklist \`<add/remove/list>\` \`<user id>\``
                        )
                ]
            });
        }
        let user;
        try {
            user = await client.users.fetch(args[1]);
        } catch (error) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Invalid user ID provided.\n${prefix}blacklist \`<add/remove/list>\` \`<user id>\``
                        )
                ]
            });
        }
        let added = (await client.db.get(`blacklist_${client.user.id}`)) || [];
        if (args[0].toLowerCase() === 'add' || args[0].toLowerCase() === 'a' || args[0] === '+') {
            added.push(user.id);
            added = [...new Set(added)];
            await client.db.set(`blacklist_${client.user.id}`, added);
            client.util.blacklist();

            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.tick} | **<@${user.id}> (${user.id})** has been added as a **Blacklist** user.`
                        )
                ]
            });
        }
        if (args[0].toLowerCase() === 'remove' || args[0].toLowerCase() === 'r' || args[0] === '-') {
            added = added.filter(id => id !== user.id);
            await client.db.set(`blacklist_${client.user.id}`, added);
            client.util.blacklist();

            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.tick} | **<@${user.id}> (${user.id})** has been removed from the **Blacklist**.`
                        )
                ]
            });
        }
        return message.channel.send({
            embeds: [
                embed
                    .setColor(client.color)
                    .setDescription(
                        `${prefix}blacklist \`<add/remove/list>\` \`<user id>\``
                    )
            ]
        });
    }
};