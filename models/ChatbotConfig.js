const mongoose = require('mongoose');

const ChatbotConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  channelId: { type: String, required: true },
  conversation: [
    {
      role: { type: String, enum: ['user', 'assistant'], required: true },
      content: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('ChatbotConfig', ChatbotConfigSchema);
