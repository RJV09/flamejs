const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const wait = require('wait');

module.exports = async (client) => { 

  client.on("guildBanAdd", async (guild, user) => {
    let data2 = await client.data.get(`logs_${guild?.guild?.id}`);
    if (!data2) return;
    if (!data2.modlog) return;
    const channel = data2.modlog;
    const modlog1 = await guild?.guild?.channels.cache.get(channel);
    if (!modlog1) { 
      await client.data.set(`logs_${guild?.guild?.id}`, { 
        voice: data2 ? data2.voice : null,
        channel: data2 ? data2.channel : null,
        rolelog: data2 ? data2.rolelog : null,
        modlog: null,   
        message: data2 ? data2.message : null,
        memberlog: data2 ? data2.memberlog : null
      });
      return;
    }
    const auditLogs = await guild?.guild?.fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN_ADD' });
    const logs = auditLogs.entries.first();
    const { executor, target, createdTimestamp } = logs;
    let difference = Date.now() - createdTimestamp;
    if (difference > 5000) return;
    if (data2) {
      const banEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
        .setAuthor({ name: `${target.username} was banned`, iconURL: target.displayAvatarURL({ dynamic: true }) })
        .addFields({ name: 'Banned By', value: `${executor.tag} (${executor.id})` })
        .setTimestamp();
      await wait(2000);
      await modlog1.send({ embeds: [banEmbed] }).catch((_) => { });
    }
  });

  client.on("guildBanRemove", async (guild, user) => {
    let data2 = await client.data.get(`logs_${guild?.guild?.id}`);
    if (!data2) return;
    if (!data2.modlog) return;
    const channel = data2.modlog;
    const modlog1 = await guild?.guild?.channels.cache.get(channel);
    if (!modlog1) { 
      await client.data.set(`logs_${guild?.guild?.id}`, {
        voice: data2 ? data2.voice : null, 
        channel: data2 ? data2.channel : null,
        rolelog: data2 ? data2.rolelog : null,
        modlog: null,   
        message: data2 ? data2.message : null,
        memberlog: data2 ? data2.memberlog : null
      });
      return;
    }
    const auditLogs = await guild?.guild?.fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN_REMOVE' });
    const logs = auditLogs.entries.first();
    const { executor, target, createdTimestamp } = logs;
    let difference = Date.now() - createdTimestamp;
    if (difference > 5000) return;
    if (data2) {
      const unbanEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
        .setAuthor({ name: `${target.username} was unbanned`, iconURL: target.displayAvatarURL({ dynamic: true }) })
        .addFields({ name: 'Unbanned By', value: `${executor.tag} (${executor.id})` })
        .setTimestamp();
      await wait(2000);
      await modlog1.send({ embeds: [unbanEmbed] }).catch((_) => { });
    }
  });

  client.on("guildMemberRemove", async (member) => {
    let data2 = await client.data.get(`logs_${member.guild.id}`);
    if (!data2) return;
    if (!data2.modlog) return;
    const channel = data2.modlog;
    const modlog1 = await member.guild.channels.cache.get(channel);
    if (!modlog1) { 
      await client.data.set(`logs_${member.guild.id}`, { 
        voice: data2 ? data2.voice : null,
        channel: data2 ? data2.channel : null,
        rolelog: data2 ? data2.rolelog : null,
        modlog: null,   
        message: data2 ? data2.message : null,
        memberlog: data2 ? data2.memberlog : null
      });
      return;
    }
    const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_KICK' });
    const logs = auditLogs.entries.first();
    const { executor, target, createdTimestamp } = logs;
    let difference = Date.now() - createdTimestamp;
    if (difference > 5000) return;
    if (data2) {
      const kickEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: `${member.user.username} was kicked`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields({ name: 'Kicked By', value: `${executor.tag} (${executor.id})` })
        .setTimestamp();
      await wait(2000);
      await modlog1.send({ embeds: [kickEmbed] }).catch((_) => { });
    }
  });
};
