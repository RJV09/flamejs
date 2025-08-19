const { EmbedBuilder } = require('discord.js');
this.config = require(`${process.cwd()}/config.json`);

module.exports = {
    name: 'addpremium',
    aliases: ['addprem', 'premium+'],
    category: 'Owner',
    run: async (client, message, args) => {
        if (!this.config.owner.includes(message.author.id)) return;
        let time;
        let count;
        const arr = [];
        const embed = new EmbedBuilder().setColor(client.color);
        if (args[0]) {
            try {
                await client.users.fetch(args[0]);
            } catch (error) {
                return message.channel.send('Invalid Id');
            }
            if (args[1]) {
                time = Date.now() + 86400000 * args[1];
            } else {
                time = Date.now() + 86400000 * 1;
            }
            if (args[2]) {
                count = args[2];
            } else {
                count = 0;
            }
            client.db.set(`uprem_${args[0]}`, true);
            client.db.set(`upremend_${args[0]}`, time);
            client.db.set(`upremcount_${args[0]}`, count);
            client.db.set(`upremserver_${args[0]}`, arr);
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<@${args[0]}> Has Been Added As A Premium User\nPremium Count: \`${count}\`    Premium Expiring - <t:${Math.round(time / 1000)}>`
                        )
                ]
            });
        } else {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`Please Give The User Id`)
                ]
            });
        }
    }
};
