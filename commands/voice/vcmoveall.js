const { EmbedBuilder, PermissionFlagsBits, VoiceChannel } = require('discord.js');

module.exports = {
    name: 'vcmoveall',
    category: 'voice',
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionFlagsBits.MoveMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription('You must have `Move Members` permission to use this command.');
            return message.channel.send({ embeds: [error] });
        }


        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.MoveMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription('I must have `Move Members` permission to use this command.');
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

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || !(channel instanceof VoiceChannel)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('Invalid or non-existent voice channel provided.')
                ]
            });
        }

        const own = message.author.id === message.guild.ownerId;
        if (!own && message.member.roles.highest.position <= message.guild.members.me.roles.highest.position) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji?.cross || '❌'} | You must have a higher role than me to use this command.`)
                ]
            });
        }

        try {
            let i = 0;

            message.member.voice.channel.members.forEach(async (member) => {
                if (member.voice.channel) {
                    i++;
                    await member.voice.setChannel(channel.id, `${message.author.tag} | ${message.author.id}`);

                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            });

            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<a:Tick:1306038825054896209> | Successfully moved ${i} members to ${channel.name}!`)
                ]
            });
        } catch (err) {
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`I don't have the required permissions to move members to ${channel.name}.`)
                ]
            });
        }
    }
};
