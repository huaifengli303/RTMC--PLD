// Demo app.js for RTMC--PLD with area & comparison support (MRT, MRC, WBR)

const equipmentSpecs = {
  pump: { temperature: {min:20,max:80,warn:70,crit:75}, pressure: {min:10,max:100,warn:80,crit:90}, vibration: {min:0,max:10,warn:7,crit:9}, power: {min:5,max:50,warn:40,crit:45} },
  motor: { temperature: {min:25,max:90,warn:75,crit:85}, pressure: {min:0,max:60,warn:50,crit:55}, vibration: {min:0,max:8,warn:6,crit:7.5}, power: {min:10,max:100,warn:80,crit:90} },
  compressor: { temperature: {min:30,max:95,warn:80,crit:90}, pressure: {min:20,max:150,warn:120,crit:140}, vibration: {min:0,max:12,warn:9,crit:11}, power: {min:15,max:120,warn:100,crit:110} },
  fan: { temperature: {min:15,max:70,warn:60,crit:65}, pressure: {min:5,max:50,warn:40,crit:45}, vibration: {min:0,max:5,warn:4,crit:4.5}, power: {min:2,max:30,warn:25,crit:28} }
};

const AREAS = ["MRT","MRC","WBR"];
let currentArea = "MRT";
let currentEquipment = 'pump';
let allData = {};
let alertHistory = {};
for(let a of AREAS){
  allData[a]={};
  alertHistory[a]=[];
  for(let eq in equipmentSpecs){
    allData[a][eq]=[];
  }
}

function generateValue({min,max}){
  let middle = (min+max)/2;
  let spread = (max-min)/2;
  return Math.round((middle + Math.random()*spread - spread/2)*10)/10;
}
function generateReading(area, eq) {
  const spec = equipmentSpecs[eq];
  return {
    temperature: generateValue(spec.temperature),
    pressure: generateValue(spec.pressure),
    vibration: generateValue(spec.vibration),
    power: generateValue(spec.power),
    timestamp: new Date().toLocaleTimeString(),
    area
  };
}
function getStatus(val, warn, crit) {
  if (val >= crit) return 'critical';
  else if (val >= warn) return 'warning';
  else return 'normal';
}
function showAlerts(reading) {
  const area = reading.area;
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
      const msg = `${color} [${area}] ${key[0].toUpperCase()+key.slice(1)} ${reading[key]}${unit} (${status})`;
      alertHistory[area].unshift(msg);
    }
  });
  alertHistory[area] = alertHistory[area].slice(0,10);
  // Show only the selected area's alerts
  const list = document.getElementById('alertList');
  list.innerHTML = alertHistory[currentArea].map(a=>`<li>${a}</li>`).join('');
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
    let status = getStatus(reading[k],spec[k].warn,spec[k].crit);
    let color = status=='normal'?'#7dd56f':status=='warning'?'#f8e453':'#f2745e';
    document.getElementById(card+'Bar').style.background = color;
  });
}
// --- Main Trend ChartJS ---
let mainChart;
function updateChart() {
  const dataHistory = allData[currentArea][currentEquipment];
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
// --- Comparison ChartJS ---
let compareChart;
function updateCompareChart() {
  const metric = document.getElementById('compareType').value;
  const labels = AREAS;
  const values = AREAS.map(area => {
    let hist = allData[area][currentEquipment];
    return hist.length>0 ? hist[hist.length-1][metric] : 0;
  });
  if(!compareChart){
    compareChart = new Chart(document.getElementById('compareChart').getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{label:`${metric[0].toUpperCase()+metric.slice(1)} by Area`, data:values, backgroundColor:["#a3bbfc", "#fbd786", "#f7797d"] }]
      },
      options: {responsive:true,scales:{y:{beginAtZero:true}}}
    });
  } else {
    compareChart.data.labels = labels;
    compareChart.data.datasets[0].data = values;
    compareChart.data.datasets[0].label = `${metric[0].toUpperCase()+metric.slice(1)} by Area`;
    compareChart.update();
  }
}
function updateAll(){
  const dh = allData[currentArea][currentEquipment];
  if(dh.length) {
    updateMetricCards(dh[dh.length-1]);
    updateChart();
    showAlerts(dh[dh.length-1]);
  }
  updateCompareChart();
}
function addReadingAllAreas(){
  for(const area of AREAS){
    const reading = generateReading(area, currentEquipment);
    let arr = allData[area][currentEquipment];
    arr.push(reading);
    if(arr.length>20) allData[area][currentEquipment]=arr.slice(arr.length-20);
    // Fire alerts for each area
    showAlerts(reading);
  }
  updateAll();
}
setInterval(addReadingAllAreas,5000);
window.addEventListener('DOMContentLoaded',()=>{
  addReadingAllAreas(); addReadingAllAreas(); addReadingAllAreas();
  document.getElementById('equipmentSelect').addEventListener('change',e=>{
    currentEquipment = e.target.value;
    updateAll();
  });
  document.getElementById('areaSelect').addEventListener('change',e=>{
    currentArea = e.target.value;
    updateAll();
  });
  document.getElementById('compareType').addEventListener('change',()=>{
    updateCompareChart();
  });
});
