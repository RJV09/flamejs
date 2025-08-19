const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js'); // Import necessary classes

const joinChannelId = '1306096143402532926'; // Channel where the bot sends messages on join
const leaveChannelId = '1306096330589995039'; // Channel where the bot sends messages on leave

// Function to create embed message for the owner
const createEmbedMessage = (guild, owner, type) => {
    let title, description, color;
    if (type === 'join') {
        title = `Hello ${owner.user.username}!`;
        description = `
            **Thank you for choosing FlaMe!**
            FlaMe has been successfully added to ${guild.name}

            You can report any issues at my [Support Server](https://discord.gg/rfzop) following the needed steps. You can also reach out to my Developers if you want to know more about me.

            <a:emoji_1725906973559:1306048925907681310> FlaMe is love
        `;
        color = 'BLACK';
    } else if (type === 'leave') {
        title = `FlaMe Removed From Your ${guild.name}!`;
        description = `
            It seems my time in your server, **${guild.name}**, has come to an end.

            If this was a mistake, you can easily reinvite me by clicking the Invite button below. I would also appreciate any feedback you could provide to my developer. Your input will help me improve and serve you better in the future.

            <a:emoji_1725906973559:1306048925907681310> FlaMe Is Love
        `;
        color = 'BLACK';
    }

    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }));
};

// Function to create Action Row with buttons
const createActionRow = () => {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel("Support")
            .setStyle('LINK')
            .setEmoji("1104994194856103966")
            .setURL("https://discord.gg/rfzop"),
        new ButtonBuilder()
            .setLabel("Invite")
            .setStyle('LINK')
            .setEmoji("1167860474147250267")
            .setURL(
                `https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=8&scope=bot%20applications.commands`
            )
    );
};

module.exports = async (client) => {
    // Guild join event
    client.on('guildCreate', async (guild) => {
        try {
            // Fetch server owner information
            const owner = await guild.fetchOwner();

            // Create and send the embed to the server owner
            const embed = createEmbedMessage(guild, owner, 'join');
            const row = createActionRow();
            await owner.send({ embeds: [embed], components: [row] });

            console.log(`Sent a welcome DM to ${owner.user.tag} for adding the bot to ${guild.name}`);

            // Send a message in the "join" channel
            const joinChannel = await client.channels.fetch(joinChannelId);
            const joinEmbed = new EmbedBuilder()
                .setTitle(`Bot Added to New Server: ${guild.name}`)
                .setDescription(`
                    **Server Info:**
                    - **ID**: ${guild.id}
                    - **Members**: ${guild.memberCount}
                    - **Created At**: <t:${Math.round(guild.createdTimestamp / 1000)}:R>

                    **Owner**: ${owner.user.tag} (${owner.id})
                `)
                .setColor('GREEN')
                .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }));

            await joinChannel.send({ embeds: [joinEmbed] });
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
    });

    // Guild leave event
    client.on('guildDelete', async (guild) => {
        try {
            // Fetch server owner information when the bot leaves
            const owner = await guild.fetchOwner();

            // Create and send the goodbye embed to the server owner
            const leaveEmbedOwner = createEmbedMessage(guild, owner, 'leave');
            const row = createActionRow();
            await owner.send({ embeds: [leaveEmbedOwner], components: [row] });

            console.log(`Sent a goodbye DM to ${owner.user.tag} for removing the bot from ${guild.name}`);

            // Send a message in the "leave" channel
            const leaveChannel = await client.channels.fetch(leaveChannelId);
            const leaveEmbedChannel = new EmbedBuilder()
                .setTitle(`Bot Left Server: ${guild.name}`)
                .setDescription(`
                    **Server Info:**
                    - **ID**: ${guild.id}
                    - **Members**: ${guild.memberCount}
                    - **Created At**: <t:${Math.round(guild.createdTimestamp / 1000)}:R>
                `)
                .setColor(client.color)
                .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }));

            await leaveChannel.send({ embeds: [leaveEmbedChannel] });
        } catch (error) {
            console.error('Error sending goodbye message:', error);
        }
    });
};