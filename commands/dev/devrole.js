const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'devrole',
  category: 'owner',
  description: 'Add a role to a user by finding the role ID.',
  usage: 'devrole <user_id> <role_id>',
  run: async (client, message, args) => {
    const ownerIds = ['1387826587172343990', '1387826587172343990', '1387826587172343990'];
    if (!ownerIds.includes(message.author.id)) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('This command is only for my owner, you cannot use this command.');
      return message.channel.send({ embeds: [embed] });
    }
    if (!args[0] || !args[1]) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('Please provide both user ID and role ID.');
      return message.channel.send({ embeds: [embed] });
    }
    const userId = args[0];
    const roleId = args[1];
    const user = message.guild.members.cache.get(userId);
    const role = message.guild.roles.cache.get(roleId);
    if (!user || !role) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('Invalid user ID or role ID.');
      return message.channel.send({ embeds: [embed] });
    }
    try {
      await user.roles.add(role);
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setDescription(`Added role ${role.name} to user ${user.user.tag}.`);
      return message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error adding role:', error);
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('Failed to add role. Please try again later.');
      return message.channel.send({ embeds: [embed] });
    }
  }
};