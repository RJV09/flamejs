const { WebhookClient, AuditLogEvent, Events, EmbedBuilder } = require('discord.js');

module.exports = async (client) => {
    client.on('guildBanAdd', async (member) => {
        let check = await client.util.BlacklistCheck(member.guild);
        if (check) return;

        const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberBanAdd });
        const logs = auditLogs.entries.first();
        if (!logs) return;

        const { executor, target, createdTimestamp } = logs;
        let difference = Date.now() - createdTimestamp;
        if (difference > 3600000) return;


        const dangermode = await client.db.get(`${member.guild.id}_dangermode`);
        if (dangermode !== true) return;

        if (executor.id === member.guild.ownerId) return;
        if (executor.id === client.user.id) return;

        executor.guild = member.guild;

        try {
            await client.util.FuckYou(executor, 'Member Ban | While DangerMode Is Enabled');
            await member.guild.members.unban(target.id).catch((_) => {});
        } catch (err) {
            if (err.code === 429) {
                await client.util.handleRateLimit();
            }
            return;
        }
    });
}
