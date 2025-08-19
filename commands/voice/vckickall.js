const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'vckickall',
    category: 'voice',
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionFlagsBits.MoveMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                    `You must have \`Move members\` permission to use this command.`
                );
            return message.channel.send({ embeds: [error] });
        }
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.MoveMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                    `I must have \`Move members\` permission to use this command.`
                );
            return message.channel.send({ embeds: [error] });
        }
        if (!message.member.voice.channel) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `You must be connected to a voice channel first.`
                        )
                ]
            });
        }
        let own = message.author.id == message.guild.ownerId;
        if (
            !own &&
            message.member.roles.highest.position <=
                message.guild.members.me.roles.highest.position
        ) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji?.cross || '❌'} | You must have a higher role than me to use this command.`
                        )
                ]
            });
        }

        try {
            let i = 0;
            message.member.voice.channel.members.forEach(async (member) => {
                if (member.id !== message.author.id && member.id !== message.guild.members.me.id) {
                    i++;
                    await member.voice.disconnect(`${message.author.tag} | ${message.author.id}`);
                    await client.util.sleep(1000);
                }
            });
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209>  | Successfully disconnected ${i} members from ${message.member.voice.channel}!`
                        )
                ]
            });
        } catch (err) {
            console.error(err);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `I don't have the required permissions to disconnect members.`
                        )
                ]
            });
        }
    }
};
