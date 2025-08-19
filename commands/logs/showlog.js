const { Discord,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");
  
  module.exports = {
    name: "showlog",
    aliases: ["showlogs", "logconfig", "viewlog"],
    description: "Shows the config of the logs setupped.",
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

        
    let data2 = await client.data.get(`logs_${message.guild.id}`) 

    if(!data2) {
        return await message.channel.send({ embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setTitle('Logging System Not Configured')
              .setDescription('Your server does not have a configured logging system.')
              .addField('How to configure logging?', 'Use appropriate commands to set up logging')
          ]})
    } else if(data2) {
        const logs = new EmbedBuilder()
        .setColor(client.color)
        .setTitle('Server Logs Configuration')
        .setThumbnail(message.guild.iconURL({ dynamic : true }))
          if(data2.channel) logs.addFields({ name: 'Channel logs', value: `<#${data2?.channel}>`})
          if(!data2.channel) logs.addFields({ name: 'Channel logs', value: `\`NOT SET\``})
          if(data2.message) logs.addFields({ name: 'Message logs', value: `<#${data2?.message}>`})
          if(!data2.message) logs.addFields({ name: 'Message logs', value: `\`NOT SET\``})
          if(data2.voice) logs.addFields({ name: 'Voice logs', value: `<#${data2?.voice}>`})
          if(!data2.voice) logs.addFields({ name: 'Voice logs', value: `\`NOT SET\``})

        .setTimestamp()
      await message.channel.send({ embeds: [logs] });
      
    }

}}

