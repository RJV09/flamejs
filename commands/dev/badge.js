/** @format */
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'bdg',
  aliases: ['bg'],
  description: 'Add/Remove badges from a user',
  category: 'developer',
  args: true,
  usage: 'bdg <add/remove> <user> <badge>',
  userPerms: [],
  botPerms: [],
  owner: true,
  run: async (client, message, args, prefix) => {
    if (args[0] === 'list' || args[0] === 'show' || args[0] === 'badges') {
      const badgeList = [
        'owner',
        'developer',
        'friend',
        'partner',
        'early supporter',
        'staff',
        'contributor',
        'beta tester',
        'bug hunter'
      ];

      return message.channel.send({embeds: [new EmbedBuilder().setDescription(`**Available Badges:**\n${badgeList.map(badge => `- ${badge}`).join('\n')}`)]});
    }
    let id = message.mentions.members.first()?.user.id ||
        args[1]?.replace(/[^0-9]/g, '');
  
    let user = id
      ? await client.users.fetch(id, { force: true }).catch((err) => {})
      : null;
  
    if (!user) {
      return message.channel.send({embeds: [new EmbedBuilder().setDescription(`**Error**: Invalid user mentioned!`)]});
    }

    let badges = await client.db.get(`bdg_${user.id}`) ? await client.db.get(`bdg_${user.id}`) : [];
    if (args[0] === 'add' || args[0] === '+') {
      let bdg = args[2];

      const validBadges = [
        'owner', 'developer', 'friend', 'partner', 'early supporter', 
        'staff', 'contributor', 'beta tester', 'bug hunter'
      ];

      if (!validBadges.includes(bdg)) {
        return message.channel.send({embeds: [new EmbedBuilder().setDescription(`**Error**: Invalid badge! Valid badges are: \`${validBadges.join('`, `')}\``)]});
      }
      badges.push(bdg);
      await client.db.set(`bdg_${user.id}`, badges);

      return message.channel.send({embeds: [new EmbedBuilder().setDescription(`${client.emoji.tick} **Added** ${bdg} badge to ${user.username}`)]});
    }
    if (args[0] === 'remove' || args[0] === '-') {
      let bdg = args[2];

      const validBadges = [
        'owner', 'developer', 'friend', 'partner', 'early supporter', 
        'staff', 'contributor', 'beta tester', 'bug hunter'
      ];

      if (!validBadges.includes(bdg)) {
        return message.channel.send({embeds: [new EmbedBuilder().setDescription(`**Error**: Invalid badge! Valid badges are: \`${validBadges.join('`, `')}\``)]});
      }
      badges = badges.filter((b) => b !== bdg);
      await client.db.set(`bdg_${user.id}`, badges);

      return message.channel.send({embeds: [new EmbedBuilder().setDescription(`${client.emoji.tick} **Removed** ${bdg} badge from ${user.username}`)]});
    }
    return message.channel.send({embeds: [new EmbedBuilder().setDescription(`Usage: \`bdg <add/remove> <user> <badge>\`\n\nExample: \`bdg add @user developer\``)]});
  }
};
