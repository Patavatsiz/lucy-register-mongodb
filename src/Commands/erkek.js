const { MessageEmbed } = require('discord.js')
const User = require('../Models/userdb')
const Staff = require('../Models/staffdb');
const Name = require('../Models/namedb');
const value = require('../Json/guildSettings.json');
const moment = require('moment');
module.exports = {
  name: "erkek",
  aliases: ["erkek", "e"],
  run: async(client, message, args) => {
    // embed fonksiyonu
    async function fembed(color, msg) {
      let embed = new MessageEmbed().setColor(color).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter("Patavatsız ❤️ " + message.guild.name).setTimestamp();
      message.channel.send(embed.setDescription(msg)).then(x => x.delete({ timeout: 10000 }))
    }
    // embed fonksiyonu son

    // logembed fonksiyonu
    async function lembed(color, msg) {
      let embed = new MessageEmbed().setColor(color).setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setFooter("Patavatsız ❤️ " + message.guild.name).setTimestamp();
      client.channels.cache.get(value.Log).send(embed.setDescription(msg))
    }
    // logembed fonksiyonu son

    // yetkili belirtme
    if(!message.member.roles.cache.has(value.Yetkili) && !message.member.hasPermission("ADMINISTRATOR")) return fembed("RANDOM", "Bu komudu kullanmak için gerekli rollere sahip değilsin!");
    // yetkili belirtme son

    //kullanıcı tanımı ve yasaklı kayıtlar
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member || !member.id === message.author.id || member.id === message.guild.owner.id || member.user.bot || member.roles.highest.position >= message.member.roles.highest.position) return message.react(value.emojiHayir)
    //kullanıcı tanımı ve yasaklı kayıtlar son

    //isim, yaş, tag tanımları ve düzenlemeler
    let isim = args[1].charAt(0).replace("i", "İ").toLocaleUpperCase() + args[1].slice(1).toLocaleLowerCase();
    if (!isim) return fembed("RED", "Bir isim belirtin")
    let yas = Number(args[2]);
    let fixTag = member.user.username.includes(value.Tag) ? value.Tag : value.Untag
    var name
    if(yas) name = `${fixTag} ${isim} | ${yas}`;
    if(!yas) name = `${fixTag} ${isim}`;
    //isim, yaş, tag tanımları ve düzenlemeler son

    // kayıtlı mı ?
    if(member.roles.cache.has(value.erkek1) || member.roles.cache.has(value.erkek2)) return message.react(value.emojiHayir) 
    if(member.roles.cache.has(value.erkek1) && member.roles.cache.has(value.erkek2) && member.roles.cache.has(value.Kayıtsız)) return member.roles.remove(value.Kayıtsız);
    //kayıtlı mı ?

    /* taglı alım 
    if(!member.roles.cache.has(value.Vip) && !member.roles.cache.has(value.Booster) && !member.user.username.includes(value.Tag)) { fembed("RED", "Sunucumuz şuanda taglı alım yapmaktadır. Kullanıcılar ancak tag alarak veya boost yaparak kayıt olabilir!")
    message.react(value.emojiHayir)} 
    taglı alım son */


  // Rol ekleme ve isim değiştirme
  member.setNickname(`${name}`)
  member.roles.add(value.erkek1)
  member.roles.add(value.erkek2)
  member.roles.remove(value.Kayıtsız)
  member.user.username.includes(value.Tag) ? member.roles.add(value.TagRol) : ""
  // Rol ekleme ve isim değiştirme son

  // db ekleme
  let userdata = await new User({ User: member.id, Name: name, Gender: "Erkek"}); userdata.save().catch(err => { })
    let namedata = await Name.findOne({ User: member.id })
    if (namedata) {
      namedata.Names++
      namedata.save().catch(err => { })
    } else {
      let newNameData = await new Name({ User: member.id, Names: 1 }); newNameData.save().catch(err => { })
    }
  let checkstaffdata = await Staff.findOne({ Author: message.author.id })
  if(checkstaffdata) {
    checkstaffdata.Total++
    checkstaffdata.Male++
    checkstaffdata.save().catch(err => { })
  } else {
    let newstaffdata = await new Staff({ Author: message.author.id, Total: 1, Male: 1, Female: 0 }); newstaffdata.save().catch(err => { })
  }
  //db ekleme son

  //log ve kayıt mesajı
      let sta = await Staff.find({ Author: message.author.id}, async(err, data) => {
      if(err) return;
      if(!data) return fembed("RED", "Yetkili hiç kayıt yapmamış!")
      let csdata = data.reverse().reverse()
      let sdata = csdata.map(x => `__**Yetkilinin toplam kayıtları:**__ **${x.Total}**\n__**Yetkilinin toplam erkek kayıtları:**__ **${x.Male}**`)

    fembed("RANDOM", `${member} başarıyla <@&${value.erkek1}> olarak kayıt edildi\n\n${sdata}`)
    message.react(value.emojiEvet)
    
    lembed("GREEN", `${member} (\`${member.id}\`) ${message.author} (\`${message.author.id}\`) tarafından <@&${value.erkek1}> olarak kayıt edildi\nKayıt Tarihi: \`${moment(Date.now()).locale("tr").format("LLL")}\``)
    })
  //log ve kayıt mesajı son

  }
}