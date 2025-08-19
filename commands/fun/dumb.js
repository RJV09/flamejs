const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "dumb",
  aliases: [],
  edesc: "hack @user",
  description: "Simulates hacking",
  userPermissions: [],
  botPermissions: [],
  category: "Fun",
  cooldown: 5,

  execute: async (client, message, args, prefix) => {
    // Delete the command message
    await message.delete({ timeout: 300 });

    // Get the mentioned member
    let member = message.mentions.members.first();
    if (!member) {
      return message.reply("Mention someone to hack.");
    }

    // Define the steps with text and delays
    const steps = [
      { text: "**[5%]** Finding discord login... [2fa bypassed]", delay: 2100 },
      { text: "**[15%]** Discord login found, finding IP...", delay: 3200 },
      { text: "**[30%]** IP FOUND! Looking for email and password...", delay: 3100 },
      { text: `**[50%]** DONE! Email: ${member.user.tag}@gmail.com｜Password: XuIsjgi9cg_`, delay: 1800 },
      { text: "**[75%]** Installing trojan virus...", delay: 4000 },
      { text: `**[100%]** Done hacking ${member.user.tag}`, delay: 2100 },
      { text: `<a:Tick:1306038825054896209>  | **Successfully hacked ${member.user.tag} Sent All Data To Ali_Mughal Webhook**`, delay: 2100 }
    ];

    // Send initial message with embed
    let embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(steps[0].text);

    let msg = await message.channel.send({ embeds: [embed] });

    // Sequentially update the embed message
    for (const step of steps.slice(1)) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      embed.setDescription(step.text);
      await msg.edit({ embeds: [embed] });
    }
  }
};