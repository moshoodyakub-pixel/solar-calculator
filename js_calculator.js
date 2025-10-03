// Solar Calculator logic functions
const SolarCalculator = {
    // Calculate battery capacity required
    calculateBatteryCapacity: function(totalDailyEnergy, autonomyDays, batteryDOD, systemVoltage) {
        // Battery capacity in Ah
        // Formula: (Daily Energy × Days of Autonomy) / (System Voltage × DOD)
        return (totalDailyEnergy * autonomyDays) / (systemVoltage * (batteryDOD / 100));
    },
    
    // Calculate inverter size required
    calculateInverterSize: function(appliances) {
        // Calculate total power and find max power device
        let totalPower = 0;
        let maxPower = 0;
        let simultaneousPower = 0;
        
        appliances.forEach(appliance => {
            const applianceTotalPower = appliance.power * appliance.qty;
            totalPower += applianceTotalPower;
            
            // Track the appliance with highest power requirement
            if (applianceTotalPower > maxPower) {
                maxPower = applianceTotalPower;
            }
            
            // Assume 60% of devices run simultaneously (this is a simplification)
            simultaneousPower = totalPower * 0.6;
        });
        
        // Add 25% safety margin
        const recommendedSize = simultaneousPower * 1.25;
        
        // Round up to nearest standard inverter size (common sizes in watts)
        const standardSizes = [300, 500, 800, 1000, 1500, 2000, 3000, 5000];
        
        for (let i = 0; i < standardSizes.length; i++) {
            if (standardSizes[i] >= recommendedSize) {
                return standardSizes[i];
            }
        }
        
        // If larger than standard sizes, recommend custom solution
        return Math.ceil(recommendedSize / 1000) * 1000;
    },
    
    // Calculate solar panel array
    calculateSolarArray: function(totalDailyEnergy, sunHours, systemEfficiency, panelWattage) {
        // Calculate total solar capacity needed in Watts
        // Formula: Daily Energy / (Sun Hours × System Efficiency)
        const requiredCapacity = totalDailyEnergy / (sunHours * (systemEfficiency / 100));
        
        // Calculate number of panels needed
        const panelsNeeded = Math.ceil(requiredCapacity / panelWattage);
        
        return {
            requiredCapacity,
            panelsNeeded,
            totalCapacity: panelsNeeded * panelWattage
        };
    },
    
    // More calculation functions will be added in future steps
};