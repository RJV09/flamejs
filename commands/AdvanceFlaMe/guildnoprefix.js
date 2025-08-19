const { EmbedBuilder } = require('discord.js');
const GuildNoPrefix = require('../../models/noprefix.js');

module.exports = {
  name: 'guildnoprefix',
  aliases: ['gnp'],
  category: 'owner',
  description: 'Manage users who can use commands without prefix',
  usage: '<add/remove/list> [user]',

  run: async (client, message, args) => {
    if (message.author.id !== message.guild.ownerId) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription('❌ Only the server owner can use this command!')
        ]
      });
    }
    const action = args[0]?.toLowerCase();
    const userId = args[1]?.replace(/[<@!>]/g, '');
    const targetUser = userId ? await client.users.fetch(userId).catch(() => null) : null;
    let guildData = await GuildNoPrefix.findOne({ guildId: message.guild.id });
    if (!guildData) {
      guildData = new GuildNoPrefix({ guildId: message.guild.id });
      await guildData.save();
    }
    const helpEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('Guild No-Prefix Help')
      .setDescription([
        `**Current Users:** ${guildData.users.length}/3`,
        `\`guildnoprefix add @user\` - Add user`,
        `\`guildnoprefix remove @user\` - Remove user`,
        `\`guildnoprefix list\` - Show all no-prefix users`
      ].join('\n'));
    if (!action) return message.reply({ embeds: [helpEmbed] });
    switch (action) {
      case 'add':
        if (!targetUser) {
          return message.reply('Please mention a user or provide their ID!');
        }
        if (guildData.users.includes(targetUser.id)) {
          return message.reply('This user already has no-prefix access!');
        }
        if (guildData.users.length >= 3) {
          return message.reply('You can only add 3 no-prefix users per server!');
        }
        guildData.users.push(targetUser.id);
        await guildData.save();
        return message.reply(`✅ Added ${targetUser.tag} to no-prefix users!`);
      case 'remove':
        if (!targetUser) {
          return message.reply('Please mention a user or provide their ID!');
        }
        if (!guildData.users.includes(targetUser.id)) {
          return message.reply('This user doesn\'t have no-prefix access!');
        }
        guildData.users = guildData.users.filter(id => id !== targetUser.id);
        await guildData.save();
        return message.reply(`✅ Removed ${targetUser.tag} from no-prefix users!`);

      case 'list':
        if (guildData.users.length === 0) {
          return message.reply('No no-prefix users set for this server!');
        }
        const userList = await Promise.all(
          guildData.users.map(async id => {
            const user = await client.users.fetch(id).catch(() => null);
            return user ? `${user.tag} (${id})` : `Unknown User (${id})`;
          })
        );
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('#2b2d31')
              .setTitle('No-Prefix Users')
              .setDescription(userList.join('\n'))
              .setFooter({ text: `${userList.length}/3 slots used` })
          ]
        });
      default:
        return message.reply({ embeds: [helpEmbed] });
    }
  }
};