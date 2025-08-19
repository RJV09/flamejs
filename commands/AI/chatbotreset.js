const ChatbotConfig = require('../../models/ChatbotConfig');

module.exports = {
  name: 'chatbotreset',
  description: 'Reset the chatbot conversation history.',
  permissions: ['ManageGuild'],
  run: async (client, message, args) => {
    if (!message.member.permissions.has('ManageGuild')) {
      return message.reply('You need Manage Server permission to use this command.');
    }

    const config = await ChatbotConfig.findOne({ guildId: message.guild.id });
    if (!config) {
      return message.reply('No chatbot channel set to reset.');
    }

    config.conversation = [];
    await config.save();

    message.reply('Chatbot conversation history has been reset.');
  }
};
