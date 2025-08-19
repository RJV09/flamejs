const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '!' },
  automod: {
    antiPornography: { type: Boolean, default: false },
    antiSpamMessage: { type: Boolean, default: false },
    antiMentionSpam: { type: Boolean, default: false },
    antiToxicity: { type: Boolean, default: false },
  }
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
