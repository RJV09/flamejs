const { WebhookClient, AuditLogEvent, Events } = require('discord.js');
const { getSettings } = require('../models/mainrole');

module.exports = async (client) => {

    client.on('roleUpdate', async (o, n) => {
        let check = await client.util.BlacklistCheck(o.guild);
        if (check) return;

        const auditLogs = await n.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleUpdate });
        const logs = auditLogs.entries.first();
        if (!logs) return;

        const { executor, target, createdTimestamp } = logs;
        let difference = Date.now() - createdTimestamp;
        if (difference > 3600000) return;

        const troublemode = await client.db.get(`${o.guild.id}_troublemode`);
        if (troublemode !== true) return; 



        if (executor.id === n.guild.ownerId) return;
        if (executor.id === client.user.id) return;
        try {
            await n.guild.members
                .ban(executor.id, {
                    reason: 'Role Update | While trouble Mode Is Enabled'
                })
                .catch((err) => null);
        } catch (err) {
            return;
        }

        const settings = await getSettings(n.guild);
        if (
            !settings.mainrole.includes(n.id) &&
            n.name !== '@everyone'
        ) {

            await n.setPermissions(o.permissions).catch(() => null);
            await n.setName(o.name).catch(() => null);
            await n.setColor(o.color).catch(() => null);
            await n.setHoist(o.hoist).catch(() => null);
        } else if (settings.mainrole) {
            if (settings.mainrole.includes(n.id)) {

                n.setPermissions([
                    'CREATE_INSTANT_INVITE',
                    'PRIORITY_SPEAKER',
                    'STREAM',
                    'VIEW_CHANNEL',
                    'SEND_MESSAGES',
                    'READ_MESSAGE_HISTORY',
                    'CONNECT',
                    'SPEAK',
                    'CHANGE_NICKNAME'
                ]);
            }
        } else if (n.name === '@everyone') {

            n.guild.roles.everyone.setPermissions([
                'CREATE_INSTANT_INVITE',
                'PRIORITY_SPEAKER',
                'STREAM',
                'VIEW_CHANNEL',
                'SEND_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'CONNECT',
                'SPEAK',
                'CHANGE_NICKNAME'
            ]);
        }
    });
};
