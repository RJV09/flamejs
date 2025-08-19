const { ChannelType } = require('discord.js');

module.exports = async (client, oldState, newState) => {
    const guild = newState.guild;


    if (newState.channel && newState.channel.name === 'JOIN2CREATE') {
        const member = newState.member;


        const newChannel = await guild.channels.create({
            name: `Channel-${member.user.username}-${member.user.discriminator}`,
            type: ChannelType.GuildVoice, 
            parent: newState.channel.parentId,
            reason: `${member.user.tag} joined the JOIN2CREATE channel`,
        });

        await member.voice.setChannel(newChannel);
    }

    if (oldState.channel && oldState.channel.type === ChannelType.GuildVoice) {
        if (oldState.channel.name.startsWith('Channel-') && oldState.channel.members.size === 0) {
            try {
                await oldState.channel.delete();
                console.log(`Deleted empty voice channel: ${oldState.channel.name}`);
            } catch (err) {
                console.log(`Error deleting channel ${oldState.channel.name}:`, err);
            }
        }
    }
};
