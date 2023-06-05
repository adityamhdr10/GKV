const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");

app.use(cors());

// Menggunakan middleware untuk mengizinkan akses ke file statis
app.use(express.static(__dirname));

// Menggunakan endpoint untuk mengirim file CSV
app.get("/MPL_ID_S10.csv", (req, res) => {
  const csvFilePath = __dirname + "/MPL_ID_S10.csv";
  const readableStream = fs.createReadStream(csvFilePath);
  readableStream.pipe(res);
});

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log("Server berjalan pada port 3000");
});
