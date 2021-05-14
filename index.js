const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const moment = require('moment');
require('moment-duration-format');
const commands = client.commands = new Discord.Collection();
const aliases = client.aliases = new Discord.Collection();
const wait = require("util").promisify(setTimeout);
const conf = require('./src/Json/settings.json');
const value = require('./src/Json/guildSettings.json');
const mongoose = require('mongoose');
const userdb = require("./src/Models/userdb");
const Name = require('./src/Models/namedb');

fs.readdirSync('./src/Commands', { encoding: 'utf8' }).filter(file => file.endsWith(".js")).forEach((files) => {
  let command = require(`./src/Commands/${files}`);
  if (!command.name) return console.log(`Hatalı Kod Dosyası => [./src/Commands/${files}]`)
  commands.set(command.name, command);
  if (!command.aliases || command.aliases.length < 1) return
  command.aliases.forEach((otherUses) => { aliases.set(otherUses, command.name); })
})

client.on('message', message => {
  const prefix = conf.botPrefix
  if (!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;
  const args = message.content.slice(1).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if (!cmd) return;
  cmd.run(client, message, args)
})

client.on("ready", async () => {
  console.log(`Bot's name set as a ${client.user.username}`)
  client.user.setPresence({ activity: { name: "BOT DURUMU" }, status: "dnd" }) // dnd: rahatsız etmeyin, idle: boşta, online: aktif
  client.channels.cache.get(conf.botVoice).join()
    .catch()
});

mongoose.connect("MONGOCONNECTLINK", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to DB");
});
mongoose.connection.on("error", () => {
  console.error("Connection Error!");
});



client.tarihHesapla = (date) => {
  const startedAt = Date.parse(date);
  var msecs = Math.abs(new Date() - startedAt);

  const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
  msecs -= years * 1000 * 60 * 60 * 24 * 365;
  const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
  msecs -= months * 1000 * 60 * 60 * 24 * 30;
  const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
  msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
  const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
  msecs -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(msecs / (1000 * 60 * 60));
  msecs -= hours * 1000 * 60 * 60;
  const mins = Math.floor((msecs / (1000 * 60)));
  msecs -= mins * 1000 * 60;
  const secs = Math.floor(msecs / 1000);
  msecs -= secs * 1000;

  var string = "";
  if (years > 0) string += `${years} yıl ${months} ay`
  else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks + " hafta" : ""}`
  else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days + " gün" : ""}`
  else if (days > 0) string += `${days} gün ${hours > 0 ? hours + " saat" : ""}`
  else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins + " dakika" : ""}`
  else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs + " saniye" : ""}`
  else if (secs > 0) string += `${secs} saniye`
  else string += `saniyeler`;

  string = string.trim();
  return `${string} önce`;
};

client.on("guildMemberAdd", async member => {
  let kontrol = Date.now() - member.user.createdTimestamp > 1000 * 60 * 60 * 24 * 15 ? "güvenli" : "şüpheli"
  if(!member.user.bot && kontrol === "güvenli") {
    await member.roles.add(value.Kayıtsız)
    await member.setNickname(`${value.Tag} İsim | Yaş`)
    await client.channels.cache.get(value.KayıtKanal).send(`
Sunucumuza hoşgeldin ${member}! seninle birlikte **${member.guild.memberCount}** kişiye ulaştık!

Sol taraftaki **V.Confirmed** odalarına giriş yapıp kaydını yaptırabilirsin, <@&${value.Yetkili}> rolüne sahip yetkililerimiz seninle ilgilenecektir. 

Sunucu kurallarımız <#${value.Kurallar}> kanalında belirtilmiştir. Unutma kayıt olduğunda kuralları okumuş sayılırsın ve buna göre ceza-i işlemler uygulanır !

Hesabın **${moment(member.user.createdAt).locale("tr").format("LLL")}** tarihinde \`(${client.tarihHesapla(member.user.createdAt)})\`  açılmış yani **${kontrol}**. Tagımızı (\`${value.Tag}\`) alarak bizlere destek olabilirsin!`)
} else {
  await member.roles.add(value.Şüpheli)
    await client.channels.cache.get(value.KayıtKanal).send(new Discord.MessageEmbed().setColor("RED").setAuthor(member.user.username, member.user.avatarURL({ dynamic: true })).setThumbnail(member.user.avatarURL({dynamic: true})).setFooter("Patavatsız ❤️ " + member.guild.name).setTimestamp().setDescription(`
${member} sunucuya katıldı fakat hesabı **${moment(member.user.createdAt).locale("tr").format("LLL")}** tarihinde \`(${client.tarihHesapla(member.user.createdAt)})\` açıldığı için <@&${value.Şüpheli}> rolü verildi.`))
}

if(member.user.bot) {
  await member.roles.add(value.BotRol)
}

});


client.on("guildMemberRemove", async member => {
let newdb = new userdb({ User: member.id, Name: member.user.username, Gender: "Sunucudan ayrılma" }); newdb.save().catch(err => { })
let namesave =  new Name({ User: member.id, Names: 1 }); namesave.save().catch(err => { });
});




client.login(conf.botToken);


