const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const mongoose = require('mongoose');

const ricky = ['1387826587172343990', '1387826587172343990'];

const config = require(`${process.cwd()}/config.json`);

mongoose.connect(config.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const RolePermissionSchema = new mongoose.Schema({
    guildId: String,
    roleId: String,
    adminPermissions: String 
});
const rolePermissionSchema = mongoose.model('Nightmode', RolePermissionSchema);

module.exports = {
    name: 'nightmode',
    aliases: [],
    cooldown: 10,
    category: 'security',
    premium: true,
    run: async (client, message, args) => {
        if (message.guild.memberCount < 1) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Your server does not meet the 30-member requirement.`
                        )
                ]
            });
        }

        const isOwner = message.author.id === message.guild.ownerId || ricky.includes(message.author.id);
        if (!isOwner) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Only the server owner or an authorized user can run this command.`
                        )
                ]
            });
        }

        const botHighestRole = message.guild.members.me.roles.highest;
        const option = args[0];

        const nightmodeEmbed = new EmbedBuilder()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(`__**Nightmode**__`)
            .setDescription(
                `Enhance your server's security with the Nightmode feature! This powerful tool swiftly manages roles, ensuring your community stays secure and protected. Nightmode enables you to quickly disable dangerous permissions for manageable roles, such as removing the powerful \`ADMINISTRATOR\` rights. Additionally, it stores original permissions, allowing for seamless restoration when needed.`
            )
            .addFields([
                {
                    name: `__**Nightmode Enable**__`,
                    value: `To enable Nightmode - \`${prefix}nightmode enable\``
                },
                {
                    name: `__**Nightmode Disable**__`,
                    value: `To disable Nightmode - \`${prefix}nightmode disable\``
                }
            ])

        if (!option) {
            return message.channel.send({ embeds: [nightmodeEmbed] });
        }

        if (option === 'enable') {
            const manageableRoles = message.guild.roles.cache.filter(
                role =>
                    role.comparePositionTo(botHighestRole) < 0 &&
                    role.permissions.has(PermissionsBitField.Flags.Administrator)
            );

            if (manageableRoles.size === 0) {
                return message.channel.send('No roles with `ADMINISTRATOR` found.');
            }

            await Promise.all(
                manageableRoles.map(async role => {
                    try {
                        const originalPermissions = role.permissions.bitfield.toString(); 
                        const updatedPermissions = new PermissionsBitField(role.permissions).remove(
                            PermissionsBitField.Flags.Administrator
                        );
                        await role.setPermissions(updatedPermissions, 'Nightmode Enabled');
                        await rolePermissionSchema.updateOne(
                            { guildId: message.guild.id, roleId: role.id },
                            { adminPermissions: originalPermissions },
                            { upsert: true }
                        );
                    } catch (err) {
                        console.error(`Failed to modify role ${role.id}:`, err);
                    }
                })
            );
            return message.channel.send('Nightmode enabled! Dangerous permissions removed.');
        } else if (option === 'disable') {
            const storedRoles = await rolePermissionSchema.find({ guildId: message.guild.id });

            if (storedRoles.length === 0) {
                return message.channel.send('No stored permissions found for restoration.');
            }
            await Promise.all(
                storedRoles.map(async storedRole => {
                    const role = message.guild.roles.cache.get(storedRole.roleId);
                    if (!role) return;

                    try {
                        const restoredPermissions = new PermissionsBitField(BigInt(storedRole.adminPermissions));
                        await role.setPermissions(restoredPermissions, 'Nightmode Disabled');
                        await rolePermissionSchema.deleteOne({ guildId: message.guild.id, roleId: storedRole.roleId });
                    } catch (err) {
                        console.error(`Failed to restore role ${storedRole.roleId}:`, err);
                    }
                })
            );
            return message.channel.send('Nightmode disabled! Permissions restored.');
        } else {
            return message.channel.send({ embeds: [nightmodeEmbed] });
        }
    }
};
