const {
    Client,
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

module.exports = {
    name: "autolog",
    aliases: ["autologging"],
    description: "Auto Log",
    category: "logging",
    adminPermit: true,
    cooldown: 5,
    run: async (client, message, args, prefix) => {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have \`MANAGE SERVER\` permissions to use this command.`
                        )
                ]
            });
        }
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | I don't have \`Administrator\` permissions to execute this command.`
                        )
                ]
            });
        }

        let data2 = await client.data.get(`logs_${message.guild.id}`);
        if (!data2) {
            await client.data.set(`logs_${message.guild.id}`, {
                voice: null,
                channel: null,
                rolelog: null,
                modlog: null,
                message: null,
                memberlog: null
            });
            const initialMessage = await message.channel.send({
                embeds: [new EmbedBuilder().setColor(client.color).setDescription('Configuring your server...')]
            });
          
            initialMessage.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Server Configuration Successful')
                        .setDescription('Your server has been successfully configured for logging.')
                        .setFooter({ text: 'Your server has been successfully configured for logging. Run the command again!' })
                ]
            });
        }

        if (data2.modlog || data2.memberlog || data2.message || data2.channel || data2.rolelog || data2.voice) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Logging System is Already Set Up')
                        .setDescription('Your server already has a configured logging system.')
                        .addFields({ name: 'How to Reset Logging?', value: 'You can manage logging settings using the appropriate commands.' })
                        .setFooter({ text: `Note: If you want to setup logging again, use ${prefix}logsreset and delete all existing log channels of Ayami Prime`, iconURL: client.user.displayAvatarURL() })
                ]
            });
        }

        try {
            let category = message.guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === 'AYAMI-LOGS');

            if (!category) {
                category = await message.guild.channels.create({
                    name: 'Ayami-LOGS',
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel]
                        }
                    ]
                });
            }

            const channels = [
                { name: 'voicelogs', topic: 'This channel logs voice-related events.' },
                { name: 'channellogs', topic: 'This channel logs channel-related events.' },
                { name: 'rolelogs', topic: 'This channel logs role-related events.' },
                { name: 'modlogs', topic: 'This channel logs moderation events.' },
                { name: 'msglogs', topic: 'This channel logs message events.' },
                { name: 'memberlogs', topic: 'This channel logs member-related events.' }
            ];

            for (const channelData of channels) {
                let check = await message.guild.channels.cache.find(ch => ch.name === channelData.name);
                if (check) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setTitle('Logging System is Already Set Up')
                                .setDescription('Your server already has a configured logging system.')
                                .addFields({ name: 'How to Reset Logging?', value: 'You can manage logging settings using the appropriate commands.' })
                                .setFooter({ text: `Note: If you want to setup logging again, use ${prefix}logsreset and delete all existing log channels of Ayami Prime`, iconURL: client.user.displayAvatarURL() })
                        ]
                    });
                }

              
                await message.guild.channels.create({
                    name: channelData.name,
                    type: ChannelType.GuildText,
                    topic: channelData.topic,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel]
                        }
                    ],
                    reason: 'Creating logging channels as part of autologs setup.'
                });
            }

            let voicelog = await message.guild.channels.cache.find(channel => channel.name === 'voicelogs');
            let channellog = await message.guild.channels.cache.find(channel => channel.name === 'channellogs');
            let rolelog = await message.guild.channels.cache.find(channel => channel.name === 'rolelogs');
            let modlog = await message.guild.channels.cache.find(channel => channel.name === 'modlogs');
            let msglog = await message.guild.channels.cache.find(channel => channel.name === 'msglogs');
            let memberlog = await message.guild.channels.cache.find(channel => channel.name === 'memberlogs');

            await client.data.set(`logs_${message.guild.id}`, {
                voice: voicelog.id,
                channel: channellog.id,
                rolelog: rolelog.id,
                modlog: modlog.id,
                message: msglog.id,
                memberlog: memberlog.id
            });

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Logging Channels Setup Complete')
                        .setDescription('All necessary logging channels have been successfully created under the "AYAMI LOGS" category.')
                        .addFields(
                            { name: 'Channels Created', value: '- **modlog:** Logs moderation-related events.\n- **memberlog:** Logs member-related events.\n- **msglog:** Logs message-related events.\n- **channellog:** Logs channel-related events.\n- **voicelog:** Logs voice-related events\n- **rolelog:** Logs role-related events.' },
                            { name: 'Additional Configuration', value: 'You can further customize logging settings and manage permissions as needed.' }
                        )
                ]
            });

        } catch (error) {
            if (error.code === 429) {
               console.log(error)
            }
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('An error occurred while creating logging channels.')
                ]
            });
        }
    }
};

