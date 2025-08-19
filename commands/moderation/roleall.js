const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name: 'roleall',
    category: 'mod',
    aliases: ['rall'],
    premium: false,
    
    run: async (client, message, args) => {
        // Check if the command user has permission to manage roles
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            const permissionEmbed = new EmbedBuilder()
                .setColor('#000000')
                .setDescription('<a:Cross:1265733965180960849> **You do not have permission to manage roles.** ');
            return message.reply({ embeds: [permissionEmbed] });
        }

        // Check if a role is mentioned or if a role ID is provided
        let role;
        if (message.mentions.roles.size > 0) {
            role = message.mentions.roles.first();
        } else {
            role = message.guild.roles.cache.get(args[0]);
        }

        // Check if a valid role is found
        if (!role) {
            const mentionEmbed = new EmbedBuilder()
                .setColor('#000000')
                .setDescription('<a:Cross:1265733965180960849> **Please mention a valid role or provide a valid role ID.** ');
            return message.reply({ embeds: [mentionEmbed] });
        }

        // Fetch all members in the server
        const members = await message.guild.members.fetch();

        // Create buttons for assigning roles to humans and bots
        const assignToHumansButton = new ButtonBuilder()
            .setCustomId('assign_to_humans')
            .setLabel('Add to Humans')
            .setEmoji('<:members:1260132949454753852>')
            .setStyle('Success');

        const assignToBotsButton = new ButtonBuilder()
            .setCustomId('assign_to_bots')
            .setLabel('Add to Bots')
            .setEmoji('<:bot:1260834300862005250>')
            .setStyle('Success');

        // Create an action row for the buttons
        const actionRow = new ActionRowBuilder()
            .addComponents(assignToHumansButton, assignToBotsButton);

        // Success embed to initially show
        const successEmbed = new EmbedBuilder()
            .setColor('#000000')
            .setDescription(`<a:Check:1265733979085078610> **Successfully prepared to assign role** ${role.name}.`);

        // Send the initial embed with buttons
        const reply = await message.reply({ embeds: [successEmbed], components: [actionRow] });

        // Handle button interactions
        const filter = (interaction) => interaction.customId === 'assign_to_humans' || interaction.customId === 'assign_to_bots';
        const collector = reply.createMessageComponentCollector({ filter, time: 15000 }); // Adjust time as needed

        collector.on('collect', async interaction => {
            try {
                if (interaction.customId === 'assign_to_humans') {
                    // Filter members who are humans
                    const humansWithoutRole = members.filter(member => !member.user.bot && !member.roles.cache.has(role.id));
                    await assignRoleToMembers(humansWithoutRole, role, interaction);
                } else if (interaction.customId === 'assign_to_bots') {
                    // Filter members who are bots
                    const botsWithoutRole = members.filter(member => member.user.bot && !member.roles.cache.has(role.id));
                    await assignRoleToMembers(botsWithoutRole, role, interaction);
                }
            } catch (error) {
                console.error('Error processing button interaction:', error);
            }
        });

        collector.on('end', () => {
            // Disable the buttons after the collector ends
            actionRow.components.forEach(component => component.setDisabled(true));
            reply.edit({ embeds: [successEmbed], components: [actionRow] });
        });

        async function assignRoleToMembers(membersToAssign, role, interaction) {
            for (const member of membersToAssign.values()) {
                try {
                    await member.roles.add(role.id);
                } catch (error) {
                    console.error(`Failed to add role to ${member.user.tag}:`, error);
                }
            }

            // Acknowledge button click with a message
            await interaction.update({ content: '<a:Check:1265733979085078610> **Role assignment completed.** ', components: [] }); // Remove buttons
        }
    }
};
