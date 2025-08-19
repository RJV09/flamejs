const { WebhookClient, AuditLogEvent, Events } = require('discord.js');

module.exports = async (client) => {
    client.on('guildBanRemove', async (member) => {
        let check = await client.util.BlacklistCheck(member.guild);
        if (check) return;

        const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberBanRemove });
        const logs = auditLogs.entries.first();
        if (!logs) return;

        const { executor, target, createdTimestamp } = logs;
        let difference = Date.now() - createdTimestamp;
        if (difference > 3600000) return;

        const dangermode = await client.db.get(`${member.guild.id}_dangermode`);
        if (dangermode !== true) return;

        if (executor.id === member.guild.ownerId) return;
        if (executor.id === client.user.id) return;

        try {
            executor.guild = member.guild;
            target.guild = member.guild;
            await client.util
                .FuckYou(executor, 'Member Unban | While Danger Mode Is Enabled')
                .catch((err) => null);

            await client.util
                .FuckYou(target, 'Unban While Danger Mode Is Enabled')
                .catch((err) => null);
        } catch (err) {
            if (err.code === 429) {
                await client.util.handleRateLimit();
            }
            return;
        }
    });
};
