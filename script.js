/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log('hi');

// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map', {
  center: [40.70, -73.89],
  zoom: 11
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 20
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'default_public',
  username: 'torrh257'
});

// Initialze source data - Bike Lanes Routes
var bikeroutesource = new carto.source.SQL('SELECT * FROM nyc_bike_routes_2017');

// Create style for the data
var bikeroutestyle = new carto.style.CartoCSS(`
 #layer {
  line-width: 1.5;
  line-color: ramp([boro], (#115427, #b1a4b1, #5807e4, #846f06, #e7e0dd), quantiles);
}
`)

// Add style to the data
var bikeroutelayer = new carto.layer.Layer(bikeroutesource, bikeroutestyle);

// Add the data to the map as a layer
client.addLayer(bikeroutelayer);
client.getLeafletLayer().addTo(map);

/*
 * Listen for changes on the layer picker
 */

// Step 1: Find the dropdown by class. If you are using a different class, change this.
var layerPicker = document.querySelector('.layer-picker');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
layerPicker.addEventListener('change', function (e) {
  // The value of the dropdown is in e.target.value when it changes
  var lanedir = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  if (lanedir === 'all') {
    console.log('All was selected');
    // If the value is "all" then we show all of the features, unfiltered
    bikeroutesource.setQuery("SELECT * FROM nyc_bike_routes_2017");
  }
  else {
    console.log('All was not selected');
    // Else the value must be set to a lanedir. Use it in an SQL query that will filter to that lanedir.
    console.log("SELECT * FROM nyc_bike_routes_2017 WHERE bikedir = '" + lanedir + "'");
    bikeroutesource.setQuery("SELECT * FROM nyc_bike_routes_2017 WHERE bikedir = '" + lanedir + "'");
  }
  
  // Sometimes it helps to log messages, here we log the lifestage. You can see this if you open developer tools and look at the console.
  console.log('Dropdown changed to "' + lanedir + '"');
});

