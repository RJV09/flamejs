const { AuditLogEvent } = require('discord.js');

module.exports = async (client) => {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        // Check if the member is blacklisted
        let check = await client.util.BlacklistCheck(newMember.guild);
        if (check) return;

        // Fetch audit logs to detect role changes
        const auditLogs = await newMember.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberRoleUpdate,
        });

        const logs = auditLogs.entries.first();
        if (!logs) return;

        const { executor, target, createdTimestamp } = logs;

        let difference = Date.now() - createdTimestamp;
        if (difference > 3600000) return; // Only react to role updates in the last hour

        // Get the "antinuke" flag from the database
        const antinuke = await client.db.get(`${newMember.guild.id}_antinuke`);
        if (antinuke !== true) return; // If antinuke is not enabled, do nothing

        // Check if the executor is the owner or the bot itself, and ignore them
        if (executor.id === newMember.guild.ownerId) return;
        if (executor.id === client.user.id) return;

        // Check roles added
        const rolesAdded = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

        // Only proceed if a role was added
        if (rolesAdded.size > 0) {
            try {
                // Fetch all roles in the guild
                const allRoles = newMember.guild.roles.cache;

                // Automatically detect high-level roles based on permissions
                const highLevelPermissions = ['ADMINISTRATOR', 'BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_GUILD'];

                // Identify high-level roles by checking their permissions
                const highLevelRoles = allRoles.filter(role => 
                    highLevelPermissions.some(perm => role.permissions.has(perm))
                );

                // Check if any of the added roles are high-level
                const isHighLevelRoleAdded = rolesAdded.some(role => highLevelRoles.has(role.id));

                if (isHighLevelRoleAdded) {
                    // Ensure the executor (the one who assigns the role) is whitelisted
                    const isExecutorWhitelisted = await client.db.get(`${executor.id}_whitelisted`);
                    if (!isExecutorWhitelisted) {
                        // If the executor is not whitelisted, revoke the role from the target user (newMember)
                        await newMember.roles.set(oldMember.roles.cache.map(role => role.id)); // Revert to previous roles

                        // Log this action
                        console.log(`Role update revoked for ${newMember.user.tag} (high-level role assigned by unwhitelisted user).`);

                        // Immediately ban the executor (the one assigning the role)
                        await newMember.guild.members.ban(executor, { reason: `Assigned a high-level role to ${newMember.user.tag} without being whitelisted.` });

                        // Log the ban action
                        console.log(`User ${executor.user.tag} was banned for assigning a high-level role to ${newMember.user.tag} while unwhitelisted.`);
                    }
                }
            } catch (err) {
                if (err.code === 429) {
                    await client.util.handleRateLimit(); // Handle rate-limiting
                }
                return;
            }
        }
    });
};
