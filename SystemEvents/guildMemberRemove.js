const client = global.bot;
const isimler = require("../SystemModels/names");
const inviterSchema = require("../SystemModels/inviter");
const inviteMemberSchema = require("../SystemModels/inviteMember");
const coin = require("../SystemModels/coin");
const gorev = require("../SystemModels/invite");
const conf = require("../Settings/sunucuayar.json")
const allah = require("../../../../settings");

module.exports = async (member) => {
  const channel = member.guild.channels.cache.get(conf.invLogChannel);
  if (!channel) return;
  if (member.user.bot) return;
  const data = await isimler.findOne({ guildID: allah.GuildID, userID: member.user.id });

  if (data && data.names.length) {
  await isimler.findOneAndUpdate({ guildID: allah.GuildID, userID: member.user.id }, { $push: { names: { name: data.names.splice(-1).map((x, i) => `${x.name}`), sebep: "Sunucudan Ayrılma", date: Date.now() } } }, { upsert: true });
  }
  
  const inviteMemberData = await inviteMemberSchema.findOne({ guildID: member.guild.id, userID: member.user.id });
  if (!inviteMemberData) {
    channel.send({ content: `\`${member.user.tag}\` üyesi sunucumuzdan <t:${Number(String(Date.now()).substring(0, 10))}:R> ayrıldı!`});
  } else {
    const inviter = await client.users.fetch(inviteMemberData.inviter);
    await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { leave: 1, total: -1 } }, { upsert: true });
    const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: inviter.id, });
    const total = inviterData ? inviterData.total : 0;
    const gorevData = await gorev.findOne({ guildID: member.guild.id, userID: inviter.id });
    channel.send({ content:`\`${member.user.tag}\` üyesi sunucumuzdan <t:${Number(String(Date.now()).substring(0, 10))}:R> ayrıldı! Sunucumuza ${inviter.tag} tarafından davet edilmiş. **(**Toplam Davet: ${total}**)**`});
    await coin.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { coin: -15 } }, { upsert: true });
    if (gorevData)
    await gorev.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { invite: -1 } }, { upsert: true });
  }
};

module.exports.conf = {
  name: "guildMemberRemove",
};
