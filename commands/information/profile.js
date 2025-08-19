const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'profile',
    aliases: ['badge', 'badges', 'achievement', 'pr'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        const user =
            message.mentions.users.first() ||
            client.users.cache.get(args[0]) ||
            message.author;

        const destroyer = user.id === '1387826587172343990';
        let badges = '';

        const guild = await client.guilds.fetch('1306042445812731914');

        let sus;
        try {
            sus = await guild.members.fetch(user.id);
        } catch (e) {
            badges = '`No Badge Available`';
        }

        if (destroyer) {
            badges += `\n<a:emoji_1725906997325:1306042477282590771>・**[MughaL](https://discord.com/users/1387826587172343990)**`;
        }

        try {
            const dev = sus.roles.cache.has('1291097238336049194');
            if (dev) badges += `\n<a:dev:1291433691037565008>・**Developer**`;

            const own = sus.roles.cache.has('1291098211305521195');
            if (own) badges += `\n<a:oz:1291416157114339482>・**Owner**`;

            const han = sus.roles.cache.has('1291098239524933734');
            if (han) badges += `\n<a:admin:1291442363138572318>・**Admin**`;

            const manager = sus.roles.cache.has('1291098300820361277');
            if (manager) badges += `\n<:mog:1291443886203605054>・**Mod**`;

            const aman = sus.roles.cache.has('1291098366037594132');
            if (aman) badges += `\n<a:sup:1291440696355459193>・**Support Team**`;

            const hundi = sus.roles.cache.has('1291098413257199727');
            if (hundi) badges += `\n<:bughunter:1291433689120509952>・**Bug Hunter**`;

            const supp = sus.roles.cache.has('1291098456529571940');
            if (supp) badges += `\n<a:pre:1291441311714643999>・**Premium User**`;

            const fr = sus.roles.cache.has('1291098499697606676');
            if (fr) badges += `\n<:friend:1291433693893890068>・**Friends**`;
        } catch (err) {
            badges = badges || '`No Badge Available`';
        }

        const pr = new EmbedBuilder()
            .setAuthor({
                name: `Profile For ${user.username}#${user.discriminator}`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTimestamp()
            .setDescription(`**BADGES** <a:bz:1291425807004209173>\n${badges || '`No Badge Available`'}`);

        message.channel.send({ embeds: [pr] });
    },
};
