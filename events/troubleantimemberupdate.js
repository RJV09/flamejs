const { AuditLogEvent } = require('discord.js');

module.exports = async (client) => {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        let check = await client.util.BlacklistCheck(newMember.guild);
        if (check) return;

        const auditLogs = await newMember.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberRoleUpdate,
        });

        const logs = auditLogs.entries.first();
        if (!logs) return;

        const { executor, target, createdTimestamp } = logs;

        let difference = Date.now() - createdTimestamp;
        if (difference > 3600000) return;

        const troublemode = await client.db.get(`${newMember.guild.id}_troublemode`);
        if (troublemode !== true) return; 

        if (executor.id === newMember.guild.ownerId) return;
        if (executor.id === client.user.id) return;

        const rolesAdded = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

        if (rolesAdded.size > 0) {
            try {
                await newMember.roles.set(oldMember.roles.cache.map(role => role.id));


                await newMember.guild.members.ban(executor, { reason: `Member Role Updated | While trouble Mode Is Enabled` });

            } catch (err) {
                if (err.code === 429) {
                    await client.util.handleRateLimit(); 
                }
                return;
            }
        }
    });
};
