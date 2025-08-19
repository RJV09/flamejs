const ms = require('ms');
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'gstart',
  aliases: ['startgw'],
  category: 'giveaway',
  description: 'Start a giveaway',
  args: false,
  usage: 'gstart <duration> <winners> <prize>',
  userPerms: ['ManageGuild'],
  botPerms: [],
  owner: false,

  run: async (client, message, args, prefix) => {
    if (!args[0] || !args[1] || !args[2]) {
      return message.channel.send({ 
        embeds: [new EmbedBuilder().setDescription(`\`${prefix}gstart <time> <winners> <prize>\``)] 
      });
    }

    let time = args[0];
    let duration = ms(time);
    let winners = parseInt(args[1]);
    let prize = String(args.slice(2).join(" "));

    if (prize.length > 200) {
      return message.channel.send({
        embeds: [new EmbedBuilder().setDescription(`${client.emoji.cross} ${message.author}: Prize length cannot be greater than 200 characters`)]
      });
    }

    if (winners > 50) {
      return message.channel.send({
        embeds: [new EmbedBuilder().setDescription(`${client.emoji.cross} ${message.author}: Winner count must not be greater than 50`)]
      });
    }

    if (duration > 3456000000) {
      return message.channel.send({
        embeds: [new EmbedBuilder().setDescription(`${client.emoji.cross} ${message.author}: Giveaway duration must not be longer than 40 days`)]
      });
    }

    message.delete();

    const response = await start(message.member, message.channel, duration, prize, winners, message.member);
    message.channel.send(response).then((msg) => {
      setTimeout(() => msg.delete(), 1000);
    }).catch((err) => {});

  }
};


async function start(member, giveawayChannel, duration, prize, winners, host) {
  try {
    let time = `${Math.round((Date.now() + duration) / 1000)}`;
    await member.client.giveawaysManager.start(giveawayChannel, {
      duration: duration,
      prize,
      winnerCount: winners,
      hostedBy: member,
      messages: {
        giveaway: `**<a:giveway:1286629716476039169> Giveaway**`,
        title: '<a:emoji_1725906343263:1282768920922558474> {this.prize}',
        drawing: '',
        winMessage: { 
          content: '{winners}',
          embed: new EmbedBuilder()
            .setDescription('You won **{this.prize}**! Kindly contact the giveaway host {this.hostedBy} to claim your rewards.')
            .setFooter({ text: 'Giveaway Ended' }),
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel('Giveaway Link')
                .setStyle(5)  // Using numeric value 5 for Link style button
                .setURL(`https://discord.com/channels/{this.guildId}/{this.channelId}/{this.messageId}`)
            )
          ],
          replyToGiveaway: true
        },
        noWinner: `Giveaway cancelled, no valid participations.`,
        giveawayEnded: `**:tada: Ended :tada:**`,
        inviteToParticipate: `\nEnds: <t:${time}:R> (<t:${time}:f>)\nHosted by: ${host}\n\n[Invite me](${member.client.invite})`,
        winners: `Winner(s):`,
        hostedBy: '',
        endedAt: 'Ended At',
        embedFooter: '{this.winnerCount} winner | Ends At',
      }
    }).catch(() => {});

    return { 
      embeds: [new EmbedBuilder().setColor(giveawayChannel.client.color).setDescription(`${giveawayChannel.client.emoji.tick} ${member}: Giveaway started in ${giveawayChannel}`)] 
    };
  } catch (error) {
    console.log(error);
  }
}
