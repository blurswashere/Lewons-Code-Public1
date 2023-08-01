const { Discord, createMessageComponentCollector, MessageActionRow, MessageSelectMenu, MessageEmbed  } = require("discord.js");

module.exports = {
    conf: {
      aliases: ["ilgis","ilgivers"],
      name: "ilgivers",
      help: "ilgivers",
      category: "kullanıcı",
    },
  
run: async (client, message, args, embed, prefix) => {
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(!member) return message.reply({ content: 'Hangi Bebeğe İlgi Vereyim'})
message.reply({content:`${member} Adlı Güzelliğe İlgi Verildi.`})
},
  };
