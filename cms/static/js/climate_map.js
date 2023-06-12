const displayTime = new Date()

function roundToNearestHour(date) {
    const hours = date.getHours();
    const roundedHours = Math.ceil(hours / 3) * 3; // Multiples of 3
    date.setMinutes(date.getMinutes() + 30);
    date.setHours(roundedHours)
    date.setMinutes(0, 0, 0);

    return date;
}

function addLegend(selected_layer){
    $('#floating-legend').html(`
    <p style="font-weight:600; font-size:14px;margin-bottom:0" class="title">${selected_layer.title}</p>
        <p style="margin:0;font-size:12px;" class="subtitle">${selected_layer.subtitle}</p>
        <p style="margin:0;font-size:12px;" class="subtitle"><b>Period:</b> ${displayTime}</p>

        <div style="width: 100%;
        height: 0.3em;
        position: relative;
        margin-bottom:2em;
        background: linear-gradient(to right, ${selected_layer.legend_colors.map(legend => legend.item_color)});
    ">
    ${selected_layer.legend_colors.map((legend, i) => `<span class="stop-label" style="left: calc( (100% / ${selected_layer.legend_colors.length}) * (${i}) )">${legend.item_val}</span>`).join(" ")}</div> `)

}


$(document).ready(function() {
    
    // code to be executed when the DOM is ready
    
    const wmsTime = roundToNearestHour(displayTime).toISOString()
    
    const categoryButtons = document.querySelectorAll('.category-btn');
    $('#floating-legend').html(`
    <p style="font-weight:600; font-size:14px;margin-bottom:0" class="title">${wms_layers[0].title}</p>
    <p style="margin:0;font-size:12px;" class="subtitle">${wms_layers[0].subtitle}</p>
    <p style="margin:0;font-size:12px;" class="subtitle"><b>Period:</b> ${displayTime} </p>

    <div style="width: 100%;
        height: 0.3em;
        position: relative;
        margin-bottom:2em;
        background: linear-gradient(to right,${wms_layers[0].legend_colors.map(legend => legend.item_color)});
    ">
    ${wms_layers[0].legend_colors.map((legend, i) => `<span class="stop-label" style="left: calc( (100% / ${wms_layers[0].legend_colors.length}) * (${i}) )">${legend.item_val}</span>`).join(" ")} </div>`)
    
        

    const climateMap = new maplibregl.Map({
        container: "climate-map", // container ID
        style: basemap,
        center: [30.019531249998607, 16.130262012034265], // starting position [lng, lat]
        zoom: 4.2, // starting zoom
        scrollZoom: false,
    });

    // Add zoom and rotation controls to the map.
    climateMap.addControl(new maplibregl.NavigationControl(), 'bottom-right');

    climateMap.on("load", () => {



        if (country_geom) {
            const wktWithoutSrids = country_geom.replace(/^SRID=\d+;/, "");

            // define a regular expression pattern to match the coordinates
            const pattern = /\(([^()]+)\)/g;

            // create an array to store the coordinates
            let coordinates = [];

            // loop through each match of the pattern and extract the coordinates
            let match;
            while ((match = pattern.exec(wktWithoutSrids)) !== null) {
                // split the match into individual coordinates
                const coords = match[1].trim().split(', ');
                // convert the coordinates to an array of numbers
                const coordsArray = coords.map(coord => coord.split(" ").map(co => Number(co)));
                // add the coordinates to the array
                coordinates.push(coordsArray);

            }

            var multipolyFeature = {
                type: "Feature",
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [coordinates],
                },
            }

            // output the coordinates to the console
            var bounds = turf.bbox({
                type: "FeatureCollection",
                features: [multipolyFeature],
            });
            climateMap.fitBounds(bounds, { padding: 20 });

        }

        const styleLayers = climateMap.getStyle().layers;

        // Find the index of the first symbol layer in the map style.
        let admin0Boundaries, admin1Boundaries, cityLabel,countryLabel;
        for (const l of styleLayers) {
            if (l.id === "1") {
                admin0Boundaries = l.id;
            }
            if (l.id === "8") {
                admin1Boundaries = l.id;
            }
            if (l.id === "country_label") {
                countryLabel = l.id;
            }
            if (l.id === "place_label_city") {
                cityLabel = l.id;
            }
        }

        // Get all the items
        const layer_items = document.querySelectorAll('.layer-list-block');

    
        fetch(`http://20.56.94.119/api/geostore/admin/${countryIso}?thresh=0.005`)
            .then(response => response.json())
            .then(data => {
                climateMap.addSource('wms-source', {
                    type: "raster",
                    tiles: [
                        `${wms_layers[0].base_url}?service=WMS&request=GetMap&version=${wms_layers[0].version}&width=${wms_layers[0].width}&height=${wms_layers[0].height}&styles=&transparent=${wms_layers[0].transparent}&srs=${wms_layers[0].srs}&bbox={bbox-epsg-3857}&format=${wms_layers[0].format}&time=${wmsTime}&layers=${wms_layers[0].layers__name}&geojson_feature_id=${data.data.id}&canClipToGeom=true`,
                    ],
                    minzoom: 3,
                    maxzoom: 12,
                    'tileSize': 256

                });

                climateMap.addLayer({
                    'id': 'wms-layer',
                    'type': 'raster',
                    'source': 'wms-source',
                    //'paint': {
                    //  'raster-opacity': 0.8
                    //}
                }, cityLabel,countryLabel,admin1Boundaries, admin0Boundaries, );

                // Iterate over the buttons and add click event listeners
                categoryButtons.forEach(button => {

                    button.addEventListener('click', (e) => {
                        // button.classList.remove('active')
                        [].forEach.call(categoryButtons, function(el) {
                            el.classList.remove("active");
                        });

                        // $('.category-btn').remove('active')
                        // button.classList.remove('active')
                        e.target.classList.add('active')
                        
                        // Get the category from the button's data attribute
                        const category = button.dataset.category;

                        // Get all the layers
                        const layers = document.querySelectorAll('.layer-list-block');

                        var match_layers = []
                        
                        
                        layers.forEach(layer => {
                            
                           if(layer.dataset.category === category) {
                            match_layers.push(layer)
                            layer.style.display = 'flex';

                           }else{
                            layer.style.display = 'none';

                            
                           }

                        })

                        console.log(match_layers)

                        match_layers.forEach(layer => {
                            layer.classList.remove('active')

                        })
                        match_layers[0].classList.add('active')
                        var selected_layer = wms_layers.find(layer_item => layer_item.id == match_layers[0].id )
                        addLegend(selected_layer)

                        if (climateMap.getLayer("wms-layer")) {
                            climateMap.removeLayer("wms-layer");
                        }
                        if (climateMap.getSource("wms-source")) {
                            climateMap.removeSource("wms-source");
                        }

                        climateMap.addSource('wms-source', {
                            type: "raster",
                            tiles: [
                                `${selected_layer.base_url}?service=WMS&request=GetMap&version=${selected_layer.version}&width=${selected_layer.width}&height=${selected_layer.height}&styles=&transparent=${selected_layer.transparent}&srs=${selected_layer.srs}&bbox={bbox-epsg-3857}&format=${selected_layer.format}&time=${wmsTime}&layers=${selected_layer.layers__name}&geojson_feature_id=${data.data.id}&canClipToGeom=true`,
                            ],
                            minzoom: 3,
                            maxzoom: 12,
                            'tileSize': 256

                        });

                        climateMap.addLayer({
                            'id': 'wms-layer',
                            'type': 'raster',
                            'source': 'wms-source',
                            //'paint': {
                            //  'raster-opacity': 0.8
                            //}
                        }, cityLabel, countryLabel, admin1Boundaries, admin0Boundaries);


                        match_layers.forEach(layer => {
                            
                            layer.addEventListener('click', (e) => {
                                [].forEach.call(match_layers, function(el) {
                                    el.classList.remove("active");
                                });
        
                                e.target.parentNode.classList.add('active')

                                
                            })
                        })

                        
                    });
                });

                // Loop through the items and add a click event listener to each
                layer_items.forEach(item => {

                    item.addEventListener('click', (e) => {
                        [].forEach.call(layer_items, function(el) {
                            el.classList.remove("active");
                        });

                        e.target.parentNode.classList.add('active')
                        // Remove the active class from all items
                       
                        wms_layers.map(layer => {

                            if (layer.id == item.id) {
                                addLegend(layer)

                                if (climateMap.getLayer("wms-layer")) {
                                    climateMap.removeLayer("wms-layer");
                                }
                                if (climateMap.getSource("wms-source")) {
                                    climateMap.removeSource("wms-source");
                                }

                                climateMap.addSource('wms-source', {
                                    type: "raster",
                                    tiles: [
                                        `${layer.base_url}?service=WMS&request=GetMap&version=${layer.version}&width=${layer.width}&height=${layer.height}&styles=&transparent=${layer.transparent}&srs=${layer.srs}&bbox={bbox-epsg-3857}&format=${layer.format}&time=${wmsTime}&layers=${layer.layers__name}&geojson_feature_id=${data.data.id}&canClipToGeom=true`,
                                    ],
                                    minzoom: 3,
                                    maxzoom: 12,
                                    'tileSize': 256

                                });

                                climateMap.addLayer({
                                    'id': 'wms-layer',
                                    'type': 'raster',
                                    'source': 'wms-source',
                                    //'paint': {
                                    //  'raster-opacity': 0.8
                                    //}
                                }, cityLabel, countryLabel, admin1Boundaries, admin0Boundaries);
                            }

                        })
                        // // Add the active class to the clicked item
                        // item.classList.add('active');

                    })

                })
            })

    })
// }

})


