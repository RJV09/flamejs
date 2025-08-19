const { Client, Message, EmbedBuilder, PermissionsBitField } = require('discord.js');
const Warning = require('../../models/warning'); // Import the Warning model

module.exports = {
    name: 'warnremove',
    aliases: ['removewarn', 'delwarn'],
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

        // Get the warning index from arguments
        const warningIndex = parseInt(args[1]);

        if (isNaN(warningIndex) || warningIndex <= 0) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | Please provide a valid warning index.`)
                ]
            });
        }

        // Fetch warning data from MongoDB
        try {
            const warningDoc = await Warning.findOne({ userId: user.id });

            if (!warningDoc || warningDoc.warnings.length === 0) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`<:emoji_1725906884992:1306038885293494293> | **${user.tag}** has no warnings.`)
                    ]
                });
            }

            // Ensure the warning index is valid
            if (warningIndex > warningDoc.warnings.length) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`<:emoji_1725906884992:1306038885293494293> | Invalid warning index. Please provide a valid index.`)
                    ]
                });
            }

            // Remove the warning
            const removedWarning = warningDoc.warnings.splice(warningIndex - 1, 1); // Remove the warning at the provided index

            // Save the updated warning data back to MongoDB
            await warningDoc.save();

            // Build the embed response
            const warnRemoveEmbed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`<a:Tick:1306038825054896209> | Successfully removed warning **#${warningIndex}** from **${user.tag}**.`);

            // Send success message
            await message.channel.send({ embeds: [warnRemoveEmbed] });

            // Optionally, send the user a DM about the warning removal
            const dmEmbed = new EmbedBuilder()
                .setTitle(`A warning has been removed from you in ${message.guild.name}`)
                .setDescription(`**Warning Removed:** #${warningIndex}\n**Removed by:** ${message.author.tag}`)
                .setColor(client.color)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }));

            try {
                await user.send({ embeds: [dmEmbed] });
            } catch (err) {
                console.error(`Could not send DM to ${user.tag}.`);
            }

        } catch (err) {
            console.error('Error fetching or updating warnings from MongoDB:', err);
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293> | Something went wrong while removing the warning.`)
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
