/** @format */

const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'autorole',
  category: 'welcomer',
  aliases: ["autoroles", "arole"],
  description: 'Add/Remove roles to be given to new members upon joining',
  args: true,
  usage: 'autorole <humans/bots/show/reset> [add/remove] [role]',
  userPerms: ['Administrator'],
  botPerms: ['ManageGuild'],
  aboveme: true,
  owner: false,
  run: async (client, message, args, prefix) => {
    let arh = await client.db.get(`arh_${message.guild.id}`) || [];
    let arb = await client.db.get(`arb_${message.guild.id}`) || [];

    let ar = args[0];

    if (ar === `humans` || ar === `human`) {
      let type = args[1];

      if (type === `add` || type === `+`) {
        let rid = message.mentions.roles.first()?.id || args[2]?.replace(/[^0-9]/g, '');
        let role = rid ? await message.guild.roles.fetch(rid, { force: true }).catch(() => {}) : null;

        if (!role || !rid) {
          return client.emit(`invalidRole`, message);
        }

        if (role.managed === true) {
          return message.channel.send({embeds: [new EmbedBuilder().setDescription(`${client.emoji.cross} ${message.author}: You can't use integrated roles`)]});
        }

        if (role.permissions.has('Administrator')) {
          return message.channel.send({embeds: [new EmbedBuilder().setDescription(`${client.emoji.cross} ${message.author}: You can't use roles with **Admin Permissions**`)]});
        }

        if (arh.includes(role.id)) {
          return message.channel.send({embeds: [new EmbedBuilder().setDescription(`${client.emoji.cross} ${message.author}: ${role} is already in Human Autoroles`)]});
        }

        if (arh.length > 4) {
          return message.channel.send(`You can't add more than 5 roles!`);
        }

        await arh.push(role.id);
        await client.db.set(`arh_${message.guild.id}`, arh);
        return message.channel.send({embeds: [new EmbedBuilder().setDescription(`${client.emoji.tick} ${message.author}: **Added** ${role.name} to Human Autoroles`)]});
      } else if (type === `remove` || type === `-`) {
        let rid = message.mentions.roles.first()?.id || args[2]?.replace(/[^0-9]/g, '');
        let role = rid ? await message.guild.roles.fetch(rid, { force: true }).catch(() => {}) : null;

        if (!role || !rid) {
          return client.emit(`invalidRole`, message);
        }

        if (!arh.includes(role.id)) {
          return message.channel.send({embeds: [new EmbedBuilder().setDescription(`${client.emoji.cross} ${message.author}: ${role} is not in Human Autoroles`)]});
        }

        arh = arh.filter((r) => r !== role.id);
        await client.db.set(`arh_${message.guild.id}`, arh);
        return message.channel.send({embeds: [new EmbedBuilder().setDescription(`${client.emoji.tick} ${message.author}: **Removed** ${role.name} from Human Autoroles`)]});
      } else {
        return message.channel.send({embeds: [new EmbedBuilder().addFields([
          {name: `\`${prefix}autorole humans\``, value: `\`${prefix}autorole humans add\`\nAdd roles to human autoroles\n\n\`${prefix}autorole humans remove\`\nRemove roles from human autoroles`}
        ]).setFooter({text: client.user.username + ` • Page 1/1`, iconURL: client.user.displayAvatarURL()})]});
      }
    } else if (ar === `bots` || ar === `bot`) {
      let type = args[1];

      if (type === `add` || type === `+`) {
        let rid = message.mentions.roles.first()?.id || args[2]?.replace(/[^0-9]/g, '');
        let role = rid ? await message.guild.roles.fetch(rid, { force: true }).catch(() => {}) : null;

        if (!role || !rid) {
          return client.emit(`invalidRole`, message);
        }

        if (role.managed === true) {
          return message.channel.send({embeds: [new EmbedBuilder().setDescription(`${client.emoji.cross} ${message.author}: You can't use integrated roles`)]});
        }

        if (role.permissions.has('Administrator')) {
          return message.channel.send({embeds: [new EmbedBuilder().setDescription(`${client.emoji.cross} ${message.author}: You can't use roles with **Admin Permissions**`)]});
        }

        if (arb.includes(role.id)) {
          return message.channel.send({embeds: [new EmbedBuilder().setDescription(`${client.emoji.cross} ${message.author}: ${role} is already in Bot Autoroles`)]});
        }

        if (arb.length > 2) {
          return message.channel.send(`You can't add more than 3 roles!`);
        }

        await arb.push(role.id);
        await client.db.set(`arb_${message.guild.id}`, arb);
        return message.channel.send({embeds: [new EmbedBuilder().setDescription(`${client.emoji.tick} ${message.author}: **Added** ${role.name} to Bot Autoroles`)]});
      } else if (type === `remove` || type === `-`) {
        let rid = message.mentions.roles.first()?.id || args[2]?.replace(/[^0-9]/g, '');
        let role = rid ? await message.guild.roles.fetch(rid, { force: true }).catch(() => {}) : null;

        if (!role || !rid) {
          return client.emit(`invalidRole`, message);
        }

        if (!arb.includes(role.id)) {
          return message.channel.send({embeds: [new EmbedBuilder().setDescription(`${client.emoji.cross} ${message.author}: ${role} is not in Bot Autoroles`)]});
        }

        arb = arb.filter((r) => r !== role.id);
        await client.db.set(`arb_${message.guild.id}`, arb);
        return message.channel.send({embeds: [new EmbedBuilder().setDescription(`${client.emoji.tick} ${message.author}: **Removed** ${role.name} from Bot Autoroles`)]});
      } else {
        return message.channel.send({embeds: [new EmbedBuilder().addFields([
          {name: `\`${prefix}autorole bots\``, value: `\`${prefix}autorole bots add\`\nAdd roles to bot autoroles\n\n\`${prefix}autorole bots remove\`\nRemove roles from bot autoroles`}
        ]).setFooter({text: client.user.username + ` • Page 1/1`, iconURL: client.user.displayAvatarURL()})]});
      }
    } else if (ar === `show` || ar === `config`) {
      let insaan = "";
      let majdoor = "";

      for (let i = 0; i < arh.length; i++) {
        let role = await message.guild.roles.fetch(arh[i]);
        insaan += `\`[${i + 1}]\`  -  ${role}\n`;
      }

      for (let i = 0; i < arb.length; i++) {
        let role = await message.guild.roles.fetch(arb[i]);
        majdoor += `\`[${i + 1}]\`  -  ${role}\n`;
      }

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({name: `FlaMe Autoroles`, iconURL: message.guild.iconURL({dynamic: true})})
            .setFooter({text: `Requested By ` + message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .addFields([
              {name: `Human Autoroles`, value: insaan.length > 0 ? insaan : `None`},
              {name: `Bot Autoroles`, value: majdoor.length > 0 ? majdoor : `None`}
            ])
        ]
      });
    } else if (ar === `reset` || ar === `clear`) {
      let arhButton = new ButtonBuilder().setCustomId('arh').setLabel('Clear Humans').setStyle('Secondary');
      let arbButton = new ButtonBuilder().setCustomId('arb').setLabel('Clear Bots').setStyle('Secondary');
      let arallButton = new ButtonBuilder().setCustomId('arall').setLabel('Clear All').setStyle('Danger');

      let arr = await message.channel.send({
        embeds: [new EmbedBuilder().setDescription(`${client.emoji.ham} Select the autorole module you would like to **Clear**`)],
        components: [new ActionRowBuilder().addComponents(arhButton, arbButton, arallButton)]
      });

      const collector = await arr.createMessageComponentCollector({
        filter: (interaction) => interaction.user.id === message.author.id,
        time: 100000,
        idle: 50000
      });

      collector.on('collect', async (interaction) => {
        if (interaction.isButton()) {
          if (interaction.customId === 'arh') {
            await client.db.delete(`arh_${message.guild.id}`);
            return interaction.update({embeds: [new EmbedBuilder().setDescription(client.emoji.tick + ` Cleared the Human Autoroles setup`)], components: []});
          }
          if (interaction.customId === 'arb') {
            await client.db.delete(`arb_${message.guild.id}`);
            return interaction.update({embeds: [new EmbedBuilder().setDescription(client.emoji.tick + ` Cleared the Bot Autoroles setup`)], components: []});
          }
          if (interaction.customId === 'arall') {
            await client.db.delete(`arh_${message.guild.id}`);
            await client.db.delete(`arb_${message.guild.id}`);
            return interaction.update({embeds: [new EmbedBuilder().setDescription(client.emoji.tick + ` Cleared all the Autoroles setup`)], components: []});
          }
        }
      });
    } else {
      return message.channel.send({
        embeds: [
          new EmbedBuilder().addFields([
            {name: `\`autorole\``, value: `\`autorole humans\`\nAdd/Remove roles from human autoroles\n\n\`autorole bots\`\nAdd/Remove roles from bot autoroles\n\n\`autorole show\`\nShows the current configurations for autorole\n\n\`autorole reset\`\nReset the autorole options`}
          ])
        ]
      });
    }
  }
};
