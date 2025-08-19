module.exports = async (client) => {
    const { EmbedBuilder } = require("discord.js");
    const wait = require('wait');

    client.on('messageDelete', async (message) => {
        let data2 = await client.data.get(`logs_${message.guild.id}`);
        if (!data2) return;
        if (!data2.message) return;
        const channel = data2.message;
        const msglogs = await message.guild.channels.cache.get(channel);
        if (!msglogs) {
            await client.data.set(`logs_${message.guild.id}`, {
                voice: data2 ? data2.voice : null,
                channel: data2 ? data2.channel : null,
                rolelog: data2 ? data2.rolelog : null,
                modlog: data2 ? data2.modlog : null,
                message: null,
                memberlog: data2 ? data2.memberlog : null
            });
            return;
        }

        if (message.author.bot || !message.guild) return;
        if (message.system) return;

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle('Message Delete')
            .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
            .setDescription(`Message Content: ${message.content}\n\nAuthor: ${message.author.tag}\n\nMessage Deleted In: ${message.channel}\n\nChannel ID: ${message.channel.id}`);

        if (message.attachments.size > 0) {
            embed.setImage(message.attachments.first().url);
        }

        await wait(2000);
        await msglogs.send({ embeds: [embed] }).catch((_) => { });
    });

    client.on('messageUpdate', async (oldMessage, newMessage) => {
        let data2 = await client.data.get(`logs_${oldMessage.guild.id}`);
        if (!data2) return;
        if (!data2.message) return;
        const channel = data2.message;
        const msglogs = await oldMessage.guild.channels.fetch(channel);
        if (!msglogs) {
            await client.data.set(`logs_${oldMessage.guild.id}`, {
                voice: data2 ? data2.voice : null,
                channel: data2 ? data2.channel : null,
                rolelog: data2 ? data2.rolelog : null,
                modlog: data2 ? data2.modlog : null,
                message: null,
                memberlog: data2 ? data2.memberlog : null
            });
            return;
        }

        if (!oldMessage.author) return;
        if (newMessage.author.bot) return;
        if (oldMessage.author.id === client.user.id) return;

        const edit = new EmbedBuilder()
            .setTimestamp()
            .setTitle('Message Edit')
            .setThumbnail(`${newMessage.author.displayAvatarURL({ dynamic: true })}`)
            .setColor(client.color)
            .setDescription(`Original: \`${oldMessage}\`\n\nEdited: \`${newMessage}\`\n\nAuthor Id: ${newMessage.author.id}\n\nAuthor: ${newMessage.author.tag}\n\nChannel: ${newMessage.channel}\n\nChannel ID: ${newMessage.channel.id}`);

        await wait(2000);
        await msglogs.send({ embeds: [edit] }).catch((_) => { });
    });

    // Detect when an embed is deleted
    client.on('messageDeleteBulk', async (messages) => {
        messages.forEach(async (message) => {
            if (message.embeds.length > 0) {
                let data2 = await client.data.get(`logs_${message.guild.id}`);
                if (!data2) return;
                if (!data2.message) return;
                const channel = data2.message;
                const msglogs = await message.guild.channels.cache.get(channel);
                if (!msglogs) {
                    await client.data.set(`logs_${message.guild.id}`, {
                        voice: data2 ? data2.voice : null,
                        channel: data2 ? data2.channel : null,
                        rolelog: data2 ? data2.rolelog : null,
                        modlog: data2 ? data2.modlog : null,
                        message: null,
                        memberlog: data2 ? data2.memberlog : null
                    });
                    return;
                }

                const embedDeleted = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle('Embed Deleted')
                    .setDescription(`An embed message was deleted in ${message.channel}.`)
                    .addFields(
                        { name: 'Author:', value: message.author.tag || 'Unknown' },
                        { name: 'Channel:', value: message.channel.name },
                        { name: 'Message ID:', value: message.id }
                    )
                    .setTimestamp();

                await wait(2000);
                await msglogs.send({ embeds: [embedDeleted] }).catch((_) => { });
            }
        });
    });
};
