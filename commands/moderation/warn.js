const { Client, Message, EmbedBuilder, PermissionsBitField } = require('discord.js');
const Warning = require('../../models/warning'); // Import the Warning model
const mongoose = require('mongoose');

module.exports = {
    name: 'warn',
    aliases: ['addwarn', 'warning'],
    category: 'mod',
    premium: false,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        // Ensure the message is from a guild and not a DM
        if (!message.guild) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | This command cannot be used in DMs.`)
                ]
            });
        }

        // Ensure message.member and message.guild.me are defined
        if (!message.member || !message.guild.members.me) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | Something went wrong with the member or bot information.`)
                ]
            });
        }

        // Check if the user has the required permission ('PermissionsBitField.Flags.ManageMessages')
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | You must have \`Manage Messages\` permissions to use this command.`)
                ]
            });
        }

        // Check if the bot has the 'PermissionsBitField.Flags.ManageMessages' permission
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | I must have \`Manage Messages\` permissions to use this command.`)
                ]
            });
        }

        // Get the user from mention or ID
        let user = await getUserFromMention(message, args[0]);
        if (!user) {
            try {
                user = await client.users.fetch(args[0]);
            } catch (error) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`<:emoji_1725906884992:1306038885293494293>  | Please provide a valid user ID or mention a member.`)
                    ]
                });
            }
        }

        // Reason for warning
        let reason = args.slice(1).join(' ') || 'No reason provided.';
        reason = `${message.author.tag} (${message.author.id}) | ` + reason;

        // Error message for user not found
        const userNotFoundEmbed = new EmbedBuilder()
            .setDescription(`<:emoji_1725906884992:1306038885293494293> | User not found.`)
            .setColor(client.color);

        if (!user) return message.channel.send({ embeds: [userNotFoundEmbed] });

        // Prevent warning bot itself
        if (user.id === client.user.id) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | You cannot warn me!`)
                ]
            });
        }

        // Prevent warning the server owner
        if (user.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | You cannot warn the server owner.`)
                ]
            });
        }

        // Ensure the user is a GuildMember (not just a User)
        const targetMember = await message.guild.members.fetch(user.id).catch(() => null);
        if (!targetMember) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | The target user is not a member of this guild.`)
                ]
            });
        }

        // Check if the user has a higher role than the one issuing the command
        if (message.member.roles.highest.position <= targetMember.roles.highest.position) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | You must have a higher role than the user to warn them.`)
                ]
            });
        }

        // Store the warning in MongoDB
        try {
            let warningDoc = await Warning.findOne({ userId: user.id });

            if (!warningDoc) {
                // If no warnings are found, create a new document
                warningDoc = new Warning({
                    userId: user.id,
                    warnings: []
                });
            }

            // Add the new warning to the user's document
            warningDoc.warnings.push({
                reason: reason,
                warnedBy: message.author.tag,
                date: new Date()
            });

            await warningDoc.save(); // Save the document to MongoDB

            // Embed to show the warning was issued
            const warnEmbed = new EmbedBuilder()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(
                    `**Warning issued to ${user.tag}**\nReason: \`${reason}\`\nIssued by: ${message.author.tag}`
                )
                .setColor(client.color)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

            // Send the warning to the channel
            await message.channel.send({ embeds: [warnEmbed] });

            // Optionally, send a warning message to the warned user
            const directMessage = new EmbedBuilder()
                .setTitle(`You have been warned in ${message.guild.name}`)
                .setDescription(`**Reason:** \`${reason}\`\n**Issued by:** ${message.author.tag}`)
                .setColor(client.color)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

            try {
                await user.send({ embeds: [directMessage] });
            } catch (err) {
                console.error(`Could not send DM to ${user.tag}.`);
            }

            // Success confirmation (Sent to channel)
            const successEmbed = new EmbedBuilder()
                .setDescription(`<a:Tick:1306038825054896209> | Successfully warned **${user.tag}**.`)
                .setColor(client.color);

            await message.channel.send({ embeds: [successEmbed] });
        } catch (err) {
            console.error('Error saving warning to MongoDB:', err);
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293> | Something went wrong while saving the warning.`)
                ]
            });
        }
    }
};

// Helper function to get a user from a mention or ID
function getUserFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;

    const id = matches[1];
    return message.client.users.fetch(id);
}
