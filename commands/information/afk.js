const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const db = require('../../models/afk.js');

module.exports = {
    name: 'afk',
    description: "Set's You Away From Keyboard",
    category: 'info',
    run: async (client, message, args) => {
        const reason = args.join(' ') ? args.join(' ') : "I'm AFK :)";
        const data = await db.findOne({
            Guild: message.guildId,
            Member: message.author.id,
        });
        if (data) {
            const embed = new EmbedBuilder()
                .setTitle('UwU, you are already AFK.')
                .setColor(client.color);
            return message.channel.send({ embeds: [embed] });
        }
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('server_afk')
                .setLabel('Set Server AFK')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('global_afk')
                .setLabel('Set Global AFK')
                .setStyle(ButtonStyle.Primary),
        );
        const embed = new EmbedBuilder()
            .setDescription(`Your AFK status has yet to be configured. You may opt to set it globally or restrict it to this specific server!`)
            .setColor(client.color);
        const msg = await message.channel.send({ embeds: [embed], components: [row] });
        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });
        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'server_afk') {
                const newData = new db({
                    Guild: message.guildId,
                    Member: message.author.id,
                    Reason: reason,
                    Time: Date.now(),
                });
                await newData.save();
                const embed = new EmbedBuilder()
                    .setDescription(`<a:Tick:1322497754353762314> Your Server AFK status is now set to: **${reason}**`)
                    .setColor(client.color);
                await interaction.update({ embeds: [embed], components: [] });
                collector.stop();
            }
            if (interaction.customId === 'global_afk') {
                const newData = new db({
                    Guild: 'global',
                    Member: message.author.id,
                    Reason: reason,
                    Time: Date.now(),
                });
                await newData.save();

                const embed = new EmbedBuilder()
                    .setDescription(`<a:Tick:1322497754353762314> Your Global AFK status is now set to: **${reason}**`)
                    .setColor(client.color);
                await interaction.update({ embeds: [embed], components: [] });
                collector.stop();
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                const embed = new EmbedBuilder()
                    .setDescription('<a:anxCross2:1321773462699642991> You took too long to respond. Try again later.')
                    .setColor(client.color);
                msg.edit({ embeds: [embed], components: [] });
            }
        });
    },
};