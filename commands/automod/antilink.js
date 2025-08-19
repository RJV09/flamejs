const { EmbedBuilder, PermissionsBitField } = require('discord.js');
let enable = `<:emoji_1725906884992:1306038885293494293><a:Tick:1306038825054896209>`;
let disable = `<a:Tick:1306038825054896209><:emoji_1725906884992:1306038885293494293>`;
let protect = `<:TH_Warning:1309588102326784010>`;
let hii = `<:emoji_1725907392606:1306050581978415144>`;
const wait = require('wait');

module.exports = {
    name: 'antilink',
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
                            `${client.emoji.cross} | Your Server Doesn't Meet My 3 Member Criteria`
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
            message.member.roles.highest.position <=
                message.guild.members.me.roles.highest.position
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
            (await client.db.get(`antilink_${message.guild.id}`)) ?? null;

        const antilink = new EmbedBuilder()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle('__**Antilink**__')
            .setDescription(
                "Enhance your server's protection with Antilink! Our advanced algorithms swiftly identify suspicious links and take immediate action against them, safeguarding your community from potential threats."
            )
            .addFields(
                { name: '__**Antilink Enable**__', value: `To Enable Antilink, use \`${prefix}antilink enable\`` },
                { name: '__**Antilink Disable**__', value: `To Disable Antilink, use \`${prefix}antilink disable\`` },
                { name: '__**Antilink Punishment**__', value: 'Configure the punishment for users posting suspicious links.' },
                { name: 'Options', value: '`ban` - Ban users, `kick` - Kick users, `mute` - Mute users' }
            )
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

        switch (option) {
            case undefined:
                message.channel.send({ embeds: [antilink] });
                break;

            case 'enable':
                if (!isActivatedAlready) {
                    await client.db.set(`antilink_${message.guild.id}`, true);
                    await client.db.set(`antilinkp_${message.guild.id}`, {
                        data: 'mute'
                    });

                    const antilinkEnableMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Antilink Enabled')
                        .setDescription(
                            '**Congratulations! Antilink has been successfully enabled on your server.**'
                        )
                        .addFields(
                            { name: 'Enhanced Protection', value: 'Enjoy enhanced protection against suspicious links!' }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({
                        embeds: [antilinkEnableMessage]
                    });
                } else {
                    const antilinkSettingsEmbed = new EmbedBuilder()
                        .setTitle(
                            `Antilink Settings for ${message.guild.name} ${protect}`
                        )
                        .setColor(client.color)
                        .setDescription(
                            '**Antilink is already enabled on your server.**'
                        )
                        .addFields(
                            { name: 'Current Status', value: `Antilink is already enabled on your server.\n\nCurrent Status: ${enable}` },
                            { name: 'To Disable', value: `To disable Antilink, use \`${prefix}antilink disable\`` }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
                    await message.channel.send({
                        embeds: [antilinkSettingsEmbed]
                    });
                }

                break;

            case 'disable':
                if (isActivatedAlready) {
                    await client.db.set(`antilink_${message.guild.id}`, false);
                    await client.db.set(`antilinkp_${message.guild.id}`, {
                        data: null
                    });
                    const antilinkDisableMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Antilink Disabled')
                        .setDescription(
                            '**Antilink has been successfully disabled on your server.**'
                        )
                        .addFields(
                            { name: 'Impact', value: 'Your server will no longer be protected against suspicious links.' }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({
                        embeds: [antilinkDisableMessage]
                    });
                } else {
                    const antilinkSettingsEmbed = new EmbedBuilder()
                        .setTitle(
                            `Antilink Settings for ${message.guild.name} ${protect}`
                        )
                        .setColor(client.color)
                        .setDescription(`**Antilink Status**`)
                        .addFields(
                            { name: 'Current Status', value: `Antilink is currently disabled on your server.\n\nCurrent Status: ${disable}` },
                            { name: 'To Enable', value: `To enable Antilink, use \`${prefix}antilink enable\`` }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
                    await message.channel.send({
                        embeds: [antilinkSettingsEmbed]
                    });
                }
                break;

            case 'punishment':
                let punishment = args[1];
                if (!punishment) {
                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({
                            name: message.author.tag,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
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
                    await client.db.set(`antilinkp_${message.guild.id}`, {
                        data: 'ban'
                    });
                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Punishment Configured')
                        .setDescription(
                            'The punishment has been successfully configured.'
                        )
                        .addFields(
                            { name: 'Punishment Type', value: 'Ban' },
                            { name: 'Action Taken', value: 'Any user violating the rules will be banned from the server.' }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
                    await message.channel.send({ embeds: [embedMessage] });
                }
                if (punishment === 'kick') {
                    await client.db.set(`antilinkp_${message.guild.id}`, {
                        data: 'kick'
                    });
                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Punishment Configured')
                        .setDescription(
                            'The punishment has been successfully configured.'
                        )
                        .addFields(
                            { name: 'Punishment Type', value: 'Kick' },
                            { name: 'Action Taken', value: 'Any user violating the rules will be kicked from the server.' }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [embedMessage] });
                }
                if (punishment === 'mute') {
                    await client.db.set(`antilinkp_${message.guild.id}`, {
                        data: 'mute'
                    });
                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Antilink Punishment Configured')
                        .setDescription(
                            'The antilink punishment has been successfully configured.'
                        )
                        .addFields(
                            { name: 'Punishment Type', value: 'Mute' },
                            { name: 'Action Taken', value: 'Any user caught posting links will be muted.' }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [embedMessage] });
                }
        }
    }
};