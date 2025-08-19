const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        const prefix = message.guild?.prefix || '&';
        const selectMenu1 = new SelectMenuBuilder()
            .setCustomId('categorySelect1')
            .setPlaceholder('> FlaMe Get Started!')
            .addOptions([
                { label: 'AdvanceFlaMe', value: 'unbypassable', description: 'Commands related to Advance Security' },
                { label: 'AntiNuke', value: 'antinuke', description: 'Commands related to AntiNuke' },
                { label: 'Moderation', value: 'mod', description: 'Commands related to Moderation' },
                { label: 'Utility', value: 'info', description: 'Utility commands' },
                { label: 'Welcomer', value: 'welcomer', description: 'Commands for Welcomer' },
                { label: 'Voice', value: 'voice', description: 'Commands related to Voice' },
                { label: 'Server Owner', value: 'svowner', description: 'Commands related to Server Owner' },
                { label: 'Create2join', value: 'j2c', description: 'Commands related join2create' },
            ]);
        const selectMenu2 = new SelectMenuBuilder()
            .setCustomId('categorySelect2')
            .setPlaceholder('> Continue!')
            .addOptions([
                { label: 'Logging', value: 'logging', description: 'Commands for Logging' },
                { label: 'Automod', value: 'automod', description: 'Commands for Automod' },
                { label: 'Custom Role', value: 'reqrole', description: 'Commands for Custom Roles' },
                { label: 'Giveaway', value: 'giveaway', description: 'Commands for Giveaway' },
                { label: 'Autoresponder', value: 'autoresponder', description: 'Commands for AutoResponder' },
                { label: 'Ticket', value: 'ticket', description: 'Commands for Ticket' },
                { label: 'Sticky', value: 'sky', description: 'Commands for Sticky Messages' },
            ]);
        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setLabel('Support').setStyle(ButtonStyle.Link).setURL('https://discord.gg/rfzop'),
                new ButtonBuilder().setLabel('Home').setCustomId('homeButton').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setLabel('Delete').setCustomId('deleteButton').setStyle(ButtonStyle.Danger)
            );
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(
                `Hello! I'm FlaMe, your Ultimate Multipurpose server management and security bot with powerful features.\n\n<a:emoji_1725906973559:1306048925907681310> Prefix for this server: \`${prefix}\`\n<a:emoji_1725906973559:1306048925907681310> Type \`${prefix}antinuke enable\` to get started up!\n<a:emoji_1725906973559:1306048925907681310> Total Commands: \`310\`\n`
            )
            .addFields(
                { name: '__Main Modules__', value: `
<a:emoji_1725906102472:1306041362466078730> **Advance FlaMe**\n <:stolen_emoji:1330511886525005824> **AntiNuke**\n<:stolen_emoji:1330511950039482418> **Moderation**\n<:stolen_emoji:1330512083216764939> **Utility**\n<:stolen_emoji:1330512163751854113> **Welcomer**\n<:stolen_emoji:1330512244231897161> **Giveaway**\n<:stolen_emoji:1330512301811437581> **Fun**\n<:stolen_emoji:1330512134643388447> **Voice**\n<:stolen_emoji:1330512109477560394> **Custom Role**\n<:stolen_emoji:1330512187642613770> **Logging**\n<:stolen_emoji:1330511989084258465> **Automod**\n<:stolen_emoji:1330512213273743422>  **AutoResponder**\n<:stolen_emoji:1330512134643388447> **Join To Create**\n<:stolen_emoji:1330512134643388447> **Sticky**\n<:stolen_emoji:1330512134643388447> **Guilnoprefix**\n<:stolen_emoji:1330512134643388447> **ServerOwner**\n<:stolen_emoji:1330512134643388447> **Counting**\n<:stolen_emoji:1330512134643388447> **Appeals**\n<:stolen_emoji:1330512134643388447> **Ai**\n<:stolen_emoji:1330512134643388447> **Reaction Role**
`, inline: true },
            )
            .setFooter({
                text: 'Developed by Mughal </>',
                iconURL: client.user.displayAvatarURL()
            });
        const helpMessage = await message.channel.send({
            embeds: [embed],
            components: [actionRow, new ActionRowBuilder().addComponents(selectMenu1), new ActionRowBuilder().addComponents(selectMenu2)]
        });
        const collector = helpMessage.createMessageComponentCollector({
            filter: (i) => i.user.id === message.author.id,
            time: 6000000
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'deleteButton') {
                await helpMessage.delete();
                return;
            }

            if (i.customId === 'homeButton' || i.values?.[0] === 'home') {
                await i.deferUpdate();
                return helpMessage.edit({
                    embeds: [embed],
                    components: [actionRow, new ActionRowBuilder().addComponents(selectMenu1), new ActionRowBuilder().addComponents(selectMenu2)]
                });
            }

            await i.deferUpdate();

            let category = i.values[0];
            let commands = [];
            const subcommands = {
            };
            if (i.customId === 'categorySelect1') {
                if (category === 'all') {
                    commands = client.commands.map((x) => `\`${x.name}\``);
                } else {
                    const categoryMap = {
                        unbypassable: 'unbypassable',
                        antinuke: 'security',
                        mod: 'mod',
                        info: 'info',
                        welcomer: 'welcomer',
                        voice: 'voice',
                        svowner: 'svowner',
                        j2c: 'j2c',
                    };
                    const filteredCategory = categoryMap[category];
                    commands = client.commands
                        .filter((x) => x.category === filteredCategory)
                        .map((x) => `\`${x.name}\``);
                }
            }
            if (i.customId === 'categorySelect2') {
                const extraCategoryMap = {
                    logging: 'logging',
                    automod: 'automod',
                    reqrole: 'reqrole',
                    giveaway: 'giveaway',
                    autoresponder: 'autoresponder',
                    ticket: 'ticket',
                    fun: 'fun',
                };
                const filteredCategory = extraCategoryMap[category];
                commands = client.commands
                    .filter((x) => x.category === filteredCategory)
                    .map((x) => `\`${x.name}\``);
            }
            let categoryEmbed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`**${category.charAt(0).toUpperCase() + category.slice(1)} Commands**\n${commands.join(', ')}`);

            if (subcommands[category]) {
                categoryEmbed.addFields({ name: 'Subcommands', value: subcommands[category].join('\n') });
            }

            helpMessage.edit({
                embeds: [categoryEmbed],
                components: [actionRow, new ActionRowBuilder().addComponents(selectMenu1), new ActionRowBuilder().addComponents(selectMenu2)]
            });
        });
        collector.on('end', collected => {
            if (collected.size === 0) {
                helpMessage.edit({ components: [] });
            }
        });
    }
};