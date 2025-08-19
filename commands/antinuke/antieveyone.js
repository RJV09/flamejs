const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'antieveryone',
    aliases: ['ae'],
    category: 'security',
    premium: true,
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF0000')
                        .setDescription('❌ You need **Manage Server** permission to use this command.')
                ]
            });
        }

        const prefix = client.prefix || '&';
        const option = args[0]?.toLowerCase();
        const subOption = args[1]?.toLowerCase();
        const type = args[2]?.toLowerCase();
        const target = message.mentions.members.first() || message.mentions.roles.first() || message.guild.members.cache.get(args[3]) || message.guild.roles.cache.get(args[3]);
        const currentConfig = await client.db.get(`${message.guild.id}_antieveryone_config`) || {
            enabled: false,
            bypassUsers: [],
            bypassRoles: []
        };
        const helpEmbed = new EmbedBuilder()
            .setColor('#2F3136')
            .setTitle('Anti-Everyone Protection System')
            .setDescription(`Prevent unauthorized @everyone/@here mentions in your server. Current status: ${currentConfig.enabled ? '🟢 Enabled' : '🔴 Disabled'}`)
            .addFields(
                { name: 'Enable Protection', value: `\`${prefix}antieveryone enable\`` },
                { name: 'Disable Protection', value: `\`${prefix}antieveryone disable\`` },
                { name: 'User Bypass', value: `\`${prefix}antieveryone bypass user add/remove @user\`` },
                { name: 'Role Bypass', value: `\`${prefix}antieveryone bypass role add/remove @role\`` },
                { name: 'List Bypasses', value: `\`${prefix}antieveryone bypass list\`` }
            );

        if (!option) return message.channel.send({ embeds: [helpEmbed] });
        switch (option) {
            case 'enable':
                currentConfig.enabled = true;
                await client.db.set(`${message.guild.id}_antieveryone_config`, currentConfig);
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#00FF00')
                            .setDescription('✅ Anti-Everyone protection has been **enabled**')
                    ]
                });

            case 'disable':
                currentConfig.enabled = false;
                await client.db.set(`${message.guild.id}_antieveryone_config`, currentConfig);
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#FF0000')
                            .setDescription('❌ Anti-Everyone protection has been **disabled**')
                    ]
                });

            case 'bypass':
                if (!subOption) return message.channel.send({ embeds: [helpEmbed] });

                switch (subOption) {
                    case 'list':
                        const userList = currentConfig.bypassUsers.length > 0 ?
                            currentConfig.bypassUsers.map(id => `<@${id}>`).join(', ') : 'None';
                        const roleList = currentConfig.bypassRoles.length > 0 ?
                            currentConfig.bypassRoles.map(id => `<@&${id}>`).join(', ') : 'None';

                        return message.channel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('#2F3136')
                                    .setTitle('Current Bypass List')
                                    .addFields(
                                        { name: 'Users with Bypass', value: userList, inline: true },
                                        { name: 'Roles with Bypass', value: roleList, inline: true }
                                    )
                            ]
                        });

                    case 'user':
                    case 'role':
                        if (!['add', 'remove'].includes(type) || !target) {
                            return message.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor('#FF0000')
                                        .setDescription(`Usage: \`${prefix}antieveryone bypass ${subOption} <add/remove> <@user/@role>\``)
                                ]
                            });
                        }

                        const arrayKey = subOption === 'user' ? 'bypassUsers' : 'bypassRoles';
                        const targetId = target.id;

                        if (type === 'add') {
                            if (currentConfig[arrayKey].includes(targetId)) {
                                return message.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor('#FFA500')
                                            .setDescription(`⚠️ ${target} is already in the bypass list!`)
                                    ]
                                });
                            }

                            currentConfig[arrayKey].push(targetId);
                            await client.db.set(`${message.guild.id}_antieveryone_config`, currentConfig);
                            return message.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor('#00FF00')
                                        .setDescription(`✅ Added ${target} to the bypass list!`)
                                ]
                            });
                        } else {
                            if (!currentConfig[arrayKey].includes(targetId)) {
                                return message.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor('#FFA500')
                                            .setDescription(`⚠️ ${target} is not in the bypass list!`)
                                    ]
                                });
                            }

                            currentConfig[arrayKey] = currentConfig[arrayKey].filter(id => id !== targetId);
                            await client.db.set(`${message.guild.id}_antieveryone_config`, currentConfig);
                            return message.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor('#00FF00')
                                        .setDescription(`✅ Removed ${target} from the bypass list!`)
                                ]
                            });
                        }

                    default:
                        return message.channel.send({ embeds: [helpEmbed] });
                }

            default:
                return message.channel.send({ embeds: [helpEmbed] });
        }
    }
};