const ayar = require("../Settings/sunucuayar.json")
const { green } = require("../Settings/emojis.json");

module.exports = async (message) => {
  if (message.content.toLowerCase() === "tag" || message.content.toLowerCase() === "!tag" || message.content.toLowerCase() === ".tag") {
    message.react(green);
    message.reply({ content: `${ayar.tag.length > 0 ? `\`\`\`${ayar.tag.map(x => `${x}`).join(", ")}\`\`\`` : "\`YOK\`"}`});
  }
};
module.exports.conf = {
  name: "messageCreate"
};