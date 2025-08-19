const ChatbotConfig = require('../../models/ChatbotConfig');

module.exports = {
  name: 'setchatbotchannel',
  description: 'Set the current channel as the AI chatbot channel.',
  permissions: ['ManageGuild'],
  run: async (client, message, args) => {
    if (!message.member.permissions.has('ManageGuild')) {
      return message.reply('You need Manage Server permission to use this command.');
    }

    const channelId = message.channel.id;
    const guildId = message.guild.id;

    let config = await ChatbotConfig.findOne({ guildId });

    if (!config) {
      config = new ChatbotConfig({ guildId, channelId, conversation: [] });
    } else {
      config.channelId = channelId;
      config.conversation = []; 
    }

    await config.save();

    message.reply(`This channel <#${channelId}> is now set as the AI chatbot channel.`);
  }
};
