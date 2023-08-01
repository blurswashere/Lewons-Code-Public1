const { CronJob } = require("cron");
const client = global.bot;
const messageUser = require("../SystemModels/messageUser");
const voiceUser = require("../SystemModels/voiceUser");
const messageGuild = require("../SystemModels/messageGuild");
const voiceGuild = require("../SystemModels/voiceGuild");

const gorev = require("../SystemModels/invite");
const kayitg = require("../SystemModels/kayitgorev");
const mesaj = require("../SystemModels/mesajgorev");
const tagli = require("../SystemModels/taggorev");
const allah = require("../../../../settings");

module.exports = () => {

  const gorevs = new CronJob("0 0 * * *", () => {
    client.guilds.cache.forEach(async (guild) => {
      guild.members.cache.forEach(async (member) => {
        await gorev.findOneAndUpdate({ guildID: allah.GuildID, userID: member.user.id }, { $set: { invite: 0 } }, { upsert: true });
        await kayitg.findOneAndUpdate({ guildID: allah.GuildID, userID: member.user.id }, { $set: { kayit: 0 } }, { upsert: true });
        await mesaj.findOneAndUpdate({ guildID: allah.GuildID, userID: member.user.id }, { $set: { mesaj: 0 } }, { upsert: true });
        await tagli.findOneAndUpdate({ guildID: allah.GuildID, userID: member.user.id }, { $set: { tagli: 0 } }, { upsert: true });
        });
      console.log(`Sunucudaki ${client.guilds.cache.get(allah.GuildID).memberCount} üyenin günlük görevleri başarıyla yüklendi. [00:00]`)
    });
  }, null, true, "Europe/Istanbul");
  gorevs.start();

  const daily = new CronJob("0 0 * * *", () => {
    client.guilds.cache.forEach(async (guild) => {
      guild.members.cache.forEach(async (member) => {
      await messageGuild.findOneAndUpdate({ guildID: allah.GuildID }, { $set: { dailyStat: 0 } });
      await voiceGuild.findOneAndUpdate({ guildID: allah.GuildID }, { $set: { dailyStat: 0 } });
      await messageUser.findOneAndUpdate({ guildID: allah.GuildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
      await voiceUser.findOneAndUpdate({ guildID: allah.GuildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
          });
 });
  }, null, true, "Europe/Istanbul");
  daily.start();

  const weekly = new CronJob("0 0 * * 0", () => {
    client.guilds.cache.forEach(async (guild) => {
      guild.members.cache.forEach(async (member) => {
      await messageGuild.findOneAndUpdate({ guildID: allah.GuildID }, { $set: { weeklyStat: 0 } });
      await voiceGuild.findOneAndUpdate({ guildID: allah.GuildID }, { $set: { weeklyStat: 0 } });
      await messageUser.findOneAndUpdate({ guildID: allah.GuildID, userID: member.user.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
      await voiceUser.findOneAndUpdate({ guildID: allah.GuildID, userID: member.user.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
        });
 });
  }, null, true, "Europe/Istanbul");
  weekly.start();
};

module.exports.conf = {
  name: "ready"
};
