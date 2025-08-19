const { EmbedBuilder } = require('discord.js');

module.exports = async (client, message) => {
    try {
        if (!message || typeof message !== 'object') {

            return;
        }
        if (!message?.guild?.available) return;
        if (message.author?.bot) return;
        if (!client.db) {
            return;
        }
        const config = await client.db.get(`${message.guild.id}_antieveryone_config`).catch(() => null) || { 
            enabled: false, 
            bypassUsers: [],
            bypassRoles: [] 
        };
        if (!config.enabled) return;
        let member;
        try {
            member = await message.guild.members.fetch(message.author.id);
        } catch (err) {

            return;
        }
        const hasBypass = 
            config.bypassUsers?.includes(message.author.id) ||
            member.roles.cache.some(role => config.bypassRoles?.includes(role.id));
        
        if (hasBypass) return;
        if (message.mentions?.everyone || /@(everyone|here)/.test(message.content || '')) {
            await message.delete().catch(err => 
                console.error(`[AntiEveryone] Couldn't delete message:`, err)
            );
            
            const warning = await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF0000')
                        .setDescription(`⚠️ Everyone Ping protection triggered`)
                ]
            }).catch(console.error);

            if (warning) setTimeout(() => warning.delete().catch(() => {}), 3000);
        }
    } catch (error) {
        console.error('[AntiEveryone CRITICAL ERROR]', error);
    }
};