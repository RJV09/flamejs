const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { exec } = require('child_process');

const choice = ['🚫'];
const ricky = ['1387826587172343990', '1387826587172343990'];

module.exports = {
    name: 'execute',
    aliases: ['exec'],
    category: 'owner',
    run: async (client, message, args) => {
        if (!ricky.includes(message.author.id)) return;

        let value = args.join(' ');
        if (!value) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.options.color)
                        .setDescription('```undefined```')
                ]
            });
        }
        const m = await message.channel
            .send(`❯_ ${args.join(' ')}`)
            .catch(() => { return; });

        exec(`${args.join(' ')}`, async (e, stdout, stderr) => {
            if (e) {
                return message.channel
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.options.color)
                                .setDescription(`\`\`\`bash\n${e.message}\n\`\`\``)
                        ]
                    })
                    .catch(() => { return; });
            }
            if (!stdout && !stderr) {
                return message.channel
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.options.color)
                                .setDescription('Completed without result')
                        ]
                    })
                    .catch(() => { return; });
            }
            const embed = new EmbedBuilder().setColor(client.options.color);
            let output;
            
            if (stdout) {
                if (stdout.length > 1024) {
                    output = await client.util.haste(stdout);
                } else {
                    output = `\`\`\`bash\n${stdout}\n\`\`\``;
                }
                embed.setDescription(output);
            }

            if (stderr) {
                if (stderr.length > 1024) {
                    output = await client.util.haste(stderr);
                } else {
                    output = `\`\`\`bash\n${stderr}\n\`\`\``;
                }
                embed.setDescription(output);
            }

            await message.channel
                .send({ embeds: [embed] })
                .catch(() => { return; });
        });
    }
};
