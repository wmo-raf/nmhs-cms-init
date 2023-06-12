
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JhY2VhbW9uZGkiLCJhIjoiY2s4dGphcGQwMDBhcjNmcnkzdGk3MnlrZCJ9.54r40Umo0l3dHseEbrQpUg';
const homeMap = new mapboxgl.Map({
    container: 'home-map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: [30.30252782218591,
        15.302857659429051], // starting position [lng, lat]
    zoom: 4.2,// starting zoom,
    scrollZoom: false

});
