document.addEventListener("DOMContentLoaded", () => {
  const csvFileInput = document.getElementById("csvFileInput");
  const pieChartContainer = document.getElementById("pieChartContainer");

  csvFileInput.addEventListener("change", handleFileUpload);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const csvData = e.target.result;
      // Process the CSV data and generate the pie chart
      const cleanedData = cleanCSVData(csvData);
      generatePieChart(cleanedData);
    };

    reader.readAsText(file);
  }

  function cleanCSVData(csvData) {
    const dataArray = parseCSV(csvData);

    // Remove rows with missing or invalid data
    const cleanedData = dataArray.filter(
      (row) => row.Category && !isNaN(row.Value)
    );
    console.log("Cleaned Data:", cleanedData);
    return cleanedData;
  }

  function parseCSV(csvData) {
    // Parse the CSV data into an array of objects using PapaParse
    const parsedData = Papa.parse(csvData, {
      header: true, 
      skipEmptyLines: true,
    });

    // Extract the parsed data from the PapaParse result
    const dataArray = parsedData.data;

    console.log("Data Array:", dataArray);
    return dataArray;
  }
});
console.log(window.Chart);
console.log("Pie Chart Container:", pieChartContainer);
function generatePieChart(parsedData) {
  // Destroy any existing chart associated with the pieChartContainer
  if (window.myPieChart) {
    window.myPieChart.destroy();
  }

  const categoryColumn = "Category";
  const valueColumn = "Value";

  const categoryLabels = parsedData.map((row) => row[categoryColumn]);
  const categoryValues = parsedData.map((row) => parseFloat(row[valueColumn]));

  // Calculate the total value for calculating percentages
  const totalValue = categoryValues.reduce((total, value) => total + value, 0);

  // Calculate percentages
  const percentages = categoryValues.map((value) => ((value / totalValue) * 100).toFixed(2) + "%");

  const data = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: getRandomColors(categoryLabels.length),
      },
    ],
  };

  const options = {
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const category = data.labels[index];
        const value = data.datasets[0].data[index];
        const percentage = percentages[index];
        alert(`${category}: ${value} (${percentage})`);
      }
    },
  };

  // Create the pie chart using Chart.js
  window.myPieChart = new Chart(pieChartContainer, {
    type: "pie",
    data: data,
    options: options,
  });
}

// Function to generate random colors for the pie chart
function getRandomColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colors.push(randomColor);
  }
  return colors;
}