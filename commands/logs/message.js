const { Discord,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");
  
  module.exports = {
    name: "messagelog",
    aliases: ["messagelogs"],
    description: "Message Logs.",
    category: "logging",
    adminPermit : true,
    cooldown: 5,
    run: async (client, message, args, prefix) => {     
             if (!message.member.permissions.has('ManageGuild')){
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have \`MANAGE SERVER\` permissions to use this command.`
                        )
                ]
            })
        }


    let channel = getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0])
if(!channel){
    await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setTitle('Invalid Channel')
            .setDescription('Please provide a valid channel for channel logs.')
        ],
      });
    }
if(channel) {
    let data2 = await client.data.get(`logs_${message.guild.id}`)
    if(!data2){
        await client.data.set(`logs_${message.guild.id}`,{ 
            voice : null,
            channel : null,
            rolelog : null,
            modlog : null,   
            message : null,
            memberlog : null
        })
        const initialMessage = await message.channel.send({
            embeds: [new EmbedBuilder().setColor(client.color).setDescription('Configuring your server...')],
          });

          initialMessage.edit({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setTitle('Server Configuration Successful')
                .setDescription('Your server has been successfully configured for logging.')
            ],
          });
                } 
if(data2) {
    await client.data.set(`logs_${message.guild.id}`,{ 
        voice : data2 ? data2.voice : null,
        channel : data2 ? data2.channel : null,
        rolelog : data2 ? data2.rolelog : null,
        modlog : data2 ? data2.modlog : null,   
        message : channel.id,
        memberlog : data2 ? data2.memberlog : null
    })
    await message.channel.send({
        embeds:[new EmbedBuilder().setColor(client.color)            
               .setTitle('Message Logs Configured')
            .setDescription(`The channel ${channel} has been successfully configured for logging Channel-related events.`)
            .addFields({ name: 'Types of Message Logging Enabled', value: '\`Message Update\`\n\`Message Delete\`', inline: false })
            .addFields({ name: 'What happens now?', value: 'The bot will log message delete, message update in the configured channel.', inline: false })],
    })
    }
}
}
}
function getChannelFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<#(\d+)>$/); 
    if (!matches) return null;

    const channelId = matches[1];
    return message.guild.channels.cache.get(channelId);
}
