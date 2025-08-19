const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const wait = require('node:util').promisify(setTimeout);

module.exports = async (client) => {
  client.on('roleCreate', async (role) => {
    let data2 = await client.data.get(`logs_${role.guild.id}`);
    if (!data2 || !data2.rolelog) return;
    
    const rolelog = role.guild.channels.cache.get(data2.rolelog);
    if (!rolelog) {
      await client.data.set(`logs_${role.guild.id}`, { ...data2, rolelog: null });
      return;
    }

    const auditLogs = await role.guild.fetchAuditLogs({ limit: 1, type: 30 });
    const logs = auditLogs.entries.first();
    if (!logs) return;
    
    const { executor, createdTimestamp } = logs;
    if (Date.now() - createdTimestamp > 5000) return;

    const roleCreateEmbed = new EmbedBuilder()
      .setAuthor({ name: `${executor.tag}`, iconURL: executor.displayAvatarURL({ dynamic: true }) })
      .setTitle(`Role Created: ${role.name}`)
      .setDescription(`**Role Information:**\n\n` +
        `- Role Name: ${role.name}\n` +
        `- Role ID: ${role.id}\n` +
        `- Displayed separately: ${role.hoist ? 'Yes' : 'No'}\n` +
        `- Mentionable: ${role.mentionable ? 'Yes' : 'No'}\n` +
        `- Created By: ${executor.tag} (${executor.id})\n\n` +
        `**Role Permissions:**\n\n` +
        `${role.permissions.toArray().map((perm) => `- ${perm}`).join('\n')}`)
      .setColor(`#000000`)
      .setThumbnail(executor.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `${role.guild.name}`, iconURL: role.guild.iconURL({ dynamic: true }) })
      .setTimestamp();

    await wait(2000);
    await rolelog.send({ embeds: [roleCreateEmbed] }).catch(() => {});
  });

  client.on('roleDelete', async (role) => {
    let data2 = await client.data.get(`logs_${role.guild.id}`);
    if (!data2 || !data2.rolelog) return;
    
    const rolelog = role.guild.channels.cache.get(data2.rolelog);
    if (!rolelog) {
      await client.data.set(`logs_${role.guild.id}`, { ...data2, rolelog: null });
      return;
    }

    const auditLogs = await role.guild.fetchAuditLogs({ limit: 1, type: 32 });
    const logs = auditLogs.entries.first();
    if (!logs) return;
    
    const { executor, createdTimestamp } = logs;
    if (Date.now() - createdTimestamp > 5000) return;

    const roleDeleteEmbed = new EmbedBuilder()
      .setAuthor({ name: `Role Deleted`, iconURL: executor.displayAvatarURL({ dynamic: true }) })
      .setTitle(`Role: ${role.name}`)
      .setDescription(`**Role Information:**\n\n` +
        `- Role Name: ${role.name}\n` +
        `- Role ID: ${role.id}\n` +
        `- Deleted By: ${executor.tag} (${executor.id})\n\n` +
        `**Role Permissions:**\n\n` +
        `${role.permissions.toArray().map((perm) => `- ${perm}`).join('\n')}`)
      .setColor(`#ff0000`)
      .setThumbnail(executor.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `${role.guild.name}`, iconURL: role.guild.iconURL({ dynamic: true }) })
      .setTimestamp();

    await wait(2000);
    await rolelog.send({ embeds: [roleDeleteEmbed] }).catch(() => {});
  });

  client.on('roleUpdate', async (o, n) => {
    let data2 = await client.data.get(`logs_${o.guild.id}`);
    if (!data2 || !data2.rolelog) return;
    
    const rolelog = o.guild.channels.cache.get(data2.rolelog);
    if (!rolelog) {
      await client.data.set(`logs_${o.guild.id}`, { ...data2, rolelog: null });
      return;
    }

    const auditLogs = await n.guild.fetchAuditLogs({ limit: 1, type: 31 });
    const logs = auditLogs.entries.first();
    if (!logs) return;
    
    const { executor, createdTimestamp } = logs;
    if (Date.now() - createdTimestamp > 5000) return;

    const roleUpdateEmbed = new EmbedBuilder()
      .setAuthor({ name: 'Role Update', iconURL: executor.displayAvatarURL({ dynamic: true }) })
      .setTitle(`Role Updated: ${o.name}`)
      .setDescription(`Role: ${o}\n\nRole ID: ${o.id}\n\nExecutor: ${executor.tag} (${executor.id})\n`)
      .setColor(`#ffcc00`)
      .setThumbnail(executor.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: n.guild.name, iconURL: n.guild.iconURL({ dynamic: true }) })
      .setTimestamp();
    
    if (o.name !== n.name) roleUpdateEmbed.addFields({ name: 'Name', value: `Old: \`${o.name}\` → New: \`${n.name}\``, inline: false });
    if (o.color !== n.color) roleUpdateEmbed.addFields({ name: 'Color', value: `Old: \`${o.color}\` → New: \`${n.color}\``, inline: false });
    if (o.mentionable !== n.mentionable) roleUpdateEmbed.addFields({ name: 'Mentionable', value: `Old: \`${o.mentionable}\` → New: \`${n.mentionable}\``, inline: false });

    await wait(2000);
    await rolelog.send({ embeds: [roleUpdateEmbed] }).catch(() => {});
  });
};
