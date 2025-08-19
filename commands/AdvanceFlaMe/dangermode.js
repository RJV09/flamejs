const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const wait = require('wait');

let enable = `<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131>`;
let disable = `<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812>`;
let protect = `<a:stolen_emoji:1330513586866356254>`;
let hii = `<a:Red_Arrow_Right:1306037499185074218>`;

module.exports = {
    name: 'dangermode',
    aliases: ['dangerwizz', 'dm'],
    category: 'security',
    premium: true,
    run: async (client, message, args) => {
        if (message.guild.memberCount < 1) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | Your server does not meet the requirements for accommodating my 30-member criteria.`)
                ]
            });
        }

        let own = message.author.id === message.guild.ownerId;
        const check = await client.util.isExtraOwner(message.author, message.guild);
        if (!own && !check) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | Only the server owner or an additional owner is authorized to run this command.`)
                ]
            });
        }

        if (!own && !(message.guild.members.cache.get(client.user.id).roles.highest.position <= message.member.roles.highest.position)) {
            const higherole = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.emoji.cross} | Only the server owner or an extra owner with a higher role than mine is authorized to run this command.`);
            return message.channel.send({ embeds: [higherole] });
        }

        let prefix = '&' || message.guild.prefix;
        const option = args[0];
        const isActivatedAlready = await client.db.get(`${message.guild.id}_dangermode`);
        const dangermode = new EmbedBuilder()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(`__**dangermode**__`)
            .setDescription(`Level up your server security with dangermode! It swiftly bans admins engaging in suspicious activities, all while safeguarding your whitelisted members. Enhance protection – enable dangermode now!`)
            .addFields([
                { name: `__**dangermode Enable**__`, value: `To Enable dangermode, Use - \`${prefix}dangermode enable\`` },
                { name: `__**dangermode Disable**__`, value: `To Disable dangermode, Use - \`${prefix}dangermode disable\`` }
            ]);

        if (!option) {
            message.channel.send({ embeds: [dangermode] });
        } else if (option === 'enable') {
            if (isActivatedAlready) {
                const enabnble = new EmbedBuilder()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(client.color)
                    .setDescription(`**Security Settings For ${message.guild.name} ${protect}\nUmm, looks like your server has already enabled security\n\nCurrent Status : ${enable}\nTo Disable use ${prefix}dangermode disable**`);
                message.channel.send({ embeds: [enabnble] });
            } else {
                await client.db.set(`${message.guild.id}_dangermode`, true);
                await client.db.set(`${message.guild.id}_wl`, { whitelisted: [] });
                const enabled = new EmbedBuilder()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setAuthor({ name: `${client.user.username} Security`, iconURL: client.user.displayAvatarURL() })
                    .setColor(client.color)
                    .setDescription(`**Security Settings For ${message.guild.name} ${protect}**\n\n` +
                        `Tip: To optimize the functionality of my Unbypassable Module, please move my role to the top of the roles list.\n\n` +
                        `**__Unbypassable Modules Enabled__**\n` +
                        `**Unbypassable Ban**: <:FlaMe_OP:1321774274406518784> <:FlaMe_OP:1321774246577442826>\n` +
                        `**Unbypassable Unban**: <:FlaMe_OP:1321774274406518784> <:FlaMe_OP:1321774246577442826>\n` +
                        `**Unbypassable Kick**: <:FlaMe_OP:1321774274406518784> <:FlaMe_OP:1321774246577442826>\n` +
                        `**Unbypassable Bot**: <:FlaMe_OP:1321774274406518784> <:FlaMe_OP:1321774246577442826>\n` +
                        `**Unbypassable Link Role**: <:FlaMe_OP:1321774274406518784> <:FlaMe_OP:1321774246577442826>\n` +
                        `**Unbypassable Role Create**: <:FlaMe_OP:1321774274406518784> <:FlaMe_OP:1321774246577442826>\n` +
                        `**Unbypassable Role Delete**: <:FlaMe_OP:1321774274406518784> <:FlaMe_OP:1321774246577442826>\n` +
                        `**Unbypassable Role Update**: <:FlaMe_OP:1321774274406518784> <:FlaMe_OP:1321774246577442826>\n` +
                        `**Unbypassable Member Update**: <:FlaMe_OP:1321774274406518784> <:FlaMe_OP:1321774246577442826>\n` +
                        `**Unbypassable Prune**: <:FlaMe_OP:1321774274406518784> <:FlaMe_OP:1321774246577442826>\n`)
                    .setFooter({ text: `Punishment Type: Ban`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

                let msg = await message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`<a:Tick:1306038825054896209> | **Initializing Light Setup!**`)
                    ]
                });

                const steps = ['**Checking Flame role position for optimal configuration ....', 'Crafting and configuring the Flame Bypass Me role..!**', '**Ensuring precise placement of the Flame Bypass Me...!**', '**Safeguarding your changes...!**', '**Activating the dangermode Modules for enhanced security...!!**'];
                for (const step of steps) {
                    await client.util.sleep(1000);
                    await msg.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`${msg.embeds[0].description}\n${client.emoji.tick} | ${step}`)
                        ]
                    });
                }
                await client.util.sleep(2000);
                await msg.edit({ embeds: [enabled] });

                if (message.guild.roles.cache.size > 249) {
                    return message.reply(`I Won't Able To Create \`Bypass Me\` Cause There Are Already 249 Roles In This Server`);
                }

                let role = message.guild.members.cache.get(client.user.id).roles.highest.position;
                let createdRole = await message.guild.roles.create({
                    name: 'Bypass Me',
                    position: role ? role : 0,
                    reason: 'FlaMe Role For Ubypassable Setup',
                    permissions: [PermissionsBitField.Flags.Administrator],
                    color: '#FF0000'
                });
                await message.guild.members.cache.get(client.user.id).roles.add(createdRole.id);
            }
        } else if (option === 'disable') {
            if (!isActivatedAlready) {
                const dissable = new EmbedBuilder()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(client.color)
                    .setDescription(`**Security Settings For ${message.guild.name} ${protect}\nUmm, looks like your server hasn't enabled security.\n\nCurrent Status: ${disable}\n\nTo Enable use ${prefix}dangermode enable**`);
                message.channel.send({ embeds: [dissable] });
            } else {
                await client.db.get(`${message.guild.id}_wl`).then(async (data) => {
                    const users = data.whitelisted;
                    for (let i = 0; i < users.length; i++) {
                        let data2 = await client.db.get(`${message.guild.id}_${users[i]}_wl`);
                        if (data2) {
                            await client.db.delete(`${message.guild.id}_${users[i]}_wl`);
                        }
                    }
                });
                await client.db.set(`${message.guild.id}_dangermode`, null);
                await client.db.set(`${message.guild.id}_wl`, { whitelisted: [] });
                const disabled = new EmbedBuilder()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(client.color)
                    .setDescription(`**Security Settings For ${message.guild.name} ${protect}\nSuccessfully disabled security settings for this server.\n\nCurrent Status: ${disable}\n\nTo Enable use ${prefix}dangermode enable**`);
                message.channel.send({ embeds: [disabled] });
            }
        } else {
            return message.channel.send({ embeds: [dangermode] });
        }
    }
};