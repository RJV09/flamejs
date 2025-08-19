const { WebhookClient, AuditLogEvent, Events } = require('discord.js');

module.exports = async (client) => {
    client.on('roleCreate', async (role) => {
        let check = await client.util.BlacklistCheck(role.guild);
        if (check) return;

        const auditLogs = await role.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleCreate });
        const logs = auditLogs.entries.first();
        if (!logs) return;

        const { executor, target, createdTimestamp } = logs;
        let difference = Date.now() - createdTimestamp;
        if (difference > 3600000) return;

        const dangermode = await client.db.get(`${role.guild.id}_dangermode`);
        if (dangermode !== true) return; // If Danger Mode is not enabled, do nothing

        // Removed the whitelist system check and logic
        if (executor.id === role.guild.ownerId) return;
        if (executor.id === client.user.id) return;
        if (role.managed) return; // Skip managed roles

        try {
            executor.guild = role.guild;
            await client.util
                .FuckYou(executor, 'Role Create | While Danger Mode Is Enabled')
                .catch((err) => null);

            await role.delete().catch((err) => null); // Delete the created role
        } catch (err) {
            if (err.code === 429) {
                await client.util.handleRateLimit(); // Handle rate-limiting
            }
            return;
        }
    });
};
