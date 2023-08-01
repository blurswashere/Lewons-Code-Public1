const mongoose = require("mongoose");
const allah = require("../../../settings");

mongoose.connect(allah.statMONGO, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  console.log("Database Bağlanıldı");
});
mongoose.connection.on("error", () => {
  console.error("[HATA] Database bağlantısı kurulamadı!");
});