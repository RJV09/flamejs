const { EmbedBuilder } = require('discord.js');
const config = require(`${process.cwd()}/config.json`);

module.exports = {
    name: `leaveserver`,
    category: `owner`,
    aliases: [`leaveg`, `gleave`],
    description: `Leaves a Guild`,
    run: async (client, message, args) => {
        if (!config.admin.includes(message.author.id)) return;

        let id = args[0];
        if (!id) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | You didn't provide the server ID.`)
                ]
            });
        }

        let guild;
        try {
            guild = await client.guilds.fetch(id);
        } catch (error) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | Couldn't find a valid server with that ID.`)
                ]
            });
        }

        let name = guild?.name || 'No Name Found';
        await guild.leave();
        
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(`${client.emoji.tick} | Successfully left **${name}** (${id}).`)
            ]
        });
    }
};
