const {
    ChannelType,
    PermissionsBitField,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    const tempVoiceControls = [
        'lock', 'unlock', 'hide', 'unhide',
        'deafen', 'undeafen', 'region', 'bitrate',
        'Increase', 'Decrease', 'Claim', 'View', 'Disconnect'
    ];

    if (!tempVoiceControls.includes(interaction.customId)) return;

    const member = interaction.guild.members.cache.get(interaction.user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
        return interaction.reply({
            content: 'You must be in a voice channel to use these controls.',
            ephemeral: true
        });
    }

    switch (interaction.customId) {
        case 'lock':
            try {
                await voiceChannel.permissionOverwrites.edit(interaction.guild.id, {
                    [PermissionsBitField.Flags.Connect]: false,
                });
                interaction.reply({ content: 'Channel locked.', ephemeral: true });
            } catch (err) {
                console.error('Error locking channel:', err);
                interaction.reply({ content: 'Failed to lock the channel.', ephemeral: true });
            }
            break;

        case 'unlock':
            try {
                await voiceChannel.permissionOverwrites.edit(interaction.guild.id, {
                    [PermissionsBitField.Flags.Connect]: true
                });
                interaction.reply({ content: 'Channel unlocked.', ephemeral: true });
            } catch (err) {
                console.error('Error unlocking channel:', err);
                interaction.reply({ content: 'Failed to unlock the channel.', ephemeral: true });
            }
            break;

        case 'hide':
            try {
                await voiceChannel.permissionOverwrites.edit(interaction.guild.id, {
                    [PermissionsBitField.Flags.ViewChannel]: false,
                });
                await voiceChannel.edit({ parent: interaction.channel.parentId });
                interaction.reply({ content: 'Channel hidden and locked.', ephemeral: true });
            } catch (err) {
                console.error('Error hiding channel:', err);
                interaction.reply({ content: 'Failed to hide the channel.', ephemeral: true });
            }
            break;

        case 'unhide':
            try {
                await voiceChannel.edit({ parent: interaction.channel.parentId });
                await voiceChannel.permissionOverwrites.edit(interaction.guild.id, {
                    [PermissionsBitField.Flags.ViewChannel]: true
                });
                interaction.reply({ content: 'Channel unhidden and unlocked.', ephemeral: true });
            } catch (err) {
                console.error('Error unhiding channel:', err);
                interaction.reply({ content: 'Failed to unhide the channel.', ephemeral: true });
            }
            break;

        case 'deafen':
            await member.voice.setDeaf(true);
            interaction.reply({ content: 'User deafened.', ephemeral: true });
            break;

        case 'undeafen':
            await member.voice.setDeaf(false);
            interaction.reply({ content: 'User undeafened.', ephemeral: true });
            break;

        case 'region':
        case 'bitrate':
        case 'Increase':
        case 'Decrease': {
            const modal = new ModalBuilder()
                .setCustomId(`modal_${interaction.customId}`)
                .setTitle(`Set ${interaction.customId}`);

            const input = new TextInputBuilder()
                .setCustomId(`${interaction.customId}_value`)
                .setLabel(`Enter ${interaction.customId.toLowerCase()} value`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const row = new ActionRowBuilder().addComponents(input);
            modal.addComponents(row);
            return interaction.showModal(modal);
        }

        case 'Claim':
            try {
                await voiceChannel.permissionOverwrites.edit(interaction.user.id, {
                    [PermissionsBitField.Flags.ManageChannels]: true,
                    [PermissionsBitField.Flags.MuteMembers]: true,
                    [PermissionsBitField.Flags.DeafenMembers]: true,
                    [PermissionsBitField.Flags.MoveMembers]: true,
                    [PermissionsBitField.Flags.Connect]: true,
                    [PermissionsBitField.Flags.ViewChannel]: true,
                });
                interaction.reply({ content: 'You have claimed ownership of this voice channel.', ephemeral: true });
            } catch (err) {
                console.error('Error claiming channel ownership:', err);
                interaction.reply({ content: 'Failed to claim ownership.', ephemeral: true });
            }
            break;

        case 'View':
            const info = `**Channel Name:** ${voiceChannel.name}
**Bitrate:** ${voiceChannel.bitrate}
**User Limit:** ${voiceChannel.userLimit || 'Unlimited'}
**Region:** ${voiceChannel.rtcRegion || 'Automatic'}
**Members:** ${voiceChannel.members.map(m => m.user.tag).join(', ') || 'No one connected'}
            `;
            interaction.reply({ content: info, ephemeral: true });
            break;

        default:
            interaction.reply({ content: 'Invalid action.', ephemeral: true });
            break;
    }
};
