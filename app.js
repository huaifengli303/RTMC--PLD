// Demo app.js for RTMC--PLD dashboard (simulates data, handles chart/alerts)

const equipmentSpecs = {
  pump:    { temperature: {min:20,max:80,warn:70,crit:75}, pressure: {min:10,max:100,warn:80,crit:90}, vibration: {min:0,max:10,warn:7,crit:9}, power: {min:5,max:50,warn:40,crit:45} },
  motor:   { temperature: {min:25,max:90,warn:75,crit:85}, pressure: {min:0,max:60,warn:50,crit:55}, vibration: {min:0,max:8,warn:6,crit:7.5}, power: {min:10,max:100,warn:80,crit:90} },
  compressor: { temperature: {min:30,max:95,warn:80,crit:90}, pressure: {min:20,max:150,warn:120,crit:140}, vibration: {min:0,max:12,warn:9,crit:11}, power: {min:15,max:120,warn:100,crit:110} },
  fan:     { temperature: {min:15,max:70,warn:60,crit:65}, pressure: {min:5,max:50,warn:40,crit:45}, vibration: {min:0,max:5,warn:4,crit:4.5}, power: {min:2,max:30,warn:25,crit:28} }
};
let currentEquipment = 'pump';
let dataHistory = [];
let alertHistory = [];

function generateValue({min,max}){
  // Simulate realistic value
  let middle = (min+max)/2;
  let spread = (max-min)/2;
  return Math.round((middle + Math.random()*spread - spread/2)*10)/10;
}
function generateReading() {
  const spec = equipmentSpecs[currentEquipment];
  return {
    temperature: generateValue(spec.temperature),
    pressure: generateValue(spec.pressure),
    vibration: generateValue(spec.vibration),
    power: generateValue(spec.power),
    timestamp: new Date().toLocaleTimeString()
  }
}
function getStatus(val, warn, crit) {
  if (val >= crit) return 'critical';
  else if (val >= warn) return 'warning';
  else return 'normal';
}
function showAlerts(reading) {
  const spec = equipmentSpecs[currentEquipment];
  [
    ['temperature','°C'],
    ['pressure','PSI'],
    ['vibration','mm/s'],
    ['power','kW']
  ].forEach(([key,unit])=>{
    let status = getStatus(reading[key],spec[key].warn,spec[key].crit);
    if(status!=='normal') {
      let color = status==="warning"?"🟡":"🔴";
      const msg = `${color} ${key[0].toUpperCase()+key.slice(1)} ${reading[key]}${unit} (${status})`;
      alertHistory.unshift(msg);
    }
  });
  alertHistory = alertHistory.slice(0,10);
  const list = document.getElementById('alertList');
  list.innerHTML = alertHistory.map(a=>`<li>${a}</li>`).join('');
}
function updateMetricCards(reading) {
  const spec = equipmentSpecs[currentEquipment];
  [
    ['temperature','temp'],
    ['pressure','pressure'],
    ['vibration','vibration'],
    ['power','power']
  ].forEach(([k,card])=>{
    document.getElementById(card+'Value').textContent = reading[k];
    let max = spec[k].max;
    let pct = 100*Math.min(reading[k]/max,1);
    document.getElementById(card+'Bar').style.width = pct+'%';
    // Status color
    let status = getStatus(reading[k],spec[k].warn,spec[k].crit);
    let color = status=='normal'?'#7dd56f':status=='warning'?'#f8e453':'#f2745e';
    document.getElementById(card+'Bar').style.background = color;
  });
}
// --- Chartjs ---
let mainChart;
function updateChart() {
  const labels = dataHistory.map(d=>d.timestamp);
  const temps = dataHistory.map(d=>d.temperature);
  const pressures = dataHistory.map(d=>d.pressure);
  const vibros = dataHistory.map(d=>d.vibration);
  const powers = dataHistory.map(d=>d.power);
  if(!mainChart){
    mainChart = new Chart(document.getElementById('mainChart').getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {label:'Temp (°C)',data:temps,borderColor:'#ff7675',fill:false},
          {label:'Pressure (PSI)',data:pressures,borderColor:'#74b9ff',fill:false},
          {label:'Vibration (mm/s)',data:vibros,borderColor:'#00b894',fill:false},
          {label:'Power (kW)',data:powers,borderColor:'#fdcb6e',fill:false}
        ]
      },
      options: {responsive:true,scales:{y:{beginAtZero:true}}}
    });
  } else {
    mainChart.data.labels = labels;
    mainChart.data.datasets[0].data = temps;
    mainChart.data.datasets[1].data = pressures;
    mainChart.data.datasets[2].data = vibros;
    mainChart.data.datasets[3].data = powers;
    mainChart.update();
  }
}
function updateAll(){
  updateMetricCards(dataHistory[dataHistory.length-1]);
  updateChart();
  showAlerts(dataHistory[dataHistory.length-1]);
}
function addReading(){
  // Simulate and push
  const reading = generateReading();
  dataHistory.push(reading);
  if(dataHistory.length>20) dataHistory=dataHistory.slice(dataHistory.length-20);
  updateAll();
}
setInterval(addReading,5000);
window.addEventListener('DOMContentLoaded',()=>{
  addReading(); addReading(); addReading(); // jumpstart
  document.getElementById('equipmentSelect').addEventListener('change',e=>{
    currentEquipment = e.target.value;
    dataHistory = [];
    alertHistory = [];
    mainChart && mainChart.destroy();
    mainChart = null;
    for(let i=0;i<3;i++) addReading();
  });
});