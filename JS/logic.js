// Creating the map object
let myMap = L.map("map", {
    center: [40.6905, -73.919914],
    zoom: 11
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Use this link to get the GeoJSON data.
  let url = "http://127.0.0.1:5000/api/v1.0/Acciedents_Data";


  // Getting our GeoJSON data
  d3.json(url).then(function(response) {
    console.log(response);
    features = response.lattitude;
    // Creating a GeoJSON layer with the retrieved data
    let useData=[]
    data.foreach(ele=>{
        let obj={};
        obj.cityname=ele.City_Name
        obj.location[1]=ele.Longitude
        obj.location[0]=ele.Latitude
        useData.push(obj)
    })
    for (let i = 0; i < useData.length; i++) {
        L.circle(cities[i].location, {
          fillOpacity: 0.75,
          color: "white",
          fillColor: "purple",
          // Setting our circle's radius to equal the output of our markerSize() function:
          // This will make our marker's size proportionate to its population.
          radius: markerSize(useData[i].cityname)
        }).bindPopup(` ${useData[i].cityname.toLocaleString()}`).addTo(myMap);
      }
    // L.geoJson(data).addTo(myMap);
  });

  
  
 