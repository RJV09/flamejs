const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'vcundeafen',
    aliases: ['vcundeaf'],
    category: 'voice',
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionFlagsBits.DeafenMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color || 'BLUE')
                .setDescription('You must have `Deafen Members` permission to use this command.');
            return message.channel.send({ embeds: [error] });
        }


        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.DeafenMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color || 'BLUE')
                .setDescription('I must have `Deafen Members` permission to use this command.');
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


        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('You must mention someone whom you want to undeafen in your VC.')
                ]
            });
        }


        if (!member.voice.channel || member.voice.channel.id !== message.member.voice.channel.id) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<@${member.user.id}> is not in your VC.`)
                ]
            });
        }

        try {

            await member.voice.setDeaf(false, `${message.author.tag} (${message.author.id})`);

            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<a:Tick:1306038825054896209>  | Successfully undeafened <@${member.user.id}> from voice!`)
                ]
            });
        } catch (err) {
            console.error(err);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`I was unable to undeafen <@${member.user.id}>.`)
                ]
            });
        }
    }
};
