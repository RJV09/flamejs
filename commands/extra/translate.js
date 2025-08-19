const translate = require('@iamtraction/google-translate');
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js'); // Import EmbedBuilder

module.exports = {
  name: 'translate',
  aliases: ['tl'],
  category: 'info',
  description: 'Translate a query to English',
  args: false,
  usage: 'translate <query>',
  userPerms: [],
  botPerms: [],
  owner: false,

  run: async (client, message, args, prefix) => {
    let query = null;

    if (args[0]) query = args.join(' ');
    if (!query) {
      try {
        let ref = await message.fetchReference();
        query = ref.content;
      } catch (e) {
        query = null;
      }
    }

    let lang = {
      en: `English`,
      fr: `French`,
      fi: `Finnish`,
      el: `Greek`,
      gu: `Gujarati`,
      hi: `Hindi`,
      it: `Italian`,
      ja: `Japanese`,
      la: `Latin`,
      es: `Spanish`
    };

    if (query != null) {
      const row = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('tl')
            .setPlaceholder('Select a Language to Translate')
            .addOptions(
              [
                { label: 'English', value: 'en' },
                { label: 'Finnish', value: 'fi' },
                { label: 'French', value: 'fr' },
                { label: 'Greek', value: 'el' },
                { label: 'Gujarati', value: 'gu' },
                { label: 'Hindi', value: 'hi' },
                { label: 'Italian', value: 'it' },
                { label: 'Japanese', value: 'ja' },
                { label: 'Latin', value: 'la' },
                { label: 'Spanish', value: 'es' },
              ]
            )
        );

      let tl = await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(`\`\`\`\nTranslating: ${query}\`\`\``)
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setFooter({ text: 'Powered by Google Translator' })
        ],
        components: [row]
      });

      const collector = tl.createMessageComponentCollector({
        filter: (interaction) => {
          if (message.author.id === interaction.user.id) return true;
          else {
            interaction.reply({ content: `${client.emoji.cross} This menu can't be controlled by you`, ephemeral: true });
            return false;
          }
        },
        time: 100000,
        idle: 100000 / 2
      });

      collector.on('collect', async (interaction) => {
        if (interaction.isStringSelectMenu()) {
          if (interaction.customId === 'tl') {
            for (const value of interaction.values) {
              let result = await translate(query, { to: value });

              return interaction.update({
                embeds: [
                  new EmbedBuilder()
                    .setDescription(`\`\`\`\n${lang[value]}: ${result.text}\`\`\``)
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setFooter({ text: 'Powered by Google Translator' })
                ],
                components: []
              });
            }
          }
        }
      });
    } else {
      return message.channel.send('Missing queries to translate');
    }
  }
};
