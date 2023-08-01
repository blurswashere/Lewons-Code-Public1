const client = global.bot;
const allah = require("../../../../settings");
const conf = require("../Settings/sunucuayar.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const { Mute, Revuu, kirmiziok } = require("../Settings/emojis.json")

module.exports = async (oldState, newState) => {
const channel = client.channels.cache.find(x => x.name == "voice_log");
if (!channel) return;

if (!oldState.channel && newState.channel) return channel.send({ content:`${newState.member.displayName} üyesi <#${newState.channel.id}> Adlı Ses Kanalına <t:${Number(String(Date.now()).substring(0, 10))}:R> Giriş Yaptı!`});
if (oldState.channel && !newState.channel) return channel.send({ content:`${newState.member.displayName} üyesi \`${oldState.channel.name}\` Adlı Ses Kanalından <t:${Number(String(Date.now()).substring(0, 10))}:R> Çıkış Sesi Yaptı!`});
if (oldState.channel.id && newState.channel.id && oldState.channel.id != newState.channel.id) return channel.wsend({ content:`${newState.member.displayName} üyesi ses kanalını değiştirdi! (\`${oldState.channel.name}\` => \`${newState.channel.name}\`)`});
if (oldState.channel.id && oldState.selfMute && !newState.selfMute) return channel.send({ content:`${newState.member.displayName} üyesi \`${newState.channel.name}\` adlı sesli kanalda kendi susturmasını kaldırdı!`});
if (oldState.channel.id && !oldState.selfMute && newState.selfMute) return channel.send({ content:`${newState.member.displayName} üyesi \`${newState.channel.name}\` adlı sesli kanalda kendini susturdu!`});
if (oldState.channel.id && oldState.selfDeaf && !newState.selfDeaf) return channel.send({ content:`${newState.member.displayName} üyesi \`${newState.channel.name}\` adlı sesli kanalda kendi sağırlaştırmasını kaldırdı!`});
if (oldState.channel.id && !oldState.selfDeaf && newState.selfDeaf) return channel.send({ content:`${newState.member.displayName} üyesi \`${newState.channel.name}\` adlı sesli kanalda kendini sağırlaştırdı!`});
if (oldState.channel.id && !oldState.streaming && newState.channel.id && newState.streaming) return channel.send({ content:`${newState.member.displayName} üyesi \`${newState.channel.name}\` adlı sesli kanalda yayın açtı!`});
if (oldState.channel.id && oldState.streaming && newState.channel.id && !newState.streaming) return channel.send({ content:`${newState.member.displayName} üyesi \`${newState.channel.name}\` adlı sesli kanalda yayını kapattı!`});
if (oldState.channel.id && !oldState.selfVideo && newState.channel.id && newState.selfVideo) return channel.send({ content:`${newState.member.displayName} üyesi \`${newState.channel.name}\` adlı sesli kanalda kamerasını açtı!`});
if (oldState.channel.id && oldState.selfVideo && newState.channel.id && !newState.selfVideo) return channel.send({ content:`${newState.member.displayName} üyesi \`${newState.channel.name}\` adlı sesli kanalda kamerasını kapattı!`});

const channel2 = oldState.guild.channels.cache.get(conf.vmuteLogChannel);
if (!channel2) return;
let logs = await oldState.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_UPDATE" });
let entry = logs.entries.first();
if (!oldState.serverMute && newState.serverMute) return channel2.send({ embeds: [new MessageEmbed().setColor("RANDOM").setAuthor({ name: client.guilds.cache.get(allah.GuildID).name, iconURL: client.guilds.cache.get(allah.GuildID).iconURL({dynamic:true})}).setFooter({ text: `${moment(Date.now()).format("LLL")}`}).setDescription(`
${newState.member} Adlı Kişiye Sağ-tık susturma işlemi yapıldı.

${Mute} Mute Atılan Kişi : ${newState.member} (\`${newState.member.id}\`)
${Revuu} Mute Atan Yetkili : ${entry.executor} (\`${entry.executor.id}\`)
${kirmiziok} Mute Atılan Ses Kanal: <#${newState.channel.id}>`)]});
};

module.exports.conf = {
  name: "voiceStateUpdate",
};