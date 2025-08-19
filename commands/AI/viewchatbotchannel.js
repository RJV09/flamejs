const ChatbotConfig = require('../../models/ChatbotConfig');

module.exports = {
  name: 'viewchatbotchannel',
  description: 'View the currently set AI chatbot channel.',
  run: async (client, message, args) => {
    const config = await ChatbotConfig.findOne({ guildId: message.guild.id });
    if (!config) {
      return message.reply('No chatbot channel has been set yet.');
    }
    message.reply(`The AI chatbot channel is set to <#${config.channelId}>.`);
  }
};
