const wait = require('wait');
require('dotenv').config();
require('module-alias/register');
const path = require('path');
const Bitzxier = require(`./structures/FlaMe.js`);
const client = new Bitzxier();
this.config = require(`./config.json`);
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const { GiveawaysManager } = require('discord-giveaways');
const GiveawayManager = require("./GwMan.js");

client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;

    const member = interaction.guild.members.cache.get(interaction.user.id);
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
        return interaction.reply({ content: 'You must be in a voice channel.', ephemeral: true });
    }

    const modalId = interaction.customId;
    const fieldId = `${modalId.split('_')[1]}_value`;
    const value = interaction.fields.getTextInputValue(fieldId);

    switch (modalId) {
        case 'modal_bitrate': {
            const bitrate = parseInt(value);
            if (isNaN(bitrate) || bitrate < 8000 || bitrate > 96000) {
                return interaction.reply({ content: 'Bitrate must be between 8000 and 96000.', ephemeral: true });
            }
            await voiceChannel.setBitrate(bitrate);
            return interaction.reply({ content: `Bitrate set to ${bitrate}.`, ephemeral: true });
        }

        case 'modal_region': {
            const region = value.toLowerCase();
            await voiceChannel.setRTCRegion(region === 'automatic' ? null : region);
            return interaction.reply({ content: `Region set to ${region}.`, ephemeral: true });
        }

        case 'modal_Increase': {
            const amount = parseInt(value);
            if (isNaN(amount) || amount < 1) {
                return interaction.reply({ content: 'Please enter a valid number to increase by.', ephemeral: true });
            }
            const newLimit = Math.min((voiceChannel.userLimit || 0) + amount, 99);
            await voiceChannel.setUserLimit(newLimit);
            return interaction.reply({ content: `User limit increased to ${newLimit}.`, ephemeral: true });
        }

        case 'modal_Decrease': {
            const amount = parseInt(value);
            if (isNaN(amount) || amount < 1) {
                return interaction.reply({ content: 'Please enter a valid number to decrease by.', ephemeral: true });
            }
            const newLimit = Math.max((voiceChannel.userLimit || 0) - amount, 0);
            await voiceChannel.setUserLimit(newLimit);
            return interaction.reply({ content: `User limit decreased to ${newLimit}.`, ephemeral: true });
        }

        default:
            return interaction.reply({ content: 'Unknown modal response.', ephemeral: true });
    }
});

client.on('messageCreate', async (message) => {
    require('./events/antieveryoneb.js')(client, message);
});
const voiceStateUpdateHandler = require('./events/voiceStateUpdate'); // Make sure the path is correct
client.on('voiceStateUpdate', voiceStateUpdateHandler.bind(null, client));
// Register the button interaction handler
const buttonInteractionHandler = require('./events/buttonInteractionHandler');
client.on('interactionCreate', buttonInteractionHandler.bind(null, client));
client.giveawaysManager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    updateCountdownEvery: 5000,
    embedColor: '#FF0000',
    reaction: '🎉',  
});
client.on('voiceStateUpdate', async (oldState, newState) => {
    const member = newState.member;
    if (!newState.channel || !member) return;
    const isVcbanned = await client.db.get(`vcban_${newState.guild.id}_${member.id}`);
    if (isVcbanned) {
        try {
            await member.voice.disconnect();
            const channel = newState.guild.channels.cache.get(newState.channel.id);
            if (channel) {
                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color || 'BLACK')
                            .setDescription(
                                `<a:anxCross2:1321773462699642991> | <@${member.user.id}> has been disconnected from the voice channel because they are VC-banned.`
                            ),
                    ],
                });
            }
        } catch (err) {
        }
    }
});

client.on('messageCreate', async (message) => {
    const MentionEveryoneHandler = require('./events/MentionEveryone.js');
    await MentionEveryoneHandler(client, message);
});

const autoResponderFilePath = path.join(__dirname, './commands/autoresponder/autoresponders.json');
function loadAutoresponders() {
    try {
        if (fs.existsSync(autoResponderFilePath)) {
            const rawData = fs.readFileSync(autoResponderFilePath);
            const autoresponders = JSON.parse(rawData);
            for (let serverId in autoresponders) {
                autoresponders[serverId].forEach(ar => {
                    if (typeof ar.keyword !== 'string') {
                        console.error(`Autoresponder keyword for server ${serverId} is not a string.`);
                    }
                });
            }

            return autoresponders;
        } else {
            return {};
        }
    } catch (error) {
        console.error('Error loading autoresponders:', error);
        return {};
    }
}
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const autoresponders = loadAutoresponders();
  if (!autoresponders[message.guild.id]) return;
  const messageContent = typeof message.content === 'string' ? message.content.toLowerCase() : '';
  for (const ar of autoresponders[message.guild.id]) {
      const keyword = ar.keyword.toLowerCase();
      if (typeof message.content === 'string' && message.content.toLowerCase().includes(keyword)) {
          break; 
      }
  }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    try {
        const autoresponders = loadAutoresponders();
        if (!autoresponders[message.guild.id]) return;
        const messageContent = message.content.toLowerCase().trim();
        for (const ar of autoresponders[message.guild.id]) {
            const keyword = ar.keyword.toLowerCase().trim();
            if (messageContent === keyword) {
                message.reply(ar.response);
                break; 
            }
        }
    } catch (error) {
        console.error('Error in message handler:', error);
    }
});




client.db = {};
async function initializeMongoose() {
    console.log('Initializing Mongoose...');
    await client.initializeMongoose();
    console.log('Mongoose initialized');
}

async function initializeData() {
    console.log('Initializing data...');
    await client.initializedata();
    console.log('Data initialized');
}

async function waitThreeSeconds() {
    console.log('Waiting for 3 seconds...');
    await wait(3000);
    console.log('Wait completed');
}

async function loadEvents() {
    console.log('Loading events...');
    await client.loadEvents();
    console.log('Events loaded');
}

async function loadLogs() {
    console.log('Loading logs...');
    await client.loadlogs();
    console.log('Logs loaded');
}

async function loadMain() {
    console.log('Loading main...');
    await client.loadMain();
    console.log('Main loaded');
}

async function loginBot() {
    console.log('Logging in...');
    const settings = require('./config.json');
    await client.login(settings.TOKEN);
    console.log('Logged in');
}
async function main() {
    try {
        await initializeMongoose();
        await initializeData();
        await waitThreeSeconds();
        await loadEvents();
        await loadLogs();
        await loadMain();
        await loginBot();
    } catch (error) {
        console.error('Error:', error);
    }
}
main();
 