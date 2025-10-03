// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const loadTable = document.getElementById('load-table');
    const addApplianceBtn = document.getElementById('add-appliance');
    const calculateNextBtn = document.getElementById('calculate-next');
    const resetFormBtn = document.getElementById('reset-form');
    const totalEnergyDisplay = document.getElementById('total-energy');
    
    // Add new appliance row
    addApplianceBtn.addEventListener('click', function() {
        const tbody = loadTable.querySelector('tbody');
        const newRow = document.createElement('tr');
        
        newRow.innerHTML = `
            <td><input type="text" class="form-control appliance-name" placeholder="e.g., LED Light"></td>
            <td><input type="number" class="form-control appliance-qty" value="1" min="1"></td>
            <td><input type="number" class="form-control appliance-power" placeholder="Watts"></td>
            <td><input type="number" class="form-control appliance-hours" placeholder="Hours" step="0.1" min="0" max="24"></td>
            <td class="daily-energy">0</td>
            <td><button type="button" class="btn btn-sm btn-danger remove-row">✕</button></td>
        `;
        
        tbody.appendChild(newRow);
        
        // Add event listener for the new row's remove button
        const removeBtn = newRow.querySelector('.remove-row');
        removeBtn.addEventListener('click', function() {
            tbody.removeChild(newRow);
            updateTotalEnergy();
        });
        
        // Add event listeners for calculation
        const inputs = newRow.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                calculateRowEnergy(newRow);
                updateTotalEnergy();
            });
        });
    });
    
    // Initialize existing row
    const firstRow = loadTable.querySelector('tbody tr');
    const firstRowRemoveBtn = firstRow.querySelector('.remove-row');
    const firstRowInputs = firstRow.querySelectorAll('input');
    
    firstRowRemoveBtn.addEventListener('click', function() {
        const tbody = loadTable.querySelector('tbody');
        if (tbody.children.length > 1) {
            tbody.removeChild(firstRow);
            updateTotalEnergy();
        } else {
            // Reset the first row instead of removing if it's the only one
            firstRowInputs.forEach(input => {
                if (input.classList.contains('appliance-qty')) {
                    input.value = 1;
                } else {
                    input.value = '';
                }
            });
            firstRow.querySelector('.daily-energy').textContent = '0';
            updateTotalEnergy();
        }
    });
    
    firstRowInputs.forEach(input => {
        input.addEventListener('input', function() {
            calculateRowEnergy(firstRow);
            updateTotalEnergy();
        });
    });
    
    // Calculate energy for a single row
    function calculateRowEnergy(row) {
        const qty = parseInt(row.querySelector('.appliance-qty').value) || 0;
        const power = parseFloat(row.querySelector('.appliance-power').value) || 0;
        const hours = parseFloat(row.querySelector('.appliance-hours').value) || 0;
        
        const dailyEnergy = qty * power * hours;
        row.querySelector('.daily-energy').textContent = Math.round(dailyEnergy);
    }
    
    // Update total energy
    function updateTotalEnergy() {
        const energyCells = loadTable.querySelectorAll('.daily-energy');
        let total = 0;
        
        energyCells.forEach(cell => {
            total += parseFloat(cell.textContent) || 0;
        });
        
        totalEnergyDisplay.textContent = `${Math.round(total)} Wh`;
    }
    
    // Reset form
    resetFormBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all entered data?')) {
            // Clear location
            document.getElementById('location').value = '';
            
            // Reset to default system voltage
            document.getElementById('system-voltage').value = '24';
            
            // Reset days of autonomy, DOD and efficiency to defaults
            document.getElementById('autonomy-days').value = '2';
            document.getElementById('battery-dod').value = '50';
            document.getElementById('system-efficiency').value = '85';
            
            // Remove all rows except the first one
            const tbody = loadTable.querySelector('tbody');
            while (tbody.children.length > 1) {
                tbody.removeChild(tbody.lastChild);
            }
            
            // Reset the first row
            const firstRow = tbody.firstChild;
            const inputs = firstRow.querySelectorAll('input');
            inputs.forEach(input => {
                if (input.classList.contains('appliance-qty')) {
                    input.value = 1;
                } else {
                    input.value = '';
                }
            });
            firstRow.querySelector('.daily-energy').textContent = '0';
            
            // Update total
            updateTotalEnergy();
        }
    });
    
    // Calculate and proceed to next step
    calculateNextBtn.addEventListener('click', function() {
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get load analysis data
        const loadData = getLoadData();
        
        // Store data for next steps
        localStorage.setItem('solarCalcLoadData', JSON.stringify(loadData));
        
        // For now, just alert with the data (we'll implement navigation later)
        alert('Data saved successfully! In the complete app, this would take you to Step 2: Inverter Sizing.');
        console.log('Load Data:', loadData);
    });
    
    // Form validation
    function validateForm() {
        const location = document.getElementById('location').value.trim();
        if (!location) {
            alert('Please enter a location');
            return false;
        }
        
        const rows = loadTable.querySelectorAll('tbody tr');
        let hasValidAppliance = false;
        
        rows.forEach(row => {
            const name = row.querySelector('.appliance-name').value.trim();
            const power = row.querySelector('.appliance-power').value;
            const hours = row.querySelector('.appliance-hours').value;
            
            if (name && power && hours) {
                hasValidAppliance = true;
            }
        });
        
        if (!hasValidAppliance) {
            alert('Please add at least one appliance with name, power, and hours');
            return false;
        }
        
        return true;
    }
    
    // Get load data as object
    function getLoadData() {
        const data = {
            location: document.getElementById('location').value.trim(),
            systemVoltage: parseInt(document.getElementById('system-voltage').value),
            autonomyDays: parseFloat(document.getElementById('autonomy-days').value),
            batteryDOD: parseFloat(document.getElementById('battery-dod').value),
            systemEfficiency: parseFloat(document.getElementById('system-efficiency').value),
            totalDailyEnergy: parseFloat(totalEnergyDisplay.textContent),
            appliances: []
        };
        
        const rows = loadTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const name = row.querySelector('.appliance-name').value.trim();
            const qty = parseInt(row.querySelector('.appliance-qty').value) || 0;
            const power = parseFloat(row.querySelector('.appliance-power').value) || 0;
            const hours = parseFloat(row.querySelector('.appliance-hours').value) || 0;
            const dailyEnergy = parseFloat(row.querySelector('.daily-energy').textContent) || 0;
            
            if (name && power && hours) {
                data.appliances.push({
                    name,
                    qty,
                    power,
                    hours,
                    dailyEnergy
                });
            }
        });
        
        return data;
    }
});