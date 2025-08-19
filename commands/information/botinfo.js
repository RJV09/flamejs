const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'botinfo',
  aliases: ['bi', 'about'],
  description: 'Shows information about the bot',
  usage: 'botinfo',
  cooldown: 5,
  category: 'info',
  args: false,
  userPerms: [],
  botPerms: [],
  owner: false,

  run: async (client, message, args, prefix) => {
    // Create buttons using ButtonBuilder
    const srvrc = new ButtonBuilder()
      .setCustomId('srvrc')
      .setLabel(`${client.guilds.cache.size} Guilds`)
      .setStyle('Secondary');

    const usrc = new ButtonBuilder()
      .setCustomId('usrc')
      .setLabel(`${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} Users`)
      .setStyle('Secondary');

    const chc = new ButtonBuilder()
      .setCustomId('chc')
      .setLabel(`${client.channels.cache.size} Channels`)
      .setStyle('Secondary');

    const countRow = new ActionRowBuilder().addComponents(srvrc, usrc, chc);

    const basic = new ButtonBuilder()
      .setCustomId('baseinf')
      .setLabel('Basic Info')
      .setStyle('Secondary');

    const team = new ButtonBuilder()
      .setCustomId('teaminf')
      .setLabel('Team Info')
      .setStyle('Secondary');

    const infoRow = new ActionRowBuilder().addComponents(basic, team);

    // Create the main embed (basic info)
    const e = new EmbedBuilder()
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(`Meet me, **FlaMe**, the all-encompassing bot designed to power up your server in style! With my lightning-fast responses, interactive games, and robust moderation tools, we ensure your community stays engaged, entertained, and safe.`)
      .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .addFields([
        {
          name: 'System Info',
          value: `**Node Version**: ${process.version}\n**Library**: [discord.js](https://discord.js.org)`,
        },
        {
          name: 'Links',
          value: `[Invite](https://discord.com/oauth2/authorize?client_id=1317459455516086292&permissions=8&integration_type=0&scope=bot+applications.commands) | [Support](https://discord.gg/rfzop)`,
        },
      ]);

    // Create the team info embed
    const e2 = new EmbedBuilder()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .addFields([
        {
          name: `<:emoji_1725907392606:1306042605405995138> Developers`,
          value: `<a:Arrow:1321790490970034251> <a:Crown_01_Owner:1323224315272888353> [MUGHAL](https://discord.com/users/1387826587172343990)`,
        },
        {
          name: `<:emoji_1725907392606:1306042605405995138> Owners`,
          value: `<a:Arrow:1321790490970034251> <a:Crown_01_Owner:1323224315272888353> [Flashu](https://discord.com/users/1387826587172343990)\n<a:Arrow:1321790490970034251> <a:Crown_01_Owner:1323224315272888353> [God](https://discord.com/users/979737793402114088)`,
        },
        {
          name: `<:emoji_1725907392606:1306042605405995138> Management`,
          value: `<a:Arrow:1321790490970034251> <a:Crown_01_Owner:1323224315272888353> [Maic](https://discord.com/users/1387826587172343990)`,
        },
      ]);

    // Send the message with embeds and buttons
    const inf = await message.channel.send({ embeds: [e], components: [infoRow, countRow] });

    // Create a component collector to handle button interactions
    const collector = inf.createMessageComponentCollector({
      filter: (interaction) => interaction.user.id === message.author.id,
      time: 60000,
      idle: 60000 / 2,
    });

    // Handle button clicks
    collector.on('collect', async (interaction) => {
      if (!interaction.deferred) await interaction.deferUpdate();

      switch (interaction.customId) {
        case 'baseinf':
          await inf.edit({ embeds: [e] });
          break;

        case 'teaminf':
          await inf.edit({ embeds: [e2] });
          break;

        default:
          break;
      }
    });

    // End the collector and remove components if idle
    collector.on('end', async () => {
      await inf.edit({ components: [countRow] }).catch(() => {});
    });
  },
};
