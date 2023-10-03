// Initialize Map and Set Its Initial View
var mymap = L.map('map', {
    center: [40.7128, -74.0060], // Center New York
    zoom: 10
});
// Define Base Layers: Streets (OpenStreetMap)
var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=“https://www.openstreetmap.org/copyright”>OpenStreetMap</a> contributors'
}).addTo(mymap);

// Fetch and plot Accidents Data
d3.json('http://127.0.0.1:5000/api/accidents').then(response => {

    let data=response.result;
    piechart(data);

    // Add our marker cluster layer to the map.
  // Create a new marker cluster group.
  let allData = L.markerClusterGroup();
  let top3 = L.layerGroup();
  let bottom3 = L.layerGroup();

  // Loop through the data to attch all data maker.
  for (let i = 0; i < data.length; i++) {
    // Set the data location property to a variable.
    let lat = data[i].Latitude;
    let lng = data[i].Longitude;
    let location = [lat, lng];
    // Check for the location property.
    if (location) {
      // Add a new marker to the cluster group, and bind a popup.
      allData.addLayer(L.marker(location).bindPopup(data[i].Vehicle_Type));
    }
  }

  d3.json('http://127.0.0.1:5000/api/cities-accidents').then(data => {
    let topCities = data.result.slice(0, 3);
    let bottomCities = data.result.slice(-3);
    topCities.forEach(city => {
       top3.addLayer( L.circle([city.latitude, city.longitude], {
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.5,
            radius: 2000
        }).bindPopup(`${city.city}: ${city.count} accidents`))  
        bottomCities.forEach(city => {
            bottom3.addLayer( L.circle([city.latitude, city.longitude], {
                        color: 'blue',
                        fillColor: 'blue',
                        fillOpacity: 0.5,
                        radius: 2000
                    }).bindPopup(`${city.city}: ${city.count} accidents`)
         ) })})
                

  let overlayMaps = {
    "All Accidents": allData,
    "Top 3": top3,
    "Bottom 3": bottom3,
  };
  L.control
    .layers(null, overlayMaps, {
      collapsed: false,
    })
    .addTo(mymap);
})})


// Function for Pie Chart

 function piechart (sample){
     let morning = [];
     let afternoon = [];
     let night = [];
    
    sample.forEach(ele=>{
        if(ele.Crash_Time.split(":")[0] >5 && ele.Crash_Time.split(":")[0]<12){
            morning.push(ele)
         }
         else if(ele.Crash_Time.split(":")[0] >12 && ele.Crash_Time.split(":")[0]<17){
            afternoon.push(ele)
         }        
         else{
             night.push(ele)
         }
     })

     let morningcount = morning.length;
     let afternooncount = afternoon.length;
     let nighcount = night.length;

     let data =[{
        values: [morningcount, afternooncount, nighcount],
         labels : ['Morning_Acciedents','Noon_Accidenet','Night_Accident'],
         type: 'pie'
     }];

     let layout = {
         height : 400,
         width : 500
     };

     Plotly.newPlot('plot1', data, layout);
 }

// Function for Bar Chart

 d3.json('http://127.0.0.1:5000/api/vehicle-accidents').then(data =>{
    let top10vehicle = data.result.slice(0,10);

     var trace = {
         x: top10vehicle.map(ele=>{return ele.vehicleType}),
         y : top10vehicle.map(ele=>{return ele.count}),
         type: 'bar'
     };

     var data =[trace];

     Plotly.newPlot('plot2',data)
 })