const { Client, Collection } = require("discord.js");
const client = global.bot = new Client({
  fetchAllMembers: true,
  intents: [ 32767 ],
}); 
const Discord = require('discord.js');
const conf = require("../Jollity/src/Settings/sunucuayar.json");
const fs = require("fs");
client.commands = new Collection();
client.aliases = new Collection();
client.invites = new Collection();
client.cooldown = new Map();

const { Database } = require("ark.db");
const rankdb = (global.rankdb = new Database("../Jollity/src/Settings/ranks.json"));
client.ranks = rankdb.get("ranks") ? rankdb.get("ranks").sort((a, b) => a.coin - b.coin) : [];
const allah = require("../../settings");
//KOMUT ÇALIŞTIRMA
fs.readdir('../Stats/commands/', (err, files) => {
  if (err) console.error(err);
  console.log(`[ramal] ${files.length} komut yüklenecek.`);
  files.forEach(f => {
    fs.readdir("../Stats/commands/" + f, (err2, files2) => {
      files2.forEach(file => {
        let props = require(`../Stats/commands/${f}/` + file);
        console.log(`[ramal KOMUT] ${props.conf.name} komutu yüklendi!`);
        client.commands.set(props.conf.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.conf.name);
        });
      })
    })
  });
});
require("./handlers/eventHandler");
require("./handlers/mongoHandler");
require("./handlers/functionHandler")(client);

client
  .login(allah.stats)
  .then(() => console.log("Bot Başarıyla Bağlandı!"))
  .catch(() => console.log("[HATA] Bot Bağlanamadı!"));

  process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
    process.exit(1);
  });
  
  process.on("unhandledRejection", err => {
    console.error("Promise Hatası: ", err);
  });



////
let stats = require("../Jollity/src/SystemModels/level");
let arr = [{
  Chat: "🦋 Argynnidae 💬",
  Voice: "🦋 Lycaenidae 🔊",
  ChatColor: "#fa795b",
  VoiceColor: "#fa795b",
  sLevel: 3,
  cLevel: 2
}, {
  Chat: "🦋 Danaidae 💬",
  Voice: "🦋 Papilionidae 🔊",
  ChatColor: "#cfcbcb",
  VoiceColor: "#cfcbcb",
  sLevel: 8,
  cLevel: 5
}, {
  Chat: "🦋 Hesperiidae 💬",
  Voice: "🦋 Pieridae 🔊",
  ChatColor: "#fffb00",
  VoiceColor: "#fffb00",
  sLevel: 20,
  cLevel: 35
}, {
  Chat: "🦋 Libytheidae 💬",
  Voice: "🦋 Riodinidae 🔊",
  ChatColor: "#23fafa",
  VoiceColor: "#23fafa",
  sLevel: 50,
  cLevel: 70
}]
client.checkLevel = async function (userID, guildID, type) {
  if (allah.LevelSystem == false) return;
  let sunucu = client.guilds.cache.get(guildID);
  if (!sunucu) return;
  let kontrol = await stats.findOne({
    userID: userID,
    guildID: guildID
  });
  if (!kontrol) return;
  const channel = client.channels.cache.find(x => x.name == "level_bilgi");
  arr.map(async data => {
    if (type === "mesaj") {
      if (kontrol.messageLevel >= data.cLevel) {
        if (kontrol.autoRankup.includes(data.Chat)) return;
        stats.updateOne({userID: userID, guildID: guildID}, {$push: {autoRankup: data.Chat}}, {upsert: true}).exec()
        channel.send({ content: `:tada: <@${userID}> tebrikler! Mesaj istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **"${data.Chat}"** rolüne terfi edildin!`})
      };
    };
    if (type === "ses") {
      if (kontrol.voiceLevel >= data.sLevel) {
        if (kontrol.autoRankup.includes(data.Voice)) return;
        stats.updateOne({userID: userID, guildID: guildID}, {$push: {autoRankup: data.Voice}}, {upsert: true}).exec()
        channel.send({ content: `:tada: <@${userID}> tebrikler! Ses istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **"${data.Voice}"** rolüne terfi edildin!`})
      };
    };
  });
};