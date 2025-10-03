// Calculate daily energy for each appliance row
function calculateDailyEnergy(watts, hours, quantity) {
  return watts * hours * quantity;
}

// Update a specific row's daily energy
function updateRowEnergy(rowIndex) {
  const watts = parseFloat(document.querySelector(`#appliance-table .row-${rowIndex} .power-input`).value) || 0;
  const hours = parseFloat(document.querySelector(`#appliance-table .row-${rowIndex} .hours-input`).value) || 0;
  const quantity = parseFloat(document.querySelector(`#appliance-table .row-${rowIndex} .qty-input`).value) || 0;
  
  const dailyEnergy = calculateDailyEnergy(watts, hours, quantity);
  document.querySelector(`#appliance-table .row-${rowIndex} .daily-energy`).textContent = dailyEnergy.toFixed(1);
  
  updateTotalEnergy();
}

// Calculate and update total daily energy
function updateTotalEnergy() {
  const energyElements = document.querySelectorAll('#appliance-table .daily-energy');
  let totalEnergy = 0;
  
  energyElements.forEach(element => {
    totalEnergy += parseFloat(element.textContent) || 0;
  });
  
  document.getElementById('total-daily-energy').textContent = `${totalEnergy.toFixed(1)} Wh`;
}

// Add event listeners to all input fields
document.querySelectorAll('#appliance-table input').forEach(input => {
  input.addEventListener('input', function() {
    const row = this.closest('tr').getAttribute('data-row-index');
    updateRowEnergy(row);
  });
});