const ctxCrop = document.getElementById('cropChart').getContext('2d');
new Chart(ctxCrop, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Crop Yield',
        data: [10, 20, 15, 30, 25],
        borderColor: 'green',
        fill: false
      }
    ]
  }
});

const ctxEquipment = document.getElementById('equipmentChart').getContext('2d');
new Chart(ctxEquipment, {
  type: 'doughnut',
  data: {
    labels: ['Tractors', 'Harvesters', 'Sprayers'],
    datasets: [
      {
        data: [5, 3, 7],
        backgroundColor: ['#558b2f', '#33691e', '#8bc34a']
      }
    ]
  }
});
