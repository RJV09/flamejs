const { ActivityType } = require('discord.js');

module.exports = async (client) => {
    client.on('ready', async () => {
        client.user.setPresence({
            activities: [
                {
                    name: 'Faster Than Titanic!!',
                    type: ActivityType.Playing // Use ActivityType for the activity type
                }
            ],
            status: 'dnd' // Set the status to "Do Not Disturb"
        });

        client.logger.log(`Logged in to ${client.user.tag}`, 'ready');
    });
};