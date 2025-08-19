const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const moment = require('moment');
const os = require('os');
const userUtils = require("../../structures/member.js");
const formatters = {
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
};

module.exports = {
    name: 'stats',
    category: 'info',
    aliases: ['botinfo', 'bi'],
    usage: 'stats',
    run: async (client, message, args) => {
        // Create buttons
        const button = new ButtonBuilder()
            .setLabel('Team Info')
            .setCustomId('team')
            .setStyle(ButtonStyle.Secondary);
        
        const button1 = new ButtonBuilder()
            .setLabel('General Info')
            .setCustomId('general')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);
        
        const button2 = new ButtonBuilder()
            .setLabel('System Info')
            .setCustomId('system')
            .setStyle(ButtonStyle.Secondary);
        
        const button3 = new ButtonBuilder()
            .setLabel('Partners')
            .setCustomId('partners')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents([button, button1, button2, button3]);

        const additionalUsers = userUtils.getAdditionalUsers();
        const CacheUsers = userUtils.CacheUsers();
        const Members = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0); 
        const totalUsers = Members + additionalUsers;
        const uptime = Math.round(Date.now() - client.uptime);
        let guilds1 = client.guilds.cache.size;
        let member1 = client.guilds.cache.reduce((x, y) => x + y.memberCount, 0);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({
                name: 'FlaMe SECURITY Informations',
                iconURL: (
                    await client.guilds
                        .fetch('873228243757596672')
                        .catch(() => null)
                )?.members?.cache
                    ?.get('')
                    ?.user?.displayAvatarURL({ dynamic: true })
            })
            .setDescription(
                `**__General Informations__**\nBot's Mention: <@!${client.user.id}>\nBot's Tag: ${client.user.tag}\nBot's Version: Beta\nTotal Servers: ${guilds1}\nTotal Users: ${formatters.formatNumber(totalUsers)}\nTotal Channels: ${client.channels.cache.size}\nLast Rebooted: ${moment(uptime).fromNow()}`
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({
                text: `Requested By ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        const msg = await message.channel.send({
            embeds: [embed],
            components: [row]
        });

        const collector = msg.createMessageComponentCollector({
            filter: (i) => i.user.id === message.author.id,
            time: 60000
        });

        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                return i.reply({
                    content: "> This isn't for you.",
                    ephemeral: true
                });
            }

            if (i.customId === 'partners') {
                await i.deferUpdate();
                const em = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({
                        name: "FlaMe SECURITY Partner's",
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `Red Flagzz, our first partners and contributor [click here to see website](https://redflagzz.carrd.co/)\n[discord server](https://discord.gg/rfzop)`
                    )
                    .setFooter({
                        text: `© Powered By Team FlaMe`,
                        iconURL: 'https://cdn.discordapp.com/icons/1089579780850077858/a_5111711e34f6d58323baf36c0b29b773.gif'
                    })
                    .setImage(
                        `https://cdn.discordapp.com/attachments/1318172282677366815/1318178482710122598/standard_21.gif?ex=676160e0&is=67600f60&hm=ea24623d6c75d436e3295a4ed05d2d64b3949de2b75ffaf62e6e90d0f11a64e7&`
                    );

                const updatedButton = new ButtonBuilder(button.data).setDisabled(false);
                const updatedButton1 = new ButtonBuilder(button1.data).setDisabled(false);
                const updatedButton2 = new ButtonBuilder(button2.data).setDisabled(false);
                const updatedButton3 = new ButtonBuilder(button3.data).setDisabled(true);

                const row1 = new ActionRowBuilder().addComponents([
                    updatedButton,
                    updatedButton1,
                    updatedButton2,
                    updatedButton3
                ]);

                await msg.edit({
                    embeds: [em],
                    components: [row1]
                });
            }

            if (i.customId === 'general') {
                await i.deferUpdate();
                let member = client.guilds.cache.reduce((x, y) => x + y.memberCount, 0);
                if (member >= 1000 && member < 1000000) {
                    member = (member / 1000).toFixed(1) + 'k';
                } else if (member >= 1000000) {
                    member = (member / 1000000).toFixed(1) + 'm';
                } else {
                    member1 = member1;
                }

                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({
                        name: 'FlaMe SECURITY Informations',
                        iconURL: client.guilds.cache.get('873228243757596672')?.members?.cache?.get('1387826587172343990')?.user?.displayAvatarURL({ dynamic: true })
                    })
                    .setDescription(
                        `**__General Informations__**\nBot's Mention: <@!${client.user.id}>\nBot's Tag: ${client.user.tag}\nBot's Version: Beta\nTotal Servers: ${guilds1}\nTotal Users: ${formatters.formatNumber(totalUsers)}\nTotal Channels: ${client.channels.cache.size}\nLast Rebooted: ${moment(uptime).fromNow()}`
                    )
                    .setThumbnail(client.user.displayAvatarURL())
                    .setFooter({
                        text: `Requested By ${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    });

                const updatedButton = new ButtonBuilder(button.data).setDisabled(false);
                const updatedButton1 = new ButtonBuilder(button1.data).setDisabled(true);
                const updatedButton2 = new ButtonBuilder(button2.data).setDisabled(false);
                const updatedButton3 = new ButtonBuilder(button3.data).setDisabled(false);

                const row1 = new ActionRowBuilder().addComponents([
                    updatedButton,
                    updatedButton1,
                    updatedButton2,
                    updatedButton3
                ]);

                await msg.edit({
                    embeds: [embed],
                    components: [row1]
                });
            }

            if (i.customId === 'system') {
                await i.deferUpdate();
                await msg.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setAuthor({
                                name: 'FlaMe SECURITY Informations',
                                iconURL: client.guilds.cache.get('873228243757596672')?.members?.cache?.get('1387826587172343990')?.user?.displayAvatarURL({ dynamic: true })
                            })
                            .setFooter({
                                text: `Requested By ${message.author.tag}`,
                                iconURL: message.author.displayAvatarURL({ dynamic: true })
                            })
                            .setDescription('<a:emoji_1725906208338:1306038739369197723> | **Fetching** all the **resources**...')
                    ]
                });

                const totalMemoryBytes = os.totalmem();
                const cpuCount = os.cpus().length;
                const freeMemoryBytes = os.freemem();
                const memoryUsageBytes = totalMemoryBytes - freeMemoryBytes;

                let totalMemoryGB = totalMemoryBytes / (1024 * 1024 * 1024);
                let memoryUsageGB = memoryUsageBytes / (1024 * 1024 * 1024);

                if (totalMemoryGB >= totalMemoryBytes / (1024 * 1024 * 1024)) {
                    totalMemoryGB = totalMemoryGB.toFixed(2) + ' GB';
                } else {
                    totalMemoryGB = (totalMemoryBytes / (1024 * 1024)).toFixed(2) + ' MB';
                }

                if (memoryUsageGB >= memoryUsageBytes / (1024 * 1024 * 1024)) {
                    memoryUsageGB = memoryUsageGB.toFixed(2) + ' GB';
                } else {
                    memoryUsageGB = memoryUsageBytes / (1024 * 1024).toFixed(2) + ' MB';
                }

                const processors = os.cpus();
                const cpuUsage1 = os.cpus()[0].times;
                const startUsage1 = cpuUsage1.user + cpuUsage1.nice + cpuUsage1.sys + cpuUsage1.irq;
                
                setTimeout(async () => {
                    const cpuUsage2 = os.cpus()[0].times;
                    const endUsage1 = cpuUsage2?.user + cpuUsage2?.nice + cpuUsage2?.sys + cpuUsage2?.irq;
                    const totalUsage = endUsage1 - startUsage1;

                    let idleUsage = 0;
                    let totalIdle = 0;

                    for (let i = 0; i < cpuCount; i++) {
                        const cpuUsage = os.cpus()[i].times;
                        totalIdle += cpuUsage.idle;
                    }

                    idleUsage = totalIdle - (cpuUsage2.idle - cpuUsage1.idle);
                    const cpuUsagePercentage = (totalUsage / (totalUsage + idleUsage)) * 100;
                    const startTime = process.cpuUsage();
                    const endTime = process.cpuUsage();
                    const usedTime = endTime.user - startTime.user + endTime.system - startTime.system;
                    const ping = await client?.db?.ping();

                    const embed1 = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({
                            name: 'FlaMe SECURITY Informations',
                            iconURL: client.guilds.cache.get('873228243757596672')?.members?.cache?.get('1387826587172343990')?.user?.displayAvatarURL({ dynamic: true })
                        })
                        .setDescription(
                            `**__System Informations__**\nPlatform: ${process.platform}\nArchitecture: ${process.arch}\nMemory Usage: ${memoryUsageGB}/${totalMemoryGB}\nProcessor 1:\n> Model: ${processors[0].model}\n> Speed: ${processors[0].speed} MHz\nDatabase Latency: ${ping?.toFixed(2) || '0'}ms`
                        )
                        .setThumbnail(client.user.displayAvatarURL())
                        .setFooter({
                            text: `Requested By ${message.author.tag}`,
                            iconURL: message.author.displayAvatarURL({ dynamic: true })
                        });

                    const updatedButton = new ButtonBuilder(button.data).setDisabled(false);
                    const updatedButton1 = new ButtonBuilder(button1.data).setDisabled(false);
                    const updatedButton2 = new ButtonBuilder(button2.data).setDisabled(true);
                    const updatedButton3 = new ButtonBuilder(button3.data).setDisabled(false);

                    const row1 = new ActionRowBuilder().addComponents([
                        updatedButton,
                        updatedButton1,
                        updatedButton2,
                        updatedButton3
                    ]);

                    await msg.edit({
                        embeds: [embed1],
                        components: [row1]
                    });
                }, 2000);
            }
        });

        collector.on('end', async () => {
            const updatedButton = new ButtonBuilder(button.data).setDisabled(true);
            const updatedButton1 = new ButtonBuilder(button1.data).setDisabled(true);
            const updatedButton2 = new ButtonBuilder(button2.data).setDisabled(true);
            const updatedButton3 = new ButtonBuilder(button3.data).setDisabled(true);

            const row1 = new ActionRowBuilder().addComponents([
                updatedButton,
                updatedButton1,
                updatedButton2,
                updatedButton3
            ]);

            await msg.edit({ components: [row1] }).catch(() => {});
        });
    }
};