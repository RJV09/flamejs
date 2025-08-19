module.exports = {
    name: "unmute",
    UserPerms: ['ModerateMembers'],
    aliases: ["unmute"],
    usage: "<ID|@member> [reason]",
    BotPerms: ['ModerateMembers'],
    category: 'mod',
    voteOnly: true,
    run: async function (client, message, args) {
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!target) {
            return message.reply('<a:stolen_emoji:1330513545112064092> | Please mention a user to remove timeout.');
        }

        if (!target.communicationDisabledUntilTimestamp || target.communicationDisabledUntilTimestamp < Date.now()) {
            return message.reply(`<@${target.user.id} is not currently timed out.`);
        }

        try {
            await target.timeout(null, reason);
            message.reply(`<a:Tick:1306038825054896209> | Successfully unmuted <@${target.user.id}> `); // Corrected here
        } catch (error) {
            console.error('unmute command error:', error);
            message.reply('An error occurred while removing the timeout.');
        }
    },
};
