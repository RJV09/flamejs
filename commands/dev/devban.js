const { EmbedBuilder } = require('discord.js');
const BOT_OWNERS = ['1387826587172343990', '1387826587172343990', '1387826587172343990'];

module.exports = {
    name: 'devban',
    aliases: [],
    category: 'owner',
    run: async (client, message, args) => {
        if (!BOT_OWNERS.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription(
                            `<:anxCross:1317554876712222794> | **Only the Specified Bot Owner(s) Can Use This Command!**`
                        )
                ]
            });
        }
        const userMention = args[0];
        const reason = args.slice(1).join(' ');
        if (!userMention) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription(
                            `<:anxCross:1317554876712222794> | **Please Mention a User or Provide Their ID.**`
                        )
                ]
            });
        }
        let user = await message.guild.members.fetch(userMention).catch((error) => null);
        if (!user) {
            try {
                user = await client.users.fetch(userMention);
            } catch (error) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.cross} | Please provide a valid user ID or mention a member.`)
                    ]
                });
            }
        }
        if (user.id === message.author.id) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | You cannot ban yourself.`)
                ]
            });
        }

        if (user.id === client.user.id) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | You cannot ban the bot.`)
                ]
            });
        }
        try {
            await message.guild.members.ban(user.id, {
                reason: 'User has been globally banned due to repeated and severe violations of Discord.'
            });
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.tick} | Successfully banned <@${user.id}> from the server.`)
                ]
            });
        } catch (error) {
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | I don't have permission to ban this user.`)
                ]
            });
        }
    }
};
