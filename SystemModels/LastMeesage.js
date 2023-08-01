const { Schema, model } = require("mongoose");

const schema = Schema({
  guildId: String,
  userID: String,
  date: Date,
});

module.exports = model("sonChat", schema);
