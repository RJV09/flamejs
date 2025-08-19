const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'vcmuteall',
    category: 'voice',
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription('You must have `Mute Members` permission to use this command.');
            return message.channel.send({ embeds: [error] });
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.MuteMembers)) {
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


        const isOwner = message.author.id === message.guild.ownerId;
        const botMember = message.guild.members.me; 
        if (!isOwner && botMember && message.member.roles.highest.position <= botMember.roles.highest.position) {
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
                if (!member.user.bot) {
                    i++;
                    await member.voice.setMute(true, `${message.author.tag} | ${message.author.id}`);
                    await client.util.sleep(1000);
                }
            });

            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<a:Tick:1306038825054896209>  | Successfully muted ${i} members in ${message.member.voice.channel.name}!`)
                ]
            });
        } catch (err) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription("I don't have the required permissions to mute members.")
                ]
            });
        }
    }
};
