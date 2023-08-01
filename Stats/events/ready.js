const client = global.bot;
const allah = require("../../../settings");
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


    const VoiceChannel = client.channels.cache.get(allah.Voice);
    joinVoiceChannel({
        channelId: VoiceChannel.id,
        guildId: VoiceChannel.guild.id,
        adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
        selfDeaf: true
    });

    setInterval(() => {
      const oynuyor = allah.Durum;
      const index = Math.floor(Math.random() * (oynuyor.length));

      client.user.setActivity(`${oynuyor[index]}`, {
        type: "STREAMING",
        url: "https://www.twitch.tv/Ramalcim"});
    }, 10000);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports.conf = {
  name: "ready",
};
}