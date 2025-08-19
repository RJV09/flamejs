const {
    Client,
    GatewayIntentBits,
    PermissionsBitField,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    name: 'join2create',
    aliases: ['j2c'],
    category: 'j2c',
    premium: false,
    /**
     * @param {Client} client 
     * @param {import('discord.js').Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        const guild = message.guild;

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.channel.send({
                embeds: [
                    {
                        color: parseInt("02b6e7", 16),
                        description: `<:emoji_1725906884992:1306038885293494293> | You must have \`Manage Channels\` permission to use this command.`
                    }
                ]
            });
        }
        let category = guild.channels.cache.find(c => c.name === 'FLAME VOICE' && c.type === ChannelType.GuildCategory);
        if (!category) {
            category = await guild.channels.create({
                name: 'FLAME VOICE',
                type: ChannelType.GuildCategory,
            });
        }
        let join2createChannel = guild.channels.cache.find(c => c.name === 'JOIN2CREATE' && c.type === ChannelType.GuildVoice);
        if (!join2createChannel) {
            join2createChannel = await guild.channels.create({
                name: 'JOIN2CREATE',
                type: ChannelType.GuildVoice,
                parent: category.id,
                reason: 'Creating the JOIN2CREATE channel for users to join and create their own channels',
            });
        }
        let flameControlChannel = guild.channels.cache.find(c => c.name === 'FLAME interface' && c.type === ChannelType.GuildText);
        if (!flameControlChannel) {
            flameControlChannel = await guild.channels.create({
                name: 'FLAME interface',
                type: ChannelType.GuildText,
                parent: category.id,
                reason: 'Creating the FLAME CONTROL text channel for controlling user-created channels',
                
            });
        }
        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('lock')
                .setEmoji('<:stolen_emoji:1371559176832024598>')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('unlock')
                .setEmoji('<:stolen_emoji:1371559212668289135>')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('hide')
                .setEmoji('<:stolen_emoji:1371559242212970578>')
                .setStyle(ButtonStyle.Secondary)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('unhide')
                .setEmoji('<:stolen_emoji:1371559277105512498>')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('deafen')
                .setEmoji('<:crvt:1371577432796037211>')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('undeafen')
                .setEmoji('<:crvt:1371577940545900656>')
                .setStyle(ButtonStyle.Secondary)
        );

        const row3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('region')
                .setEmoji('<:crvt:1371578280284655648>')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('bitrate')
                .setEmoji('<:crvt:1371578477538574352>')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('Increase')
                .setEmoji('<:stolen_emoji:1371559461025484910>')
                .setStyle(ButtonStyle.Secondary)
        );
        const row4 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('Decrease')
                .setEmoji('<:stolen_emoji:1371559493422551212>')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('Claim')
                .setEmoji('<:stolen_emoji:1371559373893275710>')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('View')
                .setEmoji('<:stolen_emoji:1371559422286888971>')
                .setStyle(ButtonStyle.Secondary)
        );

const embed = new EmbedBuilder()
    .setColor(parseInt("02b6e7", 16))
    .setAuthor({
        name: 'VoiceMaster Interface',
        iconURL: client.user.displayAvatarURL()
        
    })
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setDescription(
        'Use the buttons below to control your voice channel.\n\n**Button Usage**\n'
        + '<:stolen_emoji:1371559176832024598> — **[`Lock`](https://discord.gg/rfzop)** the voice channel\n'
        + '<:stolen_emoji:1371559212668289135> — **[`Unlock`](https://discord.gg/rfzop)** the voice channel\n'
        + '<:stolen_emoji:1371559242212970578> — **[`Hide`](https://discord.gg/rfzop)** the voice channel\n'
        + '<:stolen_emoji:1371559277105512498> — **[`Unhide`](https://discord.gg/rfzop)** the voice channel\n'
        + '<:stolen_emoji:1371559310735310908> — **[`Claim`](https://discord.gg/rfzop)** the voice channel\n'
        + '<:crvt:1371577432796037211> — **[`Deafen`](https://discord.gg/rfzop)** the voice channel\n'
        + '<:crvt:1371577940545900656> — **[`Undeafen`](https://discord.gg/rfzop)** the voice channel\n'
        + '<:stolen_emoji:1371559310735310908> — **[`Disconnect`](https://discord.gg/rfzop)** a member\n'
        + '<:crvt:1371578280284655648> — **[`Region`](https://discord.gg/rfzop)** the voice channel\n'
        + '<:crvt:1371578477538574352> — **[`Bitrate`](https://discord.gg/rfzop)** the voice channel\n'
        + '<:stolen_emoji:1371559422286888971> — **[`View`](https://discord.gg/rfzop)** channel information\n'
        + '<:stolen_emoji:1371559461025484910> — **[`Increase`](https://discord.gg/rfzop)** the user limit\n'
        + '<:stolen_emoji:1371559493422551212> — **[`Decrease`](https://discord.gg/rfzop)** the user limit'
    );
        await flameControlChannel.send({ embeds: [embed], components: [row1, row2, row3, row4] });
    }
};