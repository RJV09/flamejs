const { EmbedBuilder, PermissionsBitField } = require('discord.js');
let enable = `<:emoji_1725906884992:1306038885293494293><a:Tick:1306038825054896209>`;
let disable = `<a:Tick:1306038825054896209><:emoji_1725906884992:1306038885293494293>`;
let protect = `<:TH_Warning:1309588102326784010>`;
const wait = require('wait');

module.exports = {
    name: 'antipronography',
    aliases: [],
    cooldown: 5,
    category: 'automod',
    subcommand: ['enable', 'disable', 'punishment'],
    premium: false,
    run: async (client, message, args) => {
        const embed = new EmbedBuilder().setColor(client.color);
        if (message.guild.memberCount < 3) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Your server doesn't meet my 3 member criteria.`
                        )
                ]
            });
        }

        let own = message.author.id == message.guild.ownerId;
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have \`Administrator\` permissions to use this command.`
                        )
                ]
            });
        }
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | I don't have \`Administrator\` permissions to execute this command.`
                        )
                ]
            });
        }
        if (
            !own &&
            message.member.roles.highest.position <= message.guild.members.me.roles.highest.position
        ) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have a higher role than me to use this command.`
                        )
                ]
            });
        }

        let prefix = message.guild.prefix || '&';

        const option = args[0];
        const isActivatedAlready =
            (await client.db.get(`antipronography_${message.guild.id}`)) ?? null;

        const antipronography = new EmbedBuilder()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle('__**Anti-Pornography**__')
            .setDescription(
                "Protect your server from inappropriate pornography content. Anti-Pornography will block images or messages that contain adult or inappropriate pornography content."
            )
            .addFields(
                { name: '__**Anti-Pornography Enable**__', value: `To enable Anti-Pornography, use \`${prefix}antipronography enable\`` },
                { name: '__**Anti-Pornography Disable**__', value: `To disable Anti-Pornography, use \`${prefix}antipronography disable\`` },
                { name: '__**Anti-Pornography Punishment**__', value: 'Configure the punishment for users posting inappropriate content.' },
                { name: 'Options', value: '`ban` - Ban users, `kick` - Kick users, `mute` - Mute users' }
            )
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

        switch (option) {
            case undefined:
                message.channel.send({ embeds: [antipronography] });
                break;

            case 'enable':
                if (!isActivatedAlready) {
                    await client.db.set(`antipronography_${message.guild.id}`, true);
                    await client.db.set(`antipronographyp_${message.guild.id}`, { data: 'mute' });

                    const antipronographyEnableMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Anti-Pornography Enabled')
                        .setDescription(
                            '**Congratulations! Anti-Pornography has been successfully enabled on your server.**'
                        )
                        .addFields(
                            { name: 'Enhanced Protection', value: 'Enjoy enhanced protection against pornography content!' }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [antipronographyEnableMessage] });
                } else {
                    const antipronographySettingsEmbed = new EmbedBuilder()
                        .setTitle(`Anti-Pornography Settings for ${message.guild.name} ${protect}`)
                        .setColor(client.color)
                        .setDescription('**Anti-Pornography is already enabled on your server.**')
                        .addFields(
                            { name: 'Current Status', value: `Anti-Pornography is already enabled.\n\nCurrent Status: ${enable}` },
                            { name: 'To Disable', value: `To disable Anti-Pornography, use \`${prefix}antipronography disable\`` }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
                    await message.channel.send({ embeds: [antipronographySettingsEmbed] });
                }

                break;

            case 'disable':
                if (isActivatedAlready) {
                    await client.db.set(`antipronography_${message.guild.id}`, false);
                    await client.db.set(`antipronographyp_${message.guild.id}`, { data: null });
                    const antipronographyDisableMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Anti-Pornography Disabled')
                        .setDescription('**Anti-Pornography has been successfully disabled on your server.**')
                        .addFields(
                            { name: 'Impact', value: 'Your server will no longer be protected against pornography content.' }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [antipronographyDisableMessage] });
                } else {
                    const antipronographySettingsEmbed = new EmbedBuilder()
                        .setTitle(`Anti-Pornography Settings for ${message.guild.name} ${protect}`)
                        .setColor(client.color)
                        .setDescription(`**Anti-Pornography Status**`)
                        .addFields(
                            { name: 'Current Status', value: `Anti-Pornography is currently disabled on your server.\n\nCurrent Status: ${disable}` },
                            { name: 'To Enable', value: `To enable Anti-Pornography, use \`${prefix}antipronography enable\`` }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
                    await message.channel.send({ embeds: [antipronographySettingsEmbed] });
                }
                break;

            case 'punishment':
                let punishment = args[1];
                if (!punishment) {
                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({
                            name: message.author.tag,
                            iconURL: message.author.displayAvatarURL({ dynamic: true })
                        })
                        .setDescription('**Invalid Punishment**')
                        .addFields(
                            { name: 'Error', value: 'Please provide valid punishment arguments.' },
                            { name: 'Valid Options', value: '`ban`, `kick`, `mute`' }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    return message.channel.send({ embeds: [embedMessage] });
                }
                if (punishment === 'ban') {
                    await client.db.set(`antipronographyp_${message.guild.id}`, { data: 'ban' });
                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Punishment Configured')
                        .setDescription('The punishment has been successfully configured.')
                        .addFields(
                            { name: 'Punishment Type', value: 'Ban' },
                            { name: 'Action Taken', value: 'Any user violating the rules will be banned from the server.' }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
                    await message.channel.send({ embeds: [embedMessage] });
                }
                if (punishment === 'kick') {
                    await client.db.set(`antipronographyp_${message.guild.id}`, { data: 'kick' });
                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Punishment Configured')
                        .setDescription('The punishment has been successfully configured.')
                        .addFields(
                            { name: 'Punishment Type', value: 'Kick' },
                            { name: 'Action Taken', value: 'Any user violating the rules will be kicked from the server.' }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [embedMessage] });
                }
                if (punishment === 'mute') {
                    await client.db.set(`antipronographyp_${message.guild.id}`, { data: 'mute' });
                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Anti-Pornography Punishment Configured')
                        .setDescription('The Anti-Pornography punishment has been successfully configured.')
                        .addFields(
                            { name: 'Punishment Type', value: 'Mute' },
                            { name: 'Action Taken', value: 'Any user caught posting pornography content will be muted.' }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [embedMessage] });
                }
        }
    }
};
