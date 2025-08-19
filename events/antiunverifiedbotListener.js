const { AuditLogEvent } = require('discord.js');

module.exports = (client) => {
    // Listener to check for unverified bots when they join the server
    client.on('guildMemberAdd', async (member) => {
        // Check if the new member is a bot
        if (member.user.bot) {
            const isAntiUnverifiedBotEnabled = await client.db.get(`${member.guild.id}_antiunverifiedbot`);
            if (isAntiUnverifiedBotEnabled) {
                const isVerified = await checkBotVerification(member.user.id, member.guild);
                if (!isVerified) {
                    try {
                        // Ban the unverified bot
                        await member.ban({ reason: 'Unverified bot detected' });

                        // Send a message in the channel about the action taken
                        const channel = member.guild.systemChannel || member.guild.defaultChannel;
                        if (channel) {
                            channel.send(`A bot named ${member.user.tag} was banned for being unverified.`);
                        }

                        // Fetch the audit logs to find who added the bot
                        const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.BotAdd });
                        const logs = auditLogs.entries.first();
                        const executor = logs ? logs.executor : null;

                        // If an executor is found, kick them
                        if (executor) {
                            const guildMember = await member.guild.members.fetch(executor.id); // Fetch the member object
                            await guildMember.kick('Kicked for adding bot While antiunverifiedbot enable');

                            const kickChannel = member.guild.systemChannel || member.guild.defaultChannel;
                            if (kickChannel) {
                                kickChannel.send(`The user ${executor.tag} was kicked for adding an unverified bot.`);
                            }
                        }
                    } catch (err) {
                        console.error('Failed to ban unverified bot or kick user:', err);
                    }
                }
            }
        }
    });

    // Helper function to check if a bot is verified
    async function checkBotVerification(botId, guild) {
        try {
            // Fetch the audit logs
            const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.BotAdd });
            const logs = auditLogs.entries.first();

            // Look for the bot entry in the audit logs
            const botEntry = auditLogs.entries.find(entry => entry.target.id === botId);
            if (!botEntry) {
                return false; // No audit log entry found, consider it unverified
            }

            // Check if the bot has the "verified_flag"
            const botIsVerified = botEntry.extra && botEntry.extra.has('verified_flag');
            return botIsVerified;
        } catch (err) {
            console.error('Error fetching audit logs:', err);
            return false;
        }
    }
};
