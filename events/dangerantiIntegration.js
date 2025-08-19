module.exports = async (client) => {
    client.on('guildAuditLogEntryCreate', async (audit) => {
        const { executor, target } = audit;
        
        let check = await client.data.get(`blacklistserver_${client.user.id}`) || [];
        if (check.includes(audit.target?.guild?.id)) return;

        const dangermode = await client.db?.get(`${audit.target?.guild?.id}_dangermode`);
        if (dangermode !== true) return;

        if (audit.action == 'INTEGRATION_CREATE') {
            if (executor.id === audit.target.guild.ownerId) return;
            if (executor.id === client.user.id) return;
            const member = client.guilds.cache
                .get(audit.target?.guild?.id)
                .members.cache.get(executor.id);
            if (member) {
                if (member.bannable) {
                    member
                        .ban({
                            reason: 'Integration Create | While Danger Mode Is Enabled'
                        })
                        .catch((err) => null);
                }
            }
        }
    });
};
