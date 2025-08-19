const { EmbedBuilder, AuditLogEvent, ChannelType } = require("discord.js");
const wait = require('wait');

module.exports = async (client) => {

  client.on("channelCreate", async (channel) => { 
    let data2 = await client.data.get(`logs_${channel.guild.id}`);
    if (!data2) return;
    if (!data2.channel) return;
    const cchannel = data2.channel;
    const channellog = await channel.guild.channels.cache.get(cchannel);

    if (!channellog) { 
      await client.data.set(`logs_${channel.guild.id}`, { 
        voice: data2 ? data2.voice : null,
        channel: null,
        rolelog: data2 ? data2.rolelog : null,
        modlog: data2 ? data2.modlog : null,   
        message: data2 ? data2.message : null,
        memberlog: data2 ? data2.memberlog : null
      });
      return;
    }

    const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelCreate });
    const logs = auditLogs.entries.first();
    const { executor, createdTimestamp } = logs;
    let difference = Date.now() - createdTimestamp;
    if (difference > 5000) return;  
    if (executor.id === client.user.id) return;

    if (data2) {
      const channelType = channel.type === ChannelType.GuildText ? 'TEXT CHANNEL' :
        channel.type === ChannelType.GuildVoice ? 'VOICE CHANNEL' :
        channel.type === ChannelType.GuildCategory ? 'CATEGORY CHANNEL' :
        channel.type === ChannelType.GuildAnnouncement ? 'NEWS CHANNEL' :
        channel.type === ChannelType.GuildStageVoice ? 'STAGE CHANNEL' :
        channel.type === ChannelType.GuildMedia ? 'MEDIA CHANNEL' :
        channel.type === ChannelType.GuildForum ? 'FORUM CHANNEL' : 'UNKNOWN CHANNEL TYPE';

      const channelcreate = new EmbedBuilder()
        .addFields(
          { name: `Channel Name`, value: `${channel.name}` },
          { name: `Channel Mention`, value: `<#${channel.id}>` },
          { name: `Channel Id`, value: `${channel.id}` },
          { name: `Channel Category`, value: ` ${channel.parent ? channel.parent.name : "No Category"}` },
          { name: `Created By`, value: `${executor.tag}\n` },
          { name: `User Id`, value: `${executor.id}` },
          { name: `Time`, value: `<t:${Math.round(channel.createdTimestamp / 1000)}:R>` },
          { name: `Channel Type`, value: `\`${channelType}\`` }
        )
        .setThumbnail(`${executor.displayAvatarURL({ dynamic: true })}`)
        .setColor(client.color)
        .setTimestamp();

      await wait(2000);
      await channellog.send({ embeds: [channelcreate] }).catch(() => { });
    }
  });

  client.on("channelDelete", async (channel) => { 
    let data2 = await client.data.get(`logs_${channel.guild.id}`);
    if (!data2) return;
    if (!data2.channel) return;
    const cchannel = data2.channel;
    const channellog = await channel.guild.channels.cache.get(cchannel);

    if (!channellog) { 
      await client.data.set(`logs_${channel.guild.id}`, { 
        voice: data2 ? data2.voice : null,
        channel: null,
        rolelog: data2 ? data2.rolelog : null,
        modlog: data2 ? data2.modlog : null,   
        message: data2 ? data2.message : null,
        memberlog: data2 ? data2.memberlog : null
      });
      return;
    }

    const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelDelete });
    const logs = auditLogs.entries.first();
    const { executor, createdTimestamp } = logs;
    let difference = Date.now() - createdTimestamp;
    if (difference > 5000) return;  

    if (executor.id === client.user.id) return;

    if (data2) {
      const channelType = channel.type === ChannelType.GuildText ? 'TEXT CHANNEL' :
        channel.type === ChannelType.GuildVoice ? 'VOICE CHANNEL' :
        channel.type === ChannelType.GuildCategory ? 'CATEGORY CHANNEL' :
        channel.type === ChannelType.GuildAnnouncement ? 'NEWS CHANNEL' :
        channel.type === ChannelType.GuildStageVoice ? 'STAGE CHANNEL' :
        channel.type === ChannelType.GuildMedia ? 'MEDIA CHANNEL' :
        channel.type === ChannelType.GuildForum ? 'FORUM CHANNEL' : 'UNKNOWN CHANNEL TYPE';

      const channeldelete = new EmbedBuilder()
        .addFields(
          { name: `Channel Name`, value: `${channel.name}` },
          { name: `Channel Mention`, value: `<#${channel.id}>` },
          { name: `Channel Id`, value: `${channel.id}` },
          { name: `Removed By`, value: `${executor.tag}\n` },
          { name: `User Id`, value: `${executor.id}` },
          { name: `Time`, value: `<t:${Math.round(logs.createdTimestamp / 1000)}:R>` },
          { name: `Channel Type`, value: `\`${channelType}\`` }
        )
        .setThumbnail(`${executor.displayAvatarURL({ dynamic: true })}`)
        .setColor(client.color)
        .setTimestamp();

      await wait(2000);
      await channellog.send({ embeds: [channeldelete] }).catch(() => { });
    }
  });

  client.on("channelUpdate", async (o, n) => {
    let data2 = await client.data.get(`logs_${o.guild.id}`);
    if (!data2) return;
    if (!data2.channel) return;
    const channel = data2.channel;
    const channellog = await o.guild.channels.cache.get(channel);

    if (!channellog) { 
      await client.data.set(`logs_${o.guild.id}`, { 
        voice: data2 ? data2.voice : null,
        channel: null,
        rolelog: data2 ? data2.rolelog : null,
        modlog: data2 ? data2.modlog : null,   
        message: data2 ? data2.message : null,
        memberlog: data2 ? data2.memberlog : null
      });
      return;
    }

    const auditLogs = await n.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelUpdate });
    const logs = auditLogs.entries.first();
    const { executor, createdTimestamp } = logs;
    let difference = Date.now() - createdTimestamp;
    if (difference > 5000) return;  
    if (executor.id === client.user.id) return;

    const oldName = o.name;
    const newName = n.name;
    const oldNsfw = o.nsfw;
    const newNsfw = n.nsfw;
    const oldTopic = o.topic;
    const newTopic = n.topic;
    const oldRtcRegion = o.rtcRegion;
    const newRtcRegion = n.rtcRegion;
    const oldBitrate = o.bitrate;
    const newBitrate = n.bitrate;
    const oldUserLimit = o.userLimit;
    const newUserLimit = n.userLimit;
    const oldVideoQualityMode = o.videoQualityMode;
    const newVideoQualityMode = n.videoQualityMode;
    const oldCooldown = o.rateLimitPerUser;
    const newCooldown = n.rateLimitPerUser;

    const oldBitrateValue = o.bitrate / 1000;
    const newBitrateValue = n.bitrate / 1000;

    if (data2) {
      const channelupdate = new EmbedBuilder()
        .setTimestamp()
        .setDescription(`${o.type === 'GUILD_TEXT' ? 'Text' : 'Voice'} Channel <#${n.id}> updated by ${executor.tag}\n`)
        .setColor(client.color);

      if (oldName !== newName) channelupdate.addFields({ name: 'Channel Renamed', value: `\`${oldName}\` -> \`${newName}\``, inline: false });
      if (oldNsfw !== newNsfw) channelupdate.addFields({ name: 'Channel NSFW State Updated', value: `\`${oldNsfw}\` -> \`${newNsfw}\``, inline: false });
      if (oldCooldown !== newCooldown) channelupdate.addFields({ name: 'Channel Slowmode Updated', value: `\`${oldCooldown} seconds\` -> \`${newCooldown} seconds\``, inline: false });
      if (oldTopic !== newTopic) channelupdate.addFields({ name: 'Channel Topic Updated', value: `\`${oldTopic || 'No Topic'}\` -> \`${newTopic || 'No Topic'}\``, inline: false });
      if (oldRtcRegion !== newRtcRegion) channelupdate.addFields({ name: 'Channel Voice Region Updated', value: `\`${oldRtcRegion || 'None'}\` -> \`${newRtcRegion || 'None'}\``, inline: false });
      if (oldBitrate !== newBitrate) channelupdate.addFields({ name: 'Channel Voice Bitrate Updated', value: `\`${oldBitrateValue} Kbps\` -> \`${newBitrateValue} Kbps\``, inline: false });
      if (oldUserLimit !== newUserLimit) channelupdate.addFields({ name: 'Channel Voice UserLimit Updated', value: `\`${oldUserLimit} users\` -> \`${newUserLimit} users\``, inline: false });

      channelupdate.addFields({ name: 'Updated At', value: `<t:${Math.round(logs.createdTimestamp / 1000)}:R>`, inline: false });

      await wait(2000);
      await channellog.send({ embeds: [channelupdate] }).catch(() => { });
    }
  });

};
