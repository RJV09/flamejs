const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
    Collection,
    WebhookClient
} = require('discord.js');
const ChatbotConfig = require('../models/ChatbotConfig');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const GuildNoPrefix = require('../models/noprefix.js');

module.exports = async (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const channelId = await client.db.get(`chatban_${message.guild.id}_${message.author.id}`);
        if (channelId && message.channel.id === channelId) {
            try {
                await message.delete();
                
                try {
                    await message.author.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(
                                    `You are currently chatbanned and cannot send messages in <#${channelId}> in **${message.guild.name}**.`
                                ),
                        ],
                    });
                } catch (err) {
                    console.error(`Could not DM user: ${err.message}`);
                }
            } catch (err) {
                console.error(`Error while deleting message: ${err.message}`);
            }
            return;
        }
        if (!message.guild || message.author.bot) return;
        try {
            const guildData = await GuildNoPrefix.findOne({ guildId: message.guild.id });
            if (guildData && guildData.users.includes(message.author.id)) {
                const args = message.content.trim().split(/ +/g);
                const cmd = args.shift().toLowerCase();
                const command = client.commands.get(cmd) || client.commands.find(c => c.aliases?.includes(cmd));

                if (command) {
                    return command.run(client, message, args);
                }
            }
        } catch (error) {
            console.error('Error in no-prefix handler:', error);
        }

        if (message.author.bot || !message.guild) return;
        
        try {
            let check = await client.util.BlacklistCheck(message?.guild);
            if (check) return;
            
            let uprem = await client.db.get(`uprem_${message.author.id}`);
            let upremend = await client.db.get(`upremend_${message.author.id}`);
            let sprem = await client.db.get(`sprem_${message.guild.id}`);
            let spremend = await client.db.get(`spremend_${message.guild.id}`);

            let scot = 0;
            let slink = 'https://discord.gg/zB6qdkETXr';
            const premrow = new ActionRowBuilder();
            
            if (upremend && Date.now() >= upremend) {
                let upremcount = (await client.db.get(`upremcount_${message.author.id}`)) || 0;
                let upremserver = (await client.db.get(`upremserver_${message.author.id}`)) || [];

                await client.db.delete(`upremcount_${message.author.id}`);
                await client.db.delete(`uprem_${message.author.id}`);
                await client.db.delete(`upremend_${message.author.id}`);
                
                if (upremserver.length > 0) {
                    for (let i = 0; i < upremserver.length; i++) {
                        scot += 1;
                        await client.db.delete(`sprem_${upremserver[i]}`);
                        await client.db.delete(`spremend_${upremserver[i]}`);
                        await client.db.delete(`spremown_${upremserver[i]}`);
                    }
                }
                
                await client.db.delete(`upremserver_${message.author.id}`);
                message.author.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#0x2b2d31`)
                            .setDescription(
                                `Your Premium Has Got Expired.\nTotal **\`${scot}\`** Servers [Premium](https://discord.gg/zB6qdkETXr) was removed.\nClick [here](https://discord.gg/zB6qdkETXr) To Buy [Premium](https://discord.gg/zB6qdkETXr).`
                            )
                    ],
                    components: [premrow]
                }).catch((err) => {});
            }

            if (spremend && Date.now() >= spremend) {
                let scount = 0;
                let us = await client.db.get(`spremown_${message.guild.id}`);
                let upremserver = (await client.db.get(`upremserver_${us}`)) || [];
                let upremcount = (await client.db.get(`upremcount_${us}`)) || 0;
                let spremown = await client.db.get(`spremown_${message.guild.id}`).then((r) => client.db.get(`upremend_${r}`));

                await client.db.delete(`sprem_${message.guild.id}`);
                await client.db.delete(`spremend_${message.guild.id}`);

                if (spremown && Date.now() > spremown) {
                    await client.db.delete(`upremcount_${us}`);
                    await client.db.delete(`uprem_${us}`);
                    await client.db.delete(`upremend_${us}`);

                    for (let i = 0; i < upremserver.length; i++) {
                        scount += 1;
                        await client.db.delete(`sprem_${upremserver[i]}`);
                        await client.db.delete(`spremend_${upremserver[i]}`);
                        await client.db.delete(`spremown_${upremserver[i]}`);
                    }
                    
                    try {
                        await client.users.cache.get(`${us}`).send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`#0x2b2d31`)
                                    .setDescription(
                                        `Your Premium Has Got Expired.\nTotal **\`${scount}\`** Servers [Premium](https://discord.gg/zB6qdkETXr) was removed.\nClick [here](https://discord.gg/zB6qdkETXr) To Buy [Premium](https://discord.gg/zB6qdkETXr).`
                                    )
                            ],
                            components: [premrow]
                        }).catch((er) => {});
                    } catch (errors) {}
                }
                
                await client.db.delete(`upremserver_${us}`);
                await client.db.delete(`spremown_${message.guild.id}`);
                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#0x2b2d31`)
                            .setDescription(
                                `The Premium Of This Server Has Got Expired.\nClick [here](https://discord.gg/zB6qdkETXr) To Buy [Premium](https://discord.gg/zB6qdkETXr).`
                            )
                    ],
                    components: [premrow]
                }).catch((err) => {});
            }
            
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel(`Invite Me`)
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`),
                new ButtonBuilder()
                    .setLabel(`Support`)
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://discord.com/invite/flame`)
            );

            client.util.setPrefix(message, client);
            client.util.noprefix();
            client.util.blacklist();

            let blacklistdb = client.blacklist || [];
            if (blacklistdb.includes(message.author.id) && !client.config.owner.includes(message.author.id)) {
                return;
            }

            let user = await client.users.fetch(`375394379629592576`);
            if (message.content === `<@${client.user.id}>`) {
                client.util.setPrefix(message, client);
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setTitle(message.guild.name)
                            .setDescription(
                                `Hey ${message.author},\nMy Prefix here is: \`${message.guild.prefix}\`\nServer Id: \`${message.guild.id}\`\n\n**Type \`${message.guild.prefix}help\`** To Get The Command List.`
                            )
                            .setFooter({
                                text: `Developed By MUGHAL</> `,
                                iconURL: user.displayAvatarURL({ dynamic: true })
                            })
                    ],
                    components: [row]
                });
            }
            
            let prefix = message.guild.prefix || '&';
            let datab = client.noprefix || [];
            
            // Fixed the if condition that was causing the syntax error
            if (!datab.includes(message.author.id)) {
                if (!message.content.startsWith(prefix)) return;
            }

            const args = datab.includes(message.author.id) === false
                ? message.content.slice(prefix.length).trim().split(/ +/)
                : message.content.startsWith(prefix) === true
                    ? message.content.slice(prefix.length).trim().split(/ +/)
                    : message.content.trim().split(/ +/);

            const cmd = args.shift().toLowerCase();
            const command = client.commands.get(cmd) || client.commands.find(c => c.aliases && c.aliases.includes(cmd));

            if (!command) return;
            
            const hasAgreed = await client.db.get(`terms_agreed_${message.author.id}`);
            if (!hasAgreed && !client.config.owner.includes(message.author.id)) {
                const termsEmbed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle('📄 FlaMe Bot Terms of Use & DMCA License Agreement')
                    .setDescription(`
Before using commands, please review and agree to the following:

By clicking Yes, you confirm that you agree to the following:
<a:offline:1322878627620196402> You will follow FlaMe Bot's rules and use it respectfully.
<a:offline:1322878627620196402> You understand this bot may collect minimal data (like user ID, timestamps, and command usage) for functionality and abuse prevention.

<a:offline:1322878627620196402> **Warning**: FlaMe Bot's name, commands, logic, branding, description and features are protected by copyright.
Any attempt to copy, clone, or imitate FlaMe Bot may result in a DMCA takedown, Discord Terms of Service enforcement, and legal action.
WE'RE NOT RESPONSIBLE FOR ANY ACTION TAKEN ON YOU IF YOU MISUSE FlaMe AND GO AGAINST OUR TOS/PRIVACY POLICY

If you do not agree, you will not be allowed to use the bot's commands.
                    `);

                const termsButtons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('terms_agree')
                            .setLabel('Yes, I Agree')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('terms_disagree')
                            .setLabel('No, I Do Not Agree')
                            .setStyle(ButtonStyle.Danger)
                    );

                const termsMessage = await message.channel.send({
                    embeds: [termsEmbed],
                    components: [termsButtons]
                });

                const filter = i => i.user.id === message.author.id;
                const collector = termsMessage.createMessageComponentCollector({ filter, time: 60000 });

                collector.on('collect', async i => {
                    if (i.customId === 'terms_agree') {
                        await client.db.set(`terms_agreed_${message.author.id}`, true);
                        await i.update({
                            content: '<:VERIFICAR:1337589557264252968> You have agreed to the terms and can now use commands.',
                            embeds: [],
                            components: []
                        });
                        collector.stop();
                    } else if (i.customId === 'terms_disagree') {
                        await i.update({
                            content: '<a:anxCross2:1321773462699642991> You must agree to the terms to use commands.',
                            embeds: [],
                            components: []
                        });
                        collector.stop();
                    }
                });

                collector.on('end', collected => {
                    if (collected.size === 0) {
                        termsMessage.edit({
                            content: '<a:offline:1322878627620196402> You did not respond in time. Please try the command again.',
                            embeds: [],
                            components: []
                        });
                    }
                });

                return;
            }

            const ignore = (await client.db?.get(`ignore_${message.guild.id}`)) ?? { channel: [], role: [] };
            if (ignore.channel.includes(message.channel.id) && 
                !message.member.roles.cache.some((role) => ignore.role.includes(role.id))) {
                console.log(`Command '${cmd}' ignored in channel ${message.channel.name} (${message.channel.id}) of guild ${message.guild.name} (${message.guild.id})`);
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(
                                `This channel is currently in my ignore list, so commands can't be executed here. Please try another channel or reach out to the server administrator for assistance.`
                            )
                    ]
                }).then((x) => {
                    setTimeout(() => x.delete(), 3000);
                });
            }

            message.guild.prefix = prefix || '&';
            const commandLimit = 3;
            
            if (client.config.cooldown && !client.config.owner.includes(message.author.id)) {
                if (!client.cooldowns.has(command.name)) {
                    client.cooldowns.set(command.name, new Collection());
                }
                
                const now = Date.now();
                const timestamps = client.cooldowns.get(command.name);
                const cooldownAmount = (command.cooldown ? command.cooldown : 3) * 1000;
                
                if (timestamps.has(message.author.id)) {
                    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                        let commandCount = timestamps.get(`${message.author.id}_count`) || 0;
                        commandCount++;
                        timestamps.set(`${message.author.id}_count`, commandCount);

                        if (commandCount > commandLimit) {
                            let blacklistedUsers = (await client.data.get(`blacklist_${client.user.id}`)) || [];
                            if (!blacklistedUsers.includes(message.author.id)) {
                                blacklistedUsers.push(message.author.id);
                                await client.data.set(`blacklist_${client.user.id}`, blacklistedUsers);
                                client.util.blacklist();
                            }
                            
                            const ricky = new EmbedBuilder()
                                .setColor(client.color)
                                .setTitle('Blacklisted for Spamming')
                                .setDescription(
                                    `You have been blacklisted for spamming commands. Please refrain from such behavior.`
                                )
                                .addFields(
                                    { name: 'Support Server', value: '[Join our support server](https://discord.gg/rfzop)', inline: true }
                                )
                                .setTimestamp();

                            return message.channel.send({ embeds: [ricky] });
                        }
                        
                        return message.channel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(
                                        `Please wait, this command is on cooldown for \`${timeLeft.toFixed(1)}s\``
                                    )
                            ]
                        }).then((msg) => {
                            setTimeout(() => msg.delete().catch((e) => {}), 5000);
                        });
                    }
                }
                
                timestamps.set(message.author.id, now);
                timestamps.set(`${message.author.id}_count`, 1);
                setTimeout(() => {
                    timestamps.delete(message.author.id);
                    timestamps.delete(`${message.author.id}_count`);
                }, cooldownAmount);
            }
            
            try {
                await command.run(client, message, args);
                if (command && command.run) {
                    const weboo = new WebhookClient({
                        url: `https://discord.com/api/webhooks/1337490254902329475/o-d1173tNkJLqSahJ8QvXrnJohWBFtu40CaR4dr8a3IvSTrvBsg5njjo-nz39oELGwZu`
                    });
                    
                    const commandlog = new EmbedBuilder()
                        .setAuthor({
                            name: message.author.tag, 
                            iconURL: message.author.displayAvatarURL({ dynamic: true })
                        })
                        .setColor(client.color)
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()
                        .setDescription(
                            `Command Ran In: \`${message.guild.name} | ${message.guild.id}\`\n` +
                            `Command Ran In Channel: \`${message.channel.name} | ${message.channel.id}\`\n` +
                            `Command Name: \`${command.name}\`\n` +
                            `Command Executor: \`${message.author.tag} | ${message.author.id}\`\n` +
                            `Command Content: \`${message.content}\``
                        );
                    
                    await weboo.send({
                        embeds: [commandlog]
                    }).catch(console.error);
                }
            } catch (err) {
                console.error('An error occurred:', err);
                if (err.code === 429) {
                    await client.util.handleRateLimit();
                }
                return;
            }
        } catch (err) {
            console.error('An error occurred:', err);
            if (err.code === 429) {
                await client.util.handleRateLimit();
            }
            return;
        }
    });
