const { EmbedBuilder, PermissionsBitField } = require('discord.js');

let enable = `<:emoji_1725906884992:1306038885293494293><a:Tick:1306038825054896209>`;
let disable = `<a:Tick:1306038825054896209><:emoji_1725906884992:1306038885293494293>`;
let protect = `<:TH_Warning:1309588102326784010>`;
let hii = `<:emoji_1725907392606:1306050581978415144>`;
const wait = require('wait');

module.exports = {
    name: 'antispam',
    aliases: [],
    cooldown: 5,
    category: 'automod',
    subcommand: ['enable', 'disable', 'punishment', 'limit'],
    premium: false,
    run: async (client, message, args) => {
        const embed = new EmbedBuilder().setColor(client.color);

        if (message.guild.memberCount < 3) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | Your Server Doesn't Meet My 3 Member Criteria`)
                ]
            });
        }

        let own = message.author.id == message.guild.ownerId;
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | You must have \`Administrator\` permissions to use this command.`)
                ]
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | I don't have \`Administrator\` permissions to execute this command.`)
                ]
            });
        }

        if (!own && message.member.roles.highest.position <= message.guild.members.me.roles.highest.position) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | You must have a higher role than me to use this command.`)
                ]
            });
        }

        let prefix = message.guild.prefix || '&';

        const option = args[0];
        const isActivatedAlready = (await client.db.get(`antispam_${message.guild.id}`)) ?? null;

        const antispam = new EmbedBuilder()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle('__**Antispam**__')
            .setDescription('Prevent spam and maintain the integrity of your server with Antispam! Our advanced algorithms swiftly detect and handle spam messages, ensuring a clean and enjoyable environment for your community.')
            .addFields(
                { name: '__**Antispam Enable**__', value: `To Enable Antispam, use \`${prefix}antispam enable\`` },
                { name: '__**Antispam Disable**__', value: `To Disable Antispam, use \`${prefix}antispam disable\`` },
                { name: '__**Antispam Punishment**__', value: 'Configure the punishment for spammers.' },
                { name: 'Options', value: '`ban` - Ban spammers, `kick` - Kick spammers, `mute` - Mute spammers' },
                { name: '__**Antispam Limit**__', value: 'Configure the message limit to trigger antispam.' },
                { name: 'Usage', value: 'Use numbers to specify the message limit, e.g., `4`, `10`' }
            )
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

        switch (option) {
            case undefined:
                message.channel.send({ embeds: [antispam] });
                break;

            case 'enable':
                if (!isActivatedAlready) {
                    await client.db.set(`antispam_${message.guild.id}`, true);
                    await client.db.set(`antispamlimit_${message.guild.id}`, 4);
                    await client.db.set(`antispamp_${message.guild.id}`, { data: 'mute' });

                    const antispamEnableMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Antispam Enabled')
                        .setDescription('**Congratulations! Antispam has been successfully enabled on your server.**')
                        .addFields({ name: 'Enhanced Protection', value: 'Enjoy enhanced protection against spam messages!' })
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [antispamEnableMessage] });
                } else {
                    const antispamSettingsEmbed = new EmbedBuilder()
                        .setTitle(`Antispam Settings for ${message.guild.name} ${protect}`)
                        .setColor(client.color)
                        .setDescription(`**Antispam Status**`)
                        .addFields(
                            { name: 'Current Status', value: `Antispam is already enabled on your server.\n\nCurrent Status: ${enable}` },
                            { name: 'To Disable', value: `To disable Antispam, use \`${prefix}antispam disable\`` }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [antispamSettingsEmbed] });
                }
                break;

            case 'disable':
                if (isActivatedAlready) {
                    await client.db.set(`antispam_${message.guild.id}`, false);
                    await client.db.set(`antispamp_${message.guild.id}`, { data: null });

                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('**Antispam Disabled**')
                        .addFields(
                            { name: 'Status', value: 'Antispam has been successfully disabled on your server.' },
                            { name: 'Impact', value: 'Your server will no longer be protected against spam messages.' }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    return message.channel.send({ embeds: [embedMessage] });
                } else {
                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`**Antispam Status**`)
                        .addFields(
                            { name: 'Current Status', value: `Antispam is already disabled on your server.\n\nCurrent Status: ${disable}` },
                            { name: 'To Enable', value: `To enable Antispam, use \`${prefix}antispam enable\`` }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    return message.channel.send({ embeds: [embedMessage] });
                }
                break;

            case 'punishment':
                let punishment = args[1];
                if (!punishment) {
                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription('**Error:** Please provide valid punishment arguments.')
                        .addFields({ name: 'Valid Punishments', value: 'Valid options are: `ban`, `kick`, `mute`.' })
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    return message.channel.send({ embeds: [embedMessage] });
                }

                if (punishment === 'ban') {
                    await client.db.set(`antispamp_${message.guild.id}`, { data: 'ban' });

                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Anti-Spam Punishment Configured')
                        .setDescription('The anti-spam punishment has been successfully configured.')
                        .addFields(
                            { name: 'Punishment Type', value: 'Ban' },
                            { name: 'Action Taken', value: 'Any user caught spamming will be banned.' }
                        )
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [embedMessage] });
                } else if (punishment === 'kick') {
                    await client.db.set(`antispamp_${message.guild.id}`, { data: 'kick' });

                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Anti-Spam Punishment Configured')
                        .setDescription('The anti-spam punishment has been successfully configured.')
                        .addFields(
                            { name: 'Punishment Type', value: 'Kick' },
                            { name: 'Action Taken', value: 'Any user caught spamming will be kicked.' }
                        )
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [embedMessage] });
                } else if (punishment === 'mute') {
                    await client.db.set(`antispamp_${message.guild.id}`, { data: 'mute' });

                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Anti-Spam Punishment Configured')
                        .setDescription('The anti-spam punishment has been successfully configured.')
                        .addFields(
                            { name: 'Punishment Type', value: 'Mute' },
                            { name: 'Action Taken', value: 'Any user caught spamming will be muted.' },
                            { name: 'Duration', value: '5 minutes' }
                        )
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [embedMessage] });
                }
                break;

            case 'limit':
                let limit = args[1];
                if (!limit) {
                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`**Error:** Please provide valid message limit arguments.`)
                        .addFields({ name: 'Example', value: 'Use the command like this: `Antispam limit 4`' })
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    return message.channel.send({ embeds: [embedMessage] });
                }

                if (limit >= 4 && limit <= 10) {
                    await client.db.set(`antispamlimit_${message.guild.id}`, limit);

                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.tick} | **Spam Threshold Updated**`)
                        .addFields({ name: 'New Spam Threshold', value: `${limit}`, inline: true })
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [embedMessage] });
                } else {
                    const embedMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | **Error: Invalid Message Count Limit**`)
                        .addFields({ name: 'Valid Range', value: 'Message count limit must be greater than 3 and less than 10' })
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [embedMessage] });
                }
                break;
        }
    }
};