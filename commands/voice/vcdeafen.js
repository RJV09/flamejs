const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'vcdeafen',
    aliases: ['vcdeaf'],
    category: 'voice',
    run: async (client, message, args) => {
        const memberPermissions = message.member.permissions.has(PermissionFlagsBits.DeafenMembers);
        const isAdmin = message.member.permissions.has(PermissionFlagsBits.Administrator);
        const isOwner = message.author.id === message.guild.ownerId;
        if (!memberPermissions && !isAdmin && !isOwner) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                    `You must have \`Deafen members\` permission or be the server owner/administrator to use this command.`
                );
            return message.channel.send({ embeds: [error] });
        }
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.DeafenMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription('I must have `Deafen members` permission to use this command.');
            return message.channel.send({ embeds: [error] });
        }

        if (!message.member.voice.channel) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('You must be connected to a voice channel first.')
                ]
            });
        }
        let member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('You must mention someone to deafen in your VC.')
                ]
            });
        }

        if (!member.voice.channel) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<@${member.user.id}> is not in a voice channel.`)
                ]
            });
        }
        try {
            await member.voice.setDeaf(true, `${message.author.tag} (${message.author.id})`);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<a:Tick:1306038825054896209>  | Successfully deafened <@${member.user.id}> in the voice channel.`)
                ]
            });
        } catch (err) {
            console.error(err);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`I was unable to deafen <@${member.user.id}>.`)
                ]
            });
        }
    }
};
