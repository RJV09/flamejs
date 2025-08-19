const { EmbedBuilder } = require('discord.js')
const moment = require('moment')

const verificationLevels = {
    0: 'No Verification',
    1: 'Low Verification',
    2: 'Medium Verification',
    3: 'High Verification',
    4: 'Very High Verification'
}

const booster = {
    0: 'No Boosts',
    1: 'Tier 1 Boosted',
    2: 'Tier 2 Boosted',
    3: 'Tier 3 Boosted'
}

const disabled = '<a:cr:1290949952922718230>'
const enabled = '<a:Tick:1306038825054896209>'

module.exports = {
    name: 'serverinfo',
    category: 'info',
    aliases: ['si'],
    description: 'Fetch detailed information about the server.',
    run: async (client, message, args) => {
        const guild = message.guild
        const { createdTimestamp, ownerId, description } = guild
        
        function checkDays(date) {
            let now = new Date()
            let diff = now.getTime() - date.getTime()
            let days = Math.floor(diff / 86400000)
            return days + (days == 1 ? ' day' : ' days') + ' ago'
        }

        const roles = guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map((role) => role.toString())
            .slice(0, -1)
        
        let rolesdisplay = roles.length < 15 ? roles.join(' ') : `\`Too many roles to display...\``
        
        if (rolesdisplay.length > 1024) rolesdisplay = `${roles.slice(4).join(' ')} \`more..\``

        const members = guild.members.cache
        const channels = guild.channels.cache
        const emojis = guild.emojis.cache

        let banner = guild.bannerURL
        let bans = await message.guild.bans.fetch().then((x) => x.size)

        const boostTier = guild.premiumTier || 0;  // Ensure that it defaults to 0 if not boosted
        const boostCount = guild.premiumSubscriptionCount || 0; // Ensure that it defaults to 0 if no boosts

        if (banner) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)  // Use client.color directly
                        .setTitle(`✨ ${guild.name}'s Server Information ✨`)
                        .setThumbnail(guild.iconURL({ dynamic: true }))
                        .setImage(guild.bannerURL({ size: 4096 }))
                        .addFields([
                            {
                                name: '**🌟 About This Server**',
                                value: `**Server Name:** ${guild.name} \n**Server ID:** ${guild.id} \n**Owner:** <@!${guild.ownerId}> (${guild.ownerId})\n**Created:** <t:${parseInt(createdTimestamp / 1000)}:R>\n**Total Members:** ${guild.memberCount}\n**Banned Members:** ${bans}`
                            },
                            {
                                name: '**🔒 Server Settings**',
                                value: `**Verification Level:** ${verificationLevels[guild.verificationLevel] || 'Unknown'}\n**AFK Channel:** ${guild.afkChannelId ? `<#${guild.afkChannelId}>` : `${disabled}`}\n**AFK Timeout:** ${guild.afkTimeout / 60} mins\n**System Messages Channel:** ${guild.systemChannelId ? `<#${guild.systemChannelId}>` : disabled}\n**Boost Bar:** ${guild.premiumProgressBarEnabled ? enabled : disabled}`
                            },
                            {
                                name: '**📚 Channel Overview**',
                                value: `**Total Channels:** ${channels.size}\n**Text Channels:** ${channels.filter((channel) => channel.type === 'GUILD_TEXT').size} | **Voice Channels:** ${channels.filter((channel) => channel.type === 'GUILD_VOICE').size}`
                            },
                            {
                                name: '**😄 Emoji Stats**',
                                value: `**Regular Emojis:** ${emojis.filter((emoji) => !emoji.animated).size}\n**Animated Emojis:** ${emojis.filter((emoji) => emoji.animated).size}\n**Total Emojis:** ${emojis.size}`
                            },
                            {
                                name: '**🚀 Server Boost Status**',
                                value: `${booster[boostTier]} - [<a:money_fd:1323225048617586718> ${boostCount} Boosts]`
                            },
                            {
                                name: `**🛠️ Server Roles [${roles.length}]**`,
                                value: `${rolesdisplay}`
                            }
                        ])
                        .setTimestamp()
                ]
            })
        }
    }
}
