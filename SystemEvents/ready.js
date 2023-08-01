const client = global.bot;
const conf = require("../Settings/sunucuayar.json");
const allah = require("../../../../settings");
const penals = require("../SystemModels/penals");
const bannedTag = require("../SystemModels/bannedTag");
const regstats = require("../SystemModels/registerStats");
const { MessageEmbed } = require("discord.js")
module.exports = async () => {

  client.guilds.cache.forEach(guild => {
    guild.invites.fetch()
    .then(invites => {
      const codeUses = new Map();
      invites.each(inv => codeUses.set(inv.code, inv.uses));
      client.invites.set(guild.id, codeUses);
  })
})

let guild = client.guilds.cache.get(allah.GuildID);
await guild.members.fetch();

  const { joinVoiceChannel } = require("@discordjs/voice");


    const VoiceChannel = client.channels.cache.get(allah.BotVoice);
    joinVoiceChannel({
        channelId: VoiceChannel.id,
        guildId: VoiceChannel.guild.id,
        adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
        selfDeaf: true
    });

    setInterval(() => {
      const oynuyor = allah.botStatus;
      const index = Math.floor(Math.random() * (oynuyor.length));

      client.user.setActivity(`${oynuyor[index]}`, {
        type: "STREAMING",
        url: "https://www.twitch.tv/Ramalcim"});
    }, 10000);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const newData = new bannedTag({ guildID: allah.GuildID })
  newData.save().catch(e => console.log(e))

setInterval(() => { TagKontrol(); }, 20 * 1000);
setInterval(() => { RolsuzeKayitsizVerme(); }, 10 * 1000);

async function RolsuzeKayitsizVerme()  { // Rolü olmayanı kayıtsıza atma
const guild = client.guilds.cache.get(allah.GuildID);
let ozi = guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== guild.id).size == 0)
   ozi.forEach(r => {
   r.roles.add(conf.unregRoles)
   })
};

async function TagKontrol() { // Tag tarama
  const tagges = conf.tag;
  const guild = client.guilds.cache.get(allah.GuildID)
  const tagModedata = await regstats.findOne({ guildID: allah.GuildID })

  guild.members.cache.forEach(x => {
    if(tagges.some(tag => x.user.tag.includes(tag)) && !x.roles.cache.has(conf.jailRole) && !x.roles.cache.has(conf.ekipRolu)) {
     x.roles.add(conf.ekipRolu);
    } else if(!tagges.some(tag => x.user.tag.includes(tag)) && x.roles.cache.has(conf.ekipRolu)) {
    if (tagModedata && tagModedata.tagMode === true) {
    if(!x.roles.cache.has(conf.vipRole) && !x.roles.cache.has(conf.boosterRolu)) return x.roles.set(conf.unregRoles);
    return }
     x.roles.remove(conf.ekipRolu);
    }
  })  
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

setInterval(async () => {  
  const guild = client.guilds.cache.get(allah.GuildID);
  if (!guild) return;
  const finishedPenals = await penals.find({ guildID: guild.id, active: true, temp: true, finishDate: { $lte: Date.now() } });
  finishedPenals.forEach(async (x) => {
    const member = guild.members.cache.get(x.userID);
    if (!member) return;
    if (x.type === "CHAT-MUTE") {
      x.active = false;
      await x.save();
      await member.roles.remove(conf.chatMute);
      client.channels.cache.get(conf.cmuteLogChannel).send({ embeds: [new MessageEmbed().setColor("#2f3136").setDescription(`${member.toString()} adlı Kullanıcının **Chat Mute** süresi doldu`)]});
    }
    if (x.type === "TEMP-JAIL") {
      x.active = false;
      await x.save();
      await member.setRoles(conf.unregRoles);
      client.channels.cache.get(conf.jailLogChannel).send({ embeds: [new MessageEmbed().setColor("#2f3136").setDescription(`${member.toString()} üyesinin jaili, süresi bittiği için kaldırıldı!`)]});
    } 
    if (x.type === "VOICE-MUTE") {
      if (member.voice.channelId) {
        x.removed = true;
        await x.save();
        if (member.voice.serverMute) member.voice.setMute(false);
      }
      x.active = false;
      await x.save();
      member.roles.remove(conf.voiceMute);
      client.channels.cache.get(conf.vmuteLogChannel).send({ embeds: [new MessageEmbed().setColor("#2f3136").setDescription(`${member.toString()} adlı Kullanıcının **Ses Mute** süresi doldu`)]});
    }
  });

  const activePenals = await penals.find({ guildID: guild.id, active: true });
  activePenals.forEach(async (x) => {
    const member = guild.members.cache.get(x.userID);
    if (!member) return;
    if (x.type === "CHAT-MUTE" && !conf.chatMute.some((x) => member.roles.cache.has(x))) return member.roles.add(conf.chatMute);
    if ((x.type === "JAIL" || x.type === "TEMP-JAIL") && !conf.jailRole.some((x) => member.roles.cache.has(x))) return member.setRoles(conf.jailRole);
    if (x.type === "VOICE-MUTE") {
      if (!conf.voiceMute.some((x) => member.roles.cache.has(x))) member.roles.add(conf.voiceMute);
      if (member.voice.channelId && !member.voice.serverMute) member.voice.setMute(true);
    }
  });
}, 750);
};

module.exports.conf = {
  name: "ready",
};
