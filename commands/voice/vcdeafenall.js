const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'vcdeafenall',
    category: 'voice',
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionFlagsBits.DeafenMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                    `You must have \`Deafen members\` permission to use this command.`
                );
            return message.channel.send({ embeds: [error] });
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.DeafenMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                    `I must have \`Deafen members\` permission to use this command.`
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

        let own = message.author.id === message.guild.ownerId;
        if (!own && message.member.roles.highest.position <= message.guild.members.me.roles.highest.position) {
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
                if (member.id === message.author.id || member.id === message.guild.members.me.id) {
                    return;
                }
                i++;
                await member.voice.setDeaf(true, `${message.author.tag} | ${message.author.id}`);
                await client.util.sleep(1000);
            });

            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209>  | Successfully deafened ${i} members in ${message.member.voice.channel.name}.`
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
                            `I don't have the required permissions to deafen members, or there was an error.`
                        )
                ]
            });
        }
    }
};
