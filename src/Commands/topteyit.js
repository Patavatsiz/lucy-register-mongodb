const { MessageEmbed } = require('discord.js');
const Data = require('../Models/staffdb');
const value = require('../Json/guildSettings.json');
module.exports = {
  name: "topteyit",
  aliases: ["topteyit"],
  run: async (client, message, args) => {

    async function fembed(color, msg) {
      let embed = new MessageEmbed().setColor(color).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter("Patavatsız ❤️ " + message.guild.name).setTimestamp();
      message.channel.send(embed.setDescription(msg)).then(x => x.delete({ timeout: 10000 }))
    }

    async function tembed(color, msg, msg2) {
      let embed = new MessageEmbed().setColor(color).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter(msg2).setTimestamp();
      message.channel.send(embed.setDescription(msg))
    }

    if (!message.member.roles.cache.has(value.Yetkili) && !message.member.hasPermission("ADMINISTRATOR")) return fembed("RANDOM", "Bu komudu kullanmak için yetkin yetersiz.")
  
    let arr = []
    await Data.find({}, async (err, res) => {
      res.filter(x => message.guild.members.cache.has(x.Author)).map(async (x) => {
        await arr.push({ Author: x.Author, Total: x.Total.length, Male: x.Male, Female: x.Female })
      })
    })
    let kayıt = arr.sort((a, b) => b.Total - a.Total, 0).slice(0, 20)
    let num = 1
    let find = arr.find(x => x.Author === message.author.id)
    let bişi = kayıt.map(x => `\`${num++}.\` <@${x.Author}>: \`${x.Male + x.Female} Kayıt.\`${x.Author === message.author.id ? " **(Siz)** " : ""}`).join("\n")

    await tembed("RANDOM", `Top 20 kayıt sıralaması aşağıda belirtilmiştir.\n\n${bişi}`, `${find ? `Siz ${arr.indexOf(find) + 1}. sırada bulunuyorsunuz. Toplam ${find.Male} erkek, ${find.Female} kadın kaydetmişsiniz.` : "Hiç kayıt bilginiz yok."}`)
  
  }
}