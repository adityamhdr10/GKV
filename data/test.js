// Mendapatkan data dari file CSV menggunakan fetch API
fetch("http://localhost:3000/mlbb_hero-edit.csv")
  .then((response) => response.text())
  .then((data) => {
    // Mengolah data CSV menjadi objek JavaScript
    const parsedData = processData(data);
    // console.log(parsedData[0]);

    // Membuat visualisasi menggunakan Plotly

    // Mengatur event listener untuk dropdown
    const dropdown = document.getElementById("dropdown");
    dropdown.addEventListener("change", () => {
      const selectedHero = dropdown.value;
      console.log(selectedHero);
      const filteredData = parsedData.filter((obj) => obj.role === selectedHero);
      console.log(filteredData);

      // Dapatkan referensi ke elemen ul
      const listContainer = document.getElementById("listContainer");
      const namahero = document.getElementById("namaHero");
      listContainer.innerHTML = "";
      namahero.innerHTML = "";
      // Buat elemen li untuk setiap item dalam array data
      filteredData.forEach((item) => {
        // Buat elemen li
        const listItem = document.createElement("li");

        // Atur konten elemen li
        listItem.textContent = item.hero_name;

        listItem.addEventListener("click", () => {
          // Tindakan yang ingin dilakukan ketika elemen li diklik
          console.log(`Anda mengklik ${item.hero_name}`);
          const heroData = parsedData.find((obj) => obj.hero_name == item.hero_name);
          namahero.innerHTML = item.hero_name;
          createPlot(heroData);
        });

        // Sisipkan elemen li ke dalam ul
        listContainer.appendChild(listItem);

        // Periksa jika sudah mencapai 10 list
      });
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
  // r.push(parseInt(data.win_pick));
  // r.push(parseInt(data.lose_pick));
  // console.log(r.push(parseInt(data.winrate_pick)));
  // r.push(Math.floor(parseInt(data.movement_spd) / 100));
  // const theta = ["Win", "Lose", "Win Rate"];
  
  r.push(parseInt(data.hp));
  r.push(parseInt(data.defense));
  r.push(parseInt(data.offense));
  r.push(parseInt(data.difficult));
  r.push(Math.floor(parseInt(data.movement) / 100));
  const theta = [ "HP", "Defense","Difficult", "Offense" ];

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
        range: [0, 10],
      },
    },
    showlegend: false,
  };

  Plotly.newPlot("myDiv", plotData, layout);
}

// Fungsi untuk memperbarui visualisasi berdasarkan pilihan dropdown
// function updatePlot(heroData) {
//   const r = [];

//   r.push(20);
//   r.push(parseInt(data.defense_overall));
//   r.push(parseInt(data.offense_overall));
//   r.push(parseInt(data.difficulty_overall));
//   r.push(parseInt(data.movement_spd));
//   console.log(r);

//   Plotly.update("myDiv", { r: r });
// }
