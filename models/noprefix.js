const mongoose = require('mongoose');

const guildNoPrefixSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  users: {
    type: [String],
    default: [],
    validate: [arrayLimit, '{PATH} exceeds the limit of 3']
  }
});

function arrayLimit(val) {
  return val.length <= 3;
}

module.exports = mongoose.model('GuildNoPrefix', guildNoPrefixSchema);