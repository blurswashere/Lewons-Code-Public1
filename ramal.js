const { Client, Collection } = require("discord.js");
const client = global.bot = new Client({
  fetchAllMembers: true,
  intents: [ 32767 ],
}); 
const Discord = require('discord.js');
const conf = require("./src/Settings/sunucuayar.json");
const fs = require("fs");
client.commands = new Collection();
client.aliases = new Collection();
client.invites = new Collection();
client.cooldown = new Map();

const { Database } = require("ark.db");
const rankdb = (global.rankdb = new Database("./src/Settings/ranks.json"));
client.ranks = rankdb.get("ranks") ? rankdb.get("ranks").sort((a, b) => a.coin - b.coin) : [];
const allah = require("../../settings");

//KOMUT ÇALIŞTIRMA
fs.readdir('./src/commands/', (err, files) => {
  if (err) console.error(err);
  console.log(`[ramal] ${files.length} komut yüklenecek.`);
  files.forEach(f => {
    fs.readdir("./src/commands/" + f, (err2, files2) => {
      files2.forEach(file => {
        let props = require(`./src/commands/${f}/` + file);
        console.log(`[ramal KOMUT] ${props.conf.name} komutu yüklendi!`);
        client.commands.set(props.conf.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.conf.name);
        });
      })
    })
  });
});
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
require("./src/handlers/functionHandler")(client);

client
  .login(allah.Token)
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


  ///// slash commands
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');  
  client.slashcommands = new Collection();
  var slashcommands = [];
  
  fs.readdirSync('./src/Slashcommands/').forEach(async category => {
		const commands = fs.readdirSync(`./src/Slashcommands/${category}/`).filter(cmd => cmd.endsWith('.js'));
		for (const command of commands) {
		const Command = require(`./src/Slashcommands/${category}/${command}`);
    client.slashcommands.set(Command.data.name, Command);
    slashcommands.push(Command.data.toJSON());
		}
	});
  
	const rest = new REST({ version: '9' }).setToken(allah.Token);
  (async () => {
	try {
		console.log('[Ramalcim] Slash ve Komutlar yükleniyor.');
		await rest.put(
			Routes.applicationGuildCommands(allah.BotClientID, allah.GuildID),
			{ body: slashcommands },
		).then(() => {
			console.log('[Ramalcim] Slash ve Context Komutlar yüklendi.');
		});
	}
	catch (e) {
		console.error(e);
	}
})();

client.on('interactionCreate', (interaction) => {
  if (interaction.isContextMenu() || interaction.isCommand()) {
    const command = client.slashcommands.get(interaction.commandName);
    if (interaction.user.bot) return;
    if (!interaction.inGuild() && interaction.isCommand()) return interaction.editReply({ content: 'Komutları kullanmak için bir sunucuda olmanız gerekir.' });
    if (!command) return interaction.reply({ content: 'Bu komut kullanılamıyor.', ephemeral: true }) && client.slashcommands.delete(interaction.commandName);
    try {
      command.execute(interaction, client);
    }
    catch (e) {
      console.log(e);
      return interaction.reply({ content: `An error has occurred.\n\n**\`${e.message}\`**` });
    }
  }
});


////
let stats = require("./src/SystemModels/level");
 
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