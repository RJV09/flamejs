const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: '8ball',
    aliases: ['magic8ball', 'eightball'],
    category: 'fun',
    run: async (client, message, args) => {
    
        const question = args.join(' ');
        if (!question) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('FF0000')
                        .setDescription('Please ask a question! Usage: `8ball <question>`')
                ]
            });
        }
        const responses = [
            'Yes, definitely!',
            'Absolutely not.',
            'Ask again later.',
            'Maybe, try again.',
            'I have no idea.',
            'It is certain.',
            'Outlook good.',
            'Cannot predict now.',
            'Don’t count on it.',
            'Yes, but be careful.',
            'My sources say no.',
            'Very doubtful.',
            'Yes, go for it!',
            'The future is unclear.'
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        const embed = new EmbedBuilder()
            .setTitle('🎱 Magic 8-Ball')
            .setDescription(`**Question:** ${question}\n**Answer:** ${response}`)
            .setColor('FF0000')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
        message.channel.send({ embeds: [embed] });
    }
};
