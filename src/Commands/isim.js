const { MessageEmbed } = require('discord.js');
const Data = require('../Models/userdb');
const Name = require('../Models/namedb');
const value = require('../Json/guildSettings.json');
module.exports = {
  name: "isim",
  aliases: ["isim", "nick"],
  run: async(client, message, args) => {

    async function fembed(color, msg) {
      let embed = new MessageEmbed().setColor(color).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter("Patavatsız ❤️ " + message.guild.name).setTimestamp();
      message.channel.send(embed.setDescription(msg)).then(x => x.delete({timeout: 10000}))
    }

    if(!message.member.roles.cache.has(value.Yetkili) && !message.member.hasPermission("ADMINISTRATOR")) return fembed("RANDOM", "Bu komudu kullanmak için yetkin yetersiz.")

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member || !member.id === message.author.id || member.id === message.guild.owner.id || member.user.bot || member.roles.highest.position >= message.member.roles.highest.position) return message.react(value.emojiHayir)

    let ads = [".com", ".net", ".co", ".xyz", ".org", "www", "www:", "www://", "http", "https"];
    let isim = args[1].charAt(0).replace("i", "İ").toLocaleUpperCase() + args[1].slice(1).toLocaleLowerCase();
    if (ads.some(x => isim.toLocaleLowerCase().includes(x))) return fembed("RED", "Adına reklam koyamazsın");
    if (!isim) return fembed("RED", "Bir isim belirtin")
    let yas = Number(args[2]);
    let fixTag = member.user.username.includes(value.Tag) ? value.Tag : value.Untag;
    var name
    if(yas) name = `${fixTag} ${isim} | ${yas}`;
    if(!yas) name = `${fixTag} ${isim}`;

    //
    member.setNickname(`${name}`)
    let save = await new Data({ User: member.id, Name: name, Gender: "İsim Değiştirme" }) ; save.save().catch(err => { });
    let namedata = await Name.findOne({ User: member.id })
    if (namedata) {
      namedata.Names++
      namedata.save().catch(err => { })
    } else {
      let newNameData = await new Name({ User: member.id, Names: 1 }); newNameData.save().catch(err => { })
    }
    //

    fembed("GREEN", `${member} kullanıcının adı başarıyla \`${name}\` olarak değiştirildi`)
    message.react(value.emojiEvet)
  }
}
