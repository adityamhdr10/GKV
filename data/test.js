  // Mendapatkan data dari file CSV menggunakan fetch API
fetch('http://localhost:3000/mlbb_hero-edit.csv')
  .then(response => response.text())
  .then(data => {
    // Mengolah data CSV menjadi objek JavaScript
    const parsedData = processData(data);
    
    console.log("ssssss"); 

    
    // Membuat visualisasi menggunakan Plotly
    createPlot(parsedData);
    
    // Mengatur event listener untuk dropdown
    const dropdown = document.getElementById('dropdown');
    dropdown.addEventListener('change', () => {
      const selectedHero = dropdown.value;
      const heroData = parsedData.find(item => item.hero === selectedHero);
      updatePlot(heroData);
      
    });
  })
  .catch(error => {
    console.error('Terjadi kesalahan saat memuat file CSV:', error);
  });

// Fungsi untuk mengolah data CSV menjadi objek JavaScript
function processData(csvData) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
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

// Fungsi untuk membuat visualisasi menggunakan Plotly
function createPlot(data) {
  const r = data.map(item => item.r);
  const theta = ['HP', 'Defense', 'Offense', 'Difficulty', 'Movement Speed'];
  
  const plotData = [{
    type: 'scatterpolar',
    r: r,
    theta: theta,
    fill: 'toself'
  }];
  
  const layout = {
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 10]
      }
    },
    showlegend: false
  };
  
  Plotly.newPlot("myDiv", plotData, layout);
}

// Fungsi untuk memperbarui visualisasi berdasarkan pilihan dropdown
function updatePlot(heroData) {
  const r = heroData.r;
  
  Plotly.update("myDiv", { r: [r] });
}