const { EmbedBuilder } = require('discord.js');

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    const config = await ChatbotConfig.findOne({ guildId: message.guild.id });
    if (!config) return;
    if (message.channel.id !== config.channelId) return;
    const lowerContent = message.content.toLowerCase();
    const containsLink = /(https?:\/\/[^\s]+|discord\.gg\/[^\s]+)/.test(lowerContent);

    if (containsLink || lowerContent.includes("spam") || lowerContent.includes("attack")) {
        return message.reply("⚠️ I won't respond to messages that contain links or spam requests.");
    }
    message.channel.sendTyping().catch(() => {});
    config.conversation.push({ role: 'user', content: message.content });
    let aiReply = null;
    try {
        const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.2-3b-instruct:free',
                messages: config.conversation
            })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
                aiReply = data.choices[0].message.content;
            }
        } else {
            console.warn('First API failed:', await response.text());
        }
        if (!aiReply) {
            console.log("⚠️ Trying backup API...");
            const backupResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'google/gemma-3-27b-it:free',
                    messages: config.conversation
                })
            });
            if (backupResponse.ok) {
                const backupData = await backupResponse.json();
                if (backupData.choices && backupData.choices.length > 0) {
                    aiReply = backupData.choices[0].message.content;
                }
            } else {
                console.error('Backup API failed:', await backupResponse.text());
            }
        }
        if (!aiReply) {
            return message.reply("❌ Sorry, both AI services failed to respond.");
        }
        config.conversation.push({ role: 'assistant', content: aiReply });
        if (config.conversation.length > 20) {
            config.conversation = config.conversation.slice(-20);
        }
        await config.save();
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setAuthor({ name: 'FlaMe AI Reply', iconURL: client.user.displayAvatarURL() })
            .setDescription(aiReply)
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    } catch (err) {
        console.error('Error handling AI request:', err);
        message.reply('⚠️ Error reaching AI services.').catch(console.error);
    }
});
};