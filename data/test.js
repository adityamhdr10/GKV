// Mendapatkan data dari file CSV menggunakan fetch API
fetch("http://localhost:3000/mlbb_hero-edit.csv")
  .then((response) => response.text())
  .then((data) => {
    // Mengolah data CSV menjadi objek JavaScript
    const parsedData = processData(data);

    // Membuat visualisasi menggunakan Plotly
    firstPlot();
    calculator(parsedData);

    const namahero = document.getElementById("namaHero");
    namahero.innerHTML = "";
    // Mengatur event listener untuk dropdown
    const dropdown = document.getElementById("dropdown");
    dropdown.addEventListener("change", () => {
      const selectedHero = dropdown.value;
      console.log(selectedHero);
      const filteredData = parsedData.filter((obj) => obj.role === selectedHero);
      console.log(filteredData);

      // Dapatkan referensi ke elemen ul
      const listContainer = document.getElementById("listContainer");

      listContainer.innerHTML = "";
      creatBarChat(filteredData);
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

function mapNilai(nilai, minAsli, maxAsli, minBaru = 1, maxBaru = 10) {
  return ((nilai - minAsli) * (maxBaru - minBaru)) / (maxAsli - minAsli) + minBaru;
}

// Fungsi untuk membuat visualisasi menggunakan Plotly
function createPlot(data) {
  const r = [];

  r.push(mapNilai(parseInt(data.hp), 1948, 2898));
  r.push(parseInt(data.defense));
  r.push(parseInt(data.offense));
  r.push(parseInt(data.difficult));
  r.push(mapNilai(parseInt(data.movement), 230, 268));
  const theta = ["HP", "Defense", "Offense", "Difficult", "Movement"];

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

// Fungsi untuk membuat visualisasi awal menggunakan Plotly
function firstPlot() {
  const theta = ["HP", "Defense", "Offense", "Difficult", "Movement"];

  const plotData = [
    {
      type: "scatterpolar",
      r: [0, 0, 0, 0, 0],
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

function creatBarChat(dataHero) {
  const x = [];
  const y = [];
  dataHero.forEach((item) => {
    x.push(item.hero_name);
    y.push(item.winrate_pick * 100);
  });

  var data = [
    {
      x: x,
      y: y,
      type: "bar",
    },
  ];
  Plotly.newPlot("barChart", data);
}

var winBlue = [0.4746, 0.4746, 0.4746, 0.4746, 0.4746];
var winRed = [0.5077, 0.5077, 0.5077, 0.5077, 0.5077];

function creatDropdown(parsedData, i) {
  var dropdownId = "dropdownHero" + i;
  var dropdownHero1 = document.getElementById(dropdownId);

  // Tambahkan opsi nama awal tanpa nilai
  // var defaultOption = document.createElement("option");
  // defaultOption.text = "Picked Hero";
  // dropdownHero1.add(defaultOption);

  // Tambahkan pilihan dari array JavaScript ke dropdown

  for (var j = 0; j < parsedData.length; j++) {
    var option = document.createElement("option");
    option.text = parsedData[j].hero_name;
    option.value = parsedData[j].hero_name;
    dropdownHero1.add(option);
  }

  // Tambahkan event listener click
  dropdownHero1.addEventListener("click", function () {
    var selectedOption = this.options[this.selectedIndex];
    var selectedValue = selectedOption.value;
    var selectedText = selectedOption.text;

    if (i <= 5 && i > 0) {
      const heroData = parsedData.find((obj) => obj.hero_name == selectedValue);
      if (heroData.winBlue != 0) {
        winRed[i - 1] = heroData.winrate_blue;
      } else {
        winRed[i - 1] = 1;
      }
    } else if (i > 0) {
      const heroData = parsedData.find((obj) => obj.hero_name == selectedValue);
      winBlue[i - 6] = 1 - heroData.winrate_blue;
      console.log(winBlue);
    }
  });
}

function calculator(parsedData) {
  for (var i = 1; i <= 10; i++) {
    creatDropdown(parsedData, i);
  }
  var button = document.getElementById("button1");

  button.addEventListener("click", function () {
    var hasil1 = winRed.reduce(function (acc, currentValue) {
      return acc * currentValue;
    }, 1);
    var hasil2 = winBlue.reduce(function (acc, currentValue) {
      return acc * currentValue;
    }, 1);

    var finalBlue = Math.floor(((hasil2 * 0.5) / (hasil2 * 0.5 + hasil1 * 0.5)) * 100) + 0.5;
    var finalRed = Math.floor(((hasil1 * 0.5) / (hasil2 * 0.5 + hasil1 * 0.5)) * 100) + 0.5;

    const red = document.getElementById("winRed");
    const blue = document.getElementById("winBlue");

    // console.log(hasil1);
    // console.log(hasil2);
    red.innerHTML = "Red " + finalRed + "%";
    blue.innerHTML = "blue " + finalBlue + "%";
  });
}
