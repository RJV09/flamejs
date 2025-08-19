const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'vcunmute',
    category: 'voice',
    run: async (client, message, args) => {

        if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription('You must have `Mute Members` permission to use this command.');
            return message.channel.send({ embeds: [error] });
        }

        const botMember = message.guild.members.me;
        if (!botMember.permissions.has(PermissionFlagsBits.MuteMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription('I must have `Mute Members` permission to use this command.');
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
                        .setDescription('You must mention someone whom you want to unmute in your voice channel.')
                ]
            });
        }


        if (member.voice.channel !== message.member.voice.channel) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<@${member.user.id}> is not in your voice channel.`)
                ]
            });
        }

        try {

            await member.voice.setMute(false, `${message.author.tag} (${message.author.id})`);
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<a:Tick:1306038825054896209> | Successfully unmuted <@${member.user.id}> from voice!`)
                ]
            });
        } catch (err) {
            console.error(err);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`I was unable to unmute <@${member.user.id}>.`)
                ]
            });
        }
    }
};
