const { EmbedBuilder, PermissionsBitField } = require('discord.js');
let enable = `<:emoji_1725906884992:1306038885293494293><a:Tick:1306038825054896209>`;
let disable = `<a:Tick:1306038825054896209><:emoji_1725906884992:1306038885293494293>`;
let protect = `<:TH_Warning:1309588102326784010>`;
let hii = `<:emoji_1725907392606:1306050581978415144>`;
const wait = require('wait');
module.exports = {
    name: 'antiswear',
    aliases: [],
    cooldown: 5,
    category: 'automod',
    subcommand: ['enable', 'disable', 'add', 'remove', 'list'],
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
            (await client.db.get(`antiswear_${message.guild.id}`)) ?? null;
        const swearWords = (await client.db.get(`swearwords_${message.guild.id}`)) ?? [];

        const antiswearEmbed = new EmbedBuilder()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle('__**Antiswear**__')
            .setDescription(
                "Protect your community from inappropriate language using the Antiswear feature. Automatically detect and filter swear words!"
            )
            .addFields(
                { name: '__**Antiswear Enable**__', value: `To Enable Antiswear, use \`${prefix}antiswear enable\`` },
                { name: '__**Antiswear Disable**__', value: `To Disable Antiswear, use \`${prefix}antiswear disable\`` },
                { name: '__**Antiswear Add/Remove**__', value: 'To add a word to the blacklist, use `add <word>`. To remove a word, use `remove <word>`.' },
                { name: '__**Antiswear List**__', value: `To see the list of banned words, use \`${prefix}antiswear list\`` }
            )
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

        switch (option) {
            case undefined:
                message.channel.send({ embeds: [antiswearEmbed] });
                break;

            case 'enable':
                if (!isActivatedAlready) {
                    await client.db.set(`antiswear_${message.guild.id}`, true);

                    const antiswearEnableMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Antiswear Enabled')
                        .setDescription(
                            '**Antiswear has been successfully enabled on your server.**'
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [antiswearEnableMessage] });
                } else {
                    const antiswearSettingsEmbed = new EmbedBuilder()
                        .setTitle(`Antiswear Settings for ${message.guild.name} ${protect}`)
                        .setColor(client.color)
                        .setDescription('**Antiswear is already enabled on your server.**')
                        .addFields(
                            { name: 'Current Status', value: `Antiswear is already enabled.` },
                            { name: 'To Disable', value: `To disable Antiswear, use \`${prefix}antiswear disable\`` }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
                    await message.channel.send({ embeds: [antiswearSettingsEmbed] });
                }

                break;

            case 'disable':
                if (isActivatedAlready) {
                    await client.db.set(`antiswear_${message.guild.id}`, false);

                    const antiswearDisableMessage = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Antiswear Disabled')
                        .setDescription('**Antiswear has been successfully disabled on your server.**')
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [antiswearDisableMessage] });
                } else {
                    const antiswearSettingsEmbed = new EmbedBuilder()
                        .setTitle(`Antiswear Settings for ${message.guild.name} ${protect}`)
                        .setColor(client.color)
                        .setDescription('**Antiswear is currently disabled on your server.**')
                        .addFields(
                            { name: 'Current Status', value: `Antiswear is currently disabled.` },
                            { name: 'To Enable', value: `To enable Antiswear, use \`${prefix}antiswear enable\`` }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
                    await message.channel.send({ embeds: [antiswearSettingsEmbed] });
                }
                break;

            case 'add':
                const wordToAdd = args[1];
                if (!wordToAdd) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription('Please provide a word to add to the blacklist.')
                        ]
                    });
                }
                if (!swearWords.includes(wordToAdd)) {
                    swearWords.push(wordToAdd);
                    await client.db.set(`swearwords_${message.guild.id}`, swearWords);

                    const wordAddedEmbed = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Word Added to Blacklist')
                        .setDescription(`**${wordToAdd}** has been added to the blacklist.`)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [wordAddedEmbed] });
                } else {
                    message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`**${wordToAdd}** is already in the blacklist.`)
                        ]
                    });
                }
                break;

            case 'remove':
                const wordToRemove = args[1];
                if (!wordToRemove) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription('Please provide a word to remove from the blacklist.')
                        ]
                    });
                }
                if (swearWords.includes(wordToRemove)) {
                    const index = swearWords.indexOf(wordToRemove);
                    swearWords.splice(index, 1);
                    await client.db.set(`swearwords_${message.guild.id}`, swearWords);

                    const wordRemovedEmbed = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Word Removed from Blacklist')
                        .setDescription(`**${wordToRemove}** has been removed from the blacklist.`)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                    await message.channel.send({ embeds: [wordRemovedEmbed] });
                } else {
                    message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`**${wordToRemove}** is not in the blacklist.`)
                        ]
                    });
                }
                break;

            case 'list':
                if (swearWords.length === 0) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription('No words are currently in the blacklist.')
                        ]
                    });
                }
                const swearListEmbed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle('Current Swear Words Blacklist')
                    .setDescription(swearWords.join(', '))
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

                message.channel.send({ embeds: [swearListEmbed] });
                break;

            default:
                message.channel.send({ embeds: [antiswearEmbed] });
                break;
        }
    }
};
