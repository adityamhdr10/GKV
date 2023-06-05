// Mendapatkan data dari file CSV menggunakan fetch API
fetch("http://localhost:3000/MPL_ID_S10.csv")
  .then((response) => response.text())
  .then((data) => {
    // Mengolah data CSV menjadi objek JavaScript
    const parsedData = processData(data);

    // Membuat visualisasi menggunakan Plotly
    createPlot(parsedData[0]);

    // Mengatur event listener untuk dropdown
    const dropdown = document.getElementById("dropdown");
    dropdown.addEventListener("change", () => {
      const selectedHero = dropdown.value;
      console.log(selectedHero);
      const heroData = parsedData.find((item) => item.Hero === selectedHero);
      console.log(heroData);
      createPlot(heroData);
    });
  })
  .catch((error) => {
    console.error("Terjadi kesalahan saat memuat file CSV:", error);
  });

// Fungsi untuk mengolah data CSV menjadi objek JavaScript
function processData(csvData) {
  const lines = csvData.split("\n");
  const headers = lines[0].split(",");
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(",");
    if (currentLine.length === headers.length) {
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = currentLine[j];
      }
      data.push(row);
    }
  }

  return data;
}

function processCSVData(csvData) {
  const lines = csvData.split("\n");
  const headers = lines[0].split(",");
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",");
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    data.push(obj);
  }
  return data;
}

// Fungsi untuk membuat visualisasi menggunakan Plotly
function createPlot(data) {
  const r = [];

  r.push(parseInt(data.Bs_lost));
  r.push(parseInt(data.Bs_picked));
  r.push(parseInt(data.Bs_won));
  r.push(parseInt(data.Rs_picked));
  const theta = ["HP", "Defense", "Offense", "Difficulty", "Movement Speed"];

  const plotData = [
    {
      type: "scatterpolar",
      r: r,
      theta: theta,
      fill: "toself",
    },
  ];

  const layout = {
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 100],
      },
    },
    showlegend: false,
  };

  Plotly.newPlot("myDiv", plotData, layout);
}

// Fungsi untuk memperbarui visualisasi berdasarkan pilihan dropdown
function updatePlot(heroData) {
  const r = [];

  r.push(parseInt(heroData.Bs_lost));
  r.push(parseInt(heroData.Bs_picked));
  r.push(parseInt(heroData.Bs_won));
  r.push(parseInt(heroData.Rs_picked));
  console.log(r);

  Plotly.update("myDiv", { r: r });
}
