const { MessageEmbed } = require('discord.js');
const Data = require('../Models/userdb');
const Name = require('../Models/namedb');
const value = require('../Json/guildSettings.json');
module.exports = {
  name: "isimler",
  aliases: ["isimler"],
  run: async(client, message, args) => {

    async function fembed(color, msg) {
      let embed = new MessageEmbed().setColor(color).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter("Patavatsız ❤️ " + message.guild.name).setTimestamp();
      message.channel.send(embed.setDescription(msg)).then(x => x.delete({ timeout: 15000 }))
    }

    if (!message.member.roles.cache.has(value.Yetkili) && !message.member.hasPermission("ADMINISTRATOR")) return fembed("RANDOM", "Bu komudu kullanmak için gerekli rollere sahip değilsin!");

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    let x = await Data.find({ User: member.id }, async(err, data) => {
      if(err) return;
      if(!data) return fembed("RED", "Kullanıcının isim geçmişi bulunamadı")
      let datamanager = data.reverse()
      let names = datamanager.map((x, i) => `\`${i + 1}.\` ${x.Name} [${x.Gender}]`).slice(0, 20).join("\n")
      Name.find({ User: member.id }, async(err, xdata, countNames) => {
        if(err) return;
        if(!xdata) {
          countNames = 0
        } else {
         countNames = xdata.map(x => `${x.Names}`)
        
      fembed("RANDOM", `${member} (${member.roles.highest}) kullanıcının toplamda **${countNames}** isim kaydı bulundu ve son 20 ismi aşağıda sıralandı.\n${names}`)
        }
      })
    })

  }
}