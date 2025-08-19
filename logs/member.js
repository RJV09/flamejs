const { EmbedBuilder } = require("discord.js");
const wait = require("node:util").promisify(setTimeout);

module.exports = async (client) => {

  client.on("guildMemberAdd", async (member) => {
    let data2 = await client.data.get(`logs_${member.guild.id}`);
    if (!data2 || !data2.memberlog) return;
    const channel = data2.memberlog;
    const memberlogs = member.guild.channels.cache.get(channel);

    if (!memberlogs) {
      await client.data.set(`logs_${member.guild.id}`, {
        voice: data2.voice || null,
        channel: data2.channel || null,
        rolelog: data2.rolelog || null,
        modlog: data2.modlog || null,
        message: data2.message || null,
        memberlog: null
      });
      return;
    }

    const memberAddEmbed = new EmbedBuilder()
      .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setColor(client.color)
      .setDescription(`A new member has joined the server.\nAccount created at <t:${Math.round(member.user.createdTimestamp / 1000)}:R>`)
      .addFields({ name: "Member ID", value: member.id });

    if (member.roles.cache.size > 0) {
      const addedRoles = member.roles.cache.map(role => `<@&${role.id}>`).join(', ');
      memberAddEmbed.addFields({ name: "Added Roles", value: addedRoles });
    }

    memberAddEmbed.setTimestamp();
    await wait(2000);
    await memberlogs.send({ embeds: [memberAddEmbed] }).catch(() => { });
  });

  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    let data2 = await client.data.get(`logs_${oldMember.guild.id}`);
    if (!data2 || !data2.memberlog) return;
    const channel = data2.memberlog;
    const memberlogs = oldMember.guild.channels.cache.get(channel);

    if (!memberlogs) {
      await client.data.set(`logs_${oldMember.guild.id}`, {
        voice: data2.voice || null,
        channel: data2.channel || null,
        rolelog: data2.rolelog || null,
        modlog: data2.modlog || null,
        message: data2.message || null,
        memberlog: null
      });
      return;
    }

    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    const oldTopRole = oldMember.roles.highest;
    const newTopRole = newMember.roles.highest;

    if (addedRoles.size > 0 || removedRoles.size > 0 || oldTopRole.id !== newTopRole.id) {
      const roleUpdateEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
        .setDescription("**Member Role Update**");

      if (addedRoles.size > 0) {
        roleUpdateEmbed.addFields({ name: "Added Roles", value: addedRoles.map(role => `<@&${role.id}>`).join(', ') });
      }
      if (removedRoles.size > 0) {
        roleUpdateEmbed.addFields({ name: "Removed Roles", value: removedRoles.map(role => `<@&${role.id}>`).join(', ') });
      }
      if (oldTopRole.id !== newTopRole.id) {
        roleUpdateEmbed.addFields({ name: "Top Role Update", value: `Old Top Role: <@&${oldTopRole.id}>\nNew Top Role: <@&${newTopRole.id}>` });
      }

      roleUpdateEmbed.addFields(
        { name: "Member", value: `<@${newMember.id}>`, inline: true },
        { name: "Member ID", value: newMember.id, inline: true }
      ).setTimestamp();

      await wait(2000);
      await memberlogs.send({ embeds: [roleUpdateEmbed] }).catch(() => { });
    }
  });

  client.on("guildMemberRemove", async (member) => {
    let data2 = await client.data.get(`logs_${member.guild.id}`);
    if (!data2 || !data2.memberlog) return;
    const channel = data2.memberlog;
    const memberlogs = member.guild.channels.cache.get(channel);

    if (!memberlogs) {
      await client.data.set(`logs_${member.guild.id}`, {
        voice: data2.voice || null,
        channel: data2.channel || null,
        rolelog: data2.rolelog || null,
        modlog: data2.modlog || null,
        message: data2.message || null,
        memberlog: null
      });
      return;
    }

    const memberRemoveEmbed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`${member} left the server.\nAccount created at <t:${Math.round(member.user.createdTimestamp / 1000)}:R>`)
      .setTimestamp()
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields({ name: "Member ID", value: member.id });

    await wait(2000);
    await memberlogs.send({ embeds: [memberRemoveEmbed] }).catch(() => { });
  });
};
