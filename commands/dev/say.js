const { EmbedBuilder } = require('discord.js');

const botOwners = ['1387826587172343990', '1387826587172343990'];

module.exports = {
    name: 'say',
    description: 'Make the bot say something! (Bot Owners Only)',
    run: async (client, message, args) => {
        if (!botOwners.includes(message.author.id)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription('❌ | Want Access? Then DM My Dev Mughal.')
                ],
            });
        }
        const textToSay = args.join(' ');
        if (!textToSay) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription('<:emoji_1725906884992:1306038885293494293> | Please provide a message for me to say!')
                ],
            });
        }
        try {
            await message.channel.send(textToSay);
            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription('✅ | Message sent successfully.')
                ],
            });
        } catch (error) {
            console.error(error);
            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription('❌ | Something went wrong while trying to say the message.')
                ],
            });
        }
    },
};
