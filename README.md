# Equipment Sensor Monitor Dashboard

A real-time equipment monitoring dashboard built with HTML, CSS, and JavaScript. Monitor multiple equipment units with real-time sensor data, daily trends, and weekly summaries.

## 🎯 Features

- **Real-Time Monitoring**: Live sensor readings updating every 5 seconds
- **Multiple Equipment Types**: Monitor Pump, Motor, Compressor, and Fan units
- **Three View Modes**:
  - Real-Time: Live sensor data with instant updates
  - Daily: 24-hour trends with statistics
  - Weekly: 7-day summary with averages
- **Sensor Tracking**: 
  - Temperature (°C)
  - Pressure (PSI)
  - Vibration (mm/s)
  - Power Consumption (kW)
- **Smart Alerts**: Automatic warnings for abnormal readings
- **Interactive Charts**: Visual representation using Chart.js
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Status Indicators**: Color-coded status (Normal, Warning, Critical)

## 📁 Files

| File | Description |
|------|-------------|
| `index.html` | Main dashboard interface and structure |
| `styles.css` | Styling and responsive design |
| `app.js` | Real-time data handling and chart management |
| `README.md` | Documentation |

## 🚀 Quick Start

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. The dashboard will immediately start displaying simulated sensor data
4. Switch between equipment types using the dropdown selector
5. Click view buttons to switch between Real-Time, Daily, and Weekly views

## 📊 Equipment Specifications

### Pump Unit A
- Temperature: 20-80°C (Warning: 70°C, Critical: 75°C)
- Pressure: 10-100 PSI (Warning: 80 PSI, Critical: 90 PSI)
- Vibration: 0-10 mm/s (Warning: 7 mm/s, Critical: 9 mm/s)
- Power: 5-50 kW (Warning: 40 kW, Critical: 45 kW)

### Motor Unit B
- Temperature: 25-90°C (Warning: 75°C, Critical: 85°C)
- Pressure: 0-60 PSI (Warning: 50 PSI, Critical: 55 PSI)
- Vibration: 0-8 mm/s (Warning: 6 mm/s, Critical: 7.5 mm/s)
- Power: 10-100 kW (Warning: 80 kW, Critical: 90 kW)

### Compressor Unit C
- Temperature: 30-95°C (Warning: 80°C, Critical: 90°C)
- Pressure: 20-150 PSI (Warning: 120 PSI, Critical: 140 PSI)
- Vibration: 0-12 mm/s (Warning: 9 mm/s, Critical: 11 mm/s)
- Power: 15-120 kW (Warning: 100 kW, Critical: 110 kW)

### Fan Unit D
- Temperature: 15-70°C (Warning: 60°C, Critical: 65°C)
- Pressure: 5-50 PSI (Warning: 40 PSI, Critical: 45 PSI)
- Vibration: 0-5 mm/s (Warning: 4 mm/s, Critical: 4.5 mm/s)
- Power: 2-30 kW (Warning: 25 kW, Critical: 28 kW)

## 🎨 UI Components

### Real-Time View
- Four metric cards with live readings
- Progress bars showing current value relative to max
- Status indicators (Normal/Warning/Critical)
- Real-time line chart with multiple data series

### Daily View
- 24-hour bar chart
- Statistics: Max, Average, Min temperature
- Hourly breakdowns

### Weekly View
- 7-day trend chart
- Weekly statistics:
  - Average and max temperature
  - Average power consumption
  - Average pressure

### Alerts Section
- Real-time alert notifications
- Color-coded by severity (Info/Warning/Critical)
- Last 10 alerts displayed

## 🔧 Customization

### Add New Equipment

Edit the `equipmentSpecs` object in `app.js`:

```javascript
newEquipment: {
    name: 'New Equipment',
    temperature: { min: 20, max: 80, warn: 70, critical: 75 },
    pressure: { min: 10, max: 100, warn: 80, critical: 90 },
    vibration: { min: 0, max: 10, warn: 7, critical: 9 },
    power: { min: 5, max: 50, warn: 40, critical: 45 }
}
```

Then add the option to the HTML select element:
```html
<option value="newEquipment">New Equipment</option>
```

### Adjust Update Interval

Change the update frequency in `app.js`:
```javascript
setInterval(updateRealtimeData, 5000); // Change 5000 to desired milliseconds
```

### Modify Colors

Edit the gradient colors in `styles.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 🔌 API Integration

To connect real sensor data instead of simulated data:

1. Modify the `updateRealtimeData()` function in `app.js`
2. Replace the `generateValue()` calls with API fetch requests:

```javascript
function updateRealtimeData() {
    fetch('/api/sensors/' + currentEquipment)
        .then(response => response.json())
        .then(data => {
            // Process real sensor data
            sensorData.realtime.push(data);
            updateDashboard();
        });
}
```

## 📋 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Data Types

### Real-Time Data
- Last 20 readings (5-minute intervals)
- Updates every 5 seconds
- Current sensor values

### Daily Data
- Hourly averages (24 hours)
- Max/Min/Average for each hour
- Daily statistics

### Weekly Data
- Daily averages (7 days)
- Power and pressure trends
- Weekly statistics

## 🚨 Alert System

The dashboard automatically generates alerts when:
- Values exceed warning thresholds
- Values reach critical thresholds
- Equipment status changes

Alerts are displayed in the Alerts section and color-coded:
- 🟢 Green (Info) - Normal operations
- 🟡 Yellow (Warning) - Values approaching limits
- 🔴 Red (Critical) - Immediate attention needed

## 📈 Chart Libraries

- **Chart.js**: Professional chart visualization
- Link: https://cdn.jsdelivr.net/npm/chart.js

## 📝 Notes

- Dashboard uses simulated data by default
- All calculations are performed client-side
- No backend server required for basic operation
- Data resets on page refresh
- Historical data is generated dynamically

## 🤝 Contributing

Feel free to fork, modify, and improve this dashboard for your specific needs.

## 📄 License

Open source - Feel free to use and modify as needed.

---

**Created**: 2026  
**Last Updated**: May 23, 2026