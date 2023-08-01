const conf = require("../Settings/sunucuayar.json");
const allah = require("../../../../settings");
const messageUser = require("../SystemModels/messageUser");
const messageGuild = require("../SystemModels/messageGuild");
const guildChannel = require("../SystemModels/messageGuildChannel");
const userChannel = require("../SystemModels/messageUserChannel");
const coin = require("../SystemModels/coin");
const client = global.bot;
const nums = new Map();
const mesaj = require("../SystemModels/mesajgorev");
const dolar = require("../SystemModels/dolar")
const ms = require("../SystemModels/LastMeesage")


module.exports = async (message) => {
  if (message.author.bot || !message.guild || message.content.startsWith(allah.prefix)) return;
  
  if (conf.staffs.some(x => message.member.roles.cache.has(x))) {
    const num = nums.get(message.author.id);
    if (num && (num % allah.messageCount) === 0) {
      nums.set(message.author.id, num + 1);
      await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: allah.messageCoin } }, { upsert: true });
      const coinData = await coin.findOne({ guildID: message.guild.id, userID: message.author.id });
      if (coinData && client.ranks.some((x) => coinData.coin >= x.coin)) {
        let newRank = client.ranks.filter(x => coinData.coin >= x.coin);
        newRank = newRank[newRank.length-1];
        if (newRank && Array.isArray(newRank.role) && !newRank.role.some(x => message.member.roles.cache.has(x)) || newRank && !Array.isArray(newRank.role) && !message.member.roles.cache.has(newRank.role)) {
        message.member.roles.add(newRank.role);
        const oldRoles = client.ranks.filter((x) => newRank.coin > x.coin);
        oldRoles.forEach((x) => x.role.forEach((r) => message.member.roles.cache.has(r) && message.member.roles.remove(r)));
        client.channels.cache.find(x => x.name == "rank_log").send({ content: `${message.member.toString()} üyesi **${coinData.coin}** coin hedefine ulaştı ve **${Array.isArray(newRank.role) ? newRank.role.map(x => `${message.guild.roles.cache.get(x).name}`).join(", ") : `${message.guild.roles.cache.get(newRank.role).name}`}** rolü verildi! :tada: :tada:`});
    }
  }
    } else nums.set(message.author.id, num ? num + 1 : 1);
  }

  await messageUser.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
  await messageGuild.findOneAndUpdate({ guildID: message.guild.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
  await guildChannel.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
  await userChannel.findOneAndUpdate({ guildID: message.guild.id,  userID: message.author.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
  await ms.findOneAndUpdate({guildId: message.guild.id, userID: message.author.id}, {$set: {date: Date.now()}}, {upsert:true})
  let seen = await Seens.findOne({ guildId: message.guild.id, User: message.author.id })
  if(dolar) {
  if(message.channel.id !== conf.chatChannel) return;
  await dolar.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { dolar: allah.messageDolar } }, { upsert: true });
  }
const mesajData = await mesaj.findOne({ guildID: message.guild.id, userID: message.author.id });
if(mesajData){
if(message.channel.id !== conf.chatChannel) return;
await mesaj.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { mesaj: 1 } }, { upsert: true });
}
};

module.exports.conf = {
  name: "messageCreate",
};
