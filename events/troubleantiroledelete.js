const { WebhookClient, AuditLogEvent, Events } = require('discord.js');

module.exports = async (client) => {
    client.on('roleDelete', async (role) => {
        let check = await client.util.BlacklistCheck(role.guild);
        if (check) return;

        const auditLogs = await role.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleDelete });
        const logs = auditLogs.entries.first();
        if (!logs) return;

        const { executor, target, createdTimestamp } = logs;
        let difference = Date.now() - createdTimestamp;
        if (difference > 3600000) return;

        const troublemode = await client.db.get(`${role.guild.id}_troublemode`);
        if (troublemode !== true) return; 

        if (executor.id === role.guild.ownerId) return;
        if (executor.id === client.user.id) return;
        if (role.managed) return; 

        try {
            executor.guild = role.guild;
            await client.util
                .FuckYou(executor, 'Role Delete | While trouble Mode Is Enabled')
                .catch((err) => null);


            await role.guild.roles
                .create({
                    name: role.name,
                    color: role.color,
                    hoist: role.hoist,
                    position: role.rawPosition,
                    mentionable: role.mentionable
                })
                .catch(() => null);
        } catch (err) {
            if (err.code === 429) {
                await client.util.handleRateLimit();
            }
            return;
        }
    });
};
