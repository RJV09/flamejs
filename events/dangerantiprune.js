const { WebhookClient, AuditLogEvent, Events } = require('discord.js');

module.exports = async (client) => {
    client.on('guildMemberRemove', async (member) => {
        let check = await client.util.BlacklistCheck(member.guild);
        if (check) return;

        const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberPrune });
        const logs = auditLogs.entries.first();
        if (!logs) return;

        const { executor, target, createdTimestamp } = logs;
        let difference = Date.now() - createdTimestamp;
        if (difference > 3600000) return;

        // Removed whitelist system check and logic

        const dangermode = await client.db.get(`${member.guild.id}_dangermode`);
        if (dangermode !== true) return;

        // Removed the whitelist system and related checks
        if (executor.id === member.guild.ownerId) return;
        if (executor.id === client.user.id) return;
        if (member?.id !== target?.id) return;

        try {
            executor.guild = member.guild;
            await client.util
                .FuckYou(executor, 'Member Prune | While Danger Mode Is Enabled')
                .catch((err) => null);
        } catch (err) {
            if (err.code === 429) {
                await client.util.handleRateLimit();
            }
            return;
        }
    });
};
