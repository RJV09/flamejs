const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'vcmove',
    category: 'voice',
    run: async (client, message, args) => {
        const member = message.guild.members.cache.get(message.author.id);

        if (!member.permissions.has(PermissionFlagsBits.MoveMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription('You must have `Move Members` permission to use this command.');
            return message.channel.send({ embeds: [error] });
        }

        const botMember = message.guild.members.cache.get(client.user.id);
        if (!botMember.permissions.has(PermissionFlagsBits.MoveMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription('I must have `Move Members` permission to use this command.');
            return message.channel.send({ embeds: [error] });
        }

        if (!message.member.voice.channel) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('You must be connected to a voice channel first.')
                ]
            });
        }

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const voicechannel = message.guild.channels.cache.get(args[1]) || message.member.voice.channel;

        if (!user) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('Please mention someone who is in a voice channel.')
                ]
            });
        }

        if (!user.voice.channel) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('The mentioned user is not in a voice channel.')
                ]
            });
        }

        if (!voicechannel || voicechannel.type !== 'GUILD_VOICE') {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('Please provide a valid voice channel.')
                ]
            });
        }

        try {
            await user.voice.setChannel(voicechannel);
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`Successfully moved <@${user.id}> to ${voicechannel.name}.`)
                ]
            });
        } catch (err) {
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('I couldn\'t move the user to the channel.')
                ]
            });
        }
    }
};
