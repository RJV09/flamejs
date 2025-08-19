const { EmbedBuilder } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = async (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        let data2 = await client.data.get(`logs_${oldState.guild.id}`);
        if (!data2) return;
        if (!data2.voice) return;
        const channel = data2.voice;
        const voicelog = await oldState.guild.channels.cache.get(channel);
        if (!voicelog) { 
            await client.data.set(`logs_${oldState.guild.id}`, {
                voice: null,
                channel: data2 ? data2.channel : null,
                rolelog: data2 ? data2.rolelog : null,
                modlog: data2 ? data2.modlog : null,
                message: data2 ? data2.message : null,
                memberlog: data2 ? data2.memberlog : null,
            });
            return;
        }

        const member = newState.member;

        // When a member joins a voice channel
        if (!oldState.channelId && newState.channelId) {
            const joinedChannel = newState.channel.name || 'NONE';

            const joinEmbed = new EmbedBuilder()
                .setColor(client.color) 
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setTitle('Member Joined Voice Channel')
                .setDescription(`${member.user.tag} joined voice channel "${joinedChannel}"`)
                .addFields({ name: 'Channel', value: joinedChannel })
                .setFooter({ text: `${member.user.tag} joined voice channel`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await wait(2000);
            voicelog.send({ embeds: [joinEmbed] }).catch((err) => null);
        }

        // When a member leaves a voice channel
        if (oldState.channelId && !newState.channelId) {
            const leftChannel = oldState.channel.name || 'NONE';

            const leaveEmbed = new EmbedBuilder()
                .setColor(client.color) 
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setTitle('Member Left Voice Channel')
                .setDescription(`${member.user.tag} left voice channel "${leftChannel}"`)
                .addFields({ name: 'Channel', value: leftChannel })
                .setFooter({ text: `${member.user.tag} left voice channel`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await wait(2000);
            await voicelog.send({ embeds: [leaveEmbed] }).catch((err) => null);
        }

        // When a member moves between voice channels
        if (oldState.channelId !== newState.channelId) {
            const oldChannel = oldState.channel ? oldState.channel.name : 'NONE';
            const newChannel = newState.channel ? newState.channel.name : 'NONE';

            const moveEmbed = new EmbedBuilder()
                .setColor(client.color) 
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setTitle('Member Moved Voice Channels')
                .setDescription(`${member.user.tag} moved from "${oldChannel}" to "${newChannel}"`)
                .addFields({ name: 'From', value: oldChannel })
                .addFields({ name: 'To', value: newChannel })
                .setFooter({ text: `${member.user.tag} moved voice channels`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await wait(2000);
            await voicelog.send({ embeds: [moveEmbed] }).catch((err) => null);
        }
    });
};
