const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'vcundeafenall',
    category: 'voice',
    run: async (client, message, args) => {

        if (!message.member.permissions.has(PermissionFlagsBits.DeafenMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color)
                .setDescription('You must have `Deafen Members` permission to use this command.');
            return message.channel.send({ embeds: [error] });
        }

        const botMember = message.guild.members.me;
        if (!botMember.permissions.has(PermissionFlagsBits.DeafenMembers)) {
            const error = new EmbedBuilder()
                .setColor(client.color)
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
        let own = message.author.id == message.guild.ownerId;
        if (!own && message.member.roles.highest.position <= botMember.roles.highest.position) {
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

            for (const [id, member] of message.member.voice.channel.members) {
                if (!member.voice.deaf) {
                    continue; 
                }
                i++;
                await member.voice.setDeaf(false, `${message.author.tag} (${message.author.id})`);
                await client.util.sleep(1000); 
            }

            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209>  | Successfully undeafened ${i} members in ${message.member.voice.channel.name}!`
                        )
                ]
            });
        } catch (err) {
            console.error(err);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription("I don't have the required permissions to undeafen members.")
                ]
            });
        }
    }
};
