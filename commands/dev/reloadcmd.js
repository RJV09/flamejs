const { EmbedBuilder } = require('discord.js');
const saixd = ['1387826587172343990', '1387826587172343990'];

module.exports = {
    name: 'reload',
    aliases: ['rlcmd'],
    category: 'owner',
    run: async (client, message, args) => {
        if (!saixd.includes(message.author.id)) return;

        try {
            let reload = false;
            for (let i = 0; i < client.categories.length; i++) {
                let dir = client.categories[i];

                try {
                    if (!args[0]) {
                        const opp = new EmbedBuilder()
                            .setColor(client.color || '#FF0000')
                            .setDescription(
                                `${client.emoji.cross || '❌'} | You didn't provide the command name.`
                            );
                        return message.channel.send({ embeds: [opp] });
                    }

                    delete require.cache[require.resolve(`../../commands/${dir}/${args[0]}.js`)];
                    client.commands.delete(args[0]);

                    const pull = require(`../../commands/${dir}/${args[0]}.js`);
                    client.commands.set(args[0], pull);
                    reload = true;
                } catch (err) {
                    console.error(`Error reloading command: ${args[0]} in category ${dir}`, err);
                }
            }

            if (reload) {
                const op = new EmbedBuilder()
                    .setColor(client.color || '#FF0000')
                    .setDescription(
                        `${client.emoji.tick || '✔️'} | Successfully reloaded \`${args[0]}\`.`
                    );
                return message.channel.send({ embeds: [op] });
            }

            const notop = new EmbedBuilder()
                .setColor(client.color || '#FF0000')
                .setDescription(
                    `${client.emoji.cross || '❌'} | I was unable to reload \`${args[0]}\`.`
                );
            return message.channel.send({ embeds: [notop] });
        } catch (e) {
            console.error(e);
            const emesdf = new EmbedBuilder()
                .setColor(client.color || '#FF0000')
                .setDescription(
                    `${client.emoji.cross || '❌'} | An error occurred while trying to reload \`${args[0]}\`.`
                );
            return message.channel.send({ embeds: [emesdf] });
        }
    }
};
