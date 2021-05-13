const { MessageEmbed } = require('discord.js');
const Data = require('../Models/staffdb');
const value = require('../Json/guildSettings.json');
module.exports = {
  name: "teyitsay",
  aliases: ["teyitsay", "kayıtlarım"],
  run: async(client, message, args) => {

    async function fembed(color, msg) {
      let embed = new MessageEmbed().setColor(color).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter("Patavatsız ❤️ " + message.guild.name).setThumbnail(message.author.avatarURL({ dynamic: true })).setTimestamp();
      message.channel.send(embed.setDescription(msg)).then(x => x.delete({ timeout: 10000 }))
    }

    if (!message.member.roles.cache.has(value.Yetkili) && !message.member.hasPermission("ADMINISTRATOR")) return fembed("RANDOM", "Bu komudu kullanmak için yetkin yetersiz.")

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

    if(user) {
    let x = await Data.findOne({ Author: user.id }, async(err, data) => {
      if(err) return;
      if(!data) return fembed("RED", "Yetkili hiç kayıt yapmamış!")
      let kayıtlar = data.map(x => `**Toplam kayıt sayısı: ${x.Total ? x.Total : "0"}\nToplam erkek kayıt sayısı: ${x.Male ? x.Male : "0"}\nToplam kadın kayıt sayısı: ${x.Female ? x.Female : "0"}**`)
      fembed("RANDOM", `${kayıtlar}`) 
    });
    } else if(!user) {
      let x = await Data.find({ Author: message.author.id }, async (err, data) => {
        if (err) return;
        if (!data) return fembed("RED", "Yetkili hiç kayıt yapmamış!")
        let kayıtlar = data.map(x => `**Toplam kayıt sayısı: ${x.Total ? x.Total : "0"}\nToplam erkek kayıt sayısı: ${x.Male ? x.Male : "0"}\nToplam kadın kayıt sayısı: ${x.Female ? x.Female : "0"}**`)
        fembed("RANDOM", `${kayıtlar}`)
      });
    }
  

  }
}