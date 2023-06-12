 $(document).ready(function() {
    // code to be executed when the DOM is ready
 
    const forecast_map = new maplibregl.Map({
        container: "home-map", // container ID
        style: basemap,
        center: [30.019531249998607, 16.130262012034265], // starting position [lng, lat]
        zoom: 4.2, // starting zoom
        scrollZoom: false,

    });

    // Add zoom and rotation controls to the map.
    forecast_map.addControl(new maplibregl.NavigationControl());

    var allAreas = $(".alert-area")
        .map(function () {
            return JSON.parse(this.value);
        })
        .get();

        forecast_map.on("load", () => {

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
            forecast_map.fitBounds(bounds, { padding: 20 });
        }

        if (allAreas.length > 0) {
            var polyFeature = [];
            allAreas.map((area) => {
                // Remove the SRID prefix
                const wktWithoutSrid = area.area.replace(/^SRID=\d+;/, "");

                // Extract the coordinates from the polygon string using a regex pattern
                const match = /\((.*?)\)/.exec(wktWithoutSrid);

                revCoords = [];

                if (match) {
                    const coordinatePairs = match[1].split(", ");
                    const coordinates = coordinatePairs.map((pair) =>
                        pair.replace("(", "").split(" ").map(parseFloat)
                    );

                    polyFeature.push({
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: [coordinates],
                        },
                        properties: {
                            areaDesc: area.areaDesc,
                            severity: area.severity,
                            severityInfo: area.severityInfo,
                            event: area.event
                        },
                    });
                }
            });

            forecast_map.addSource("alert-areas", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: polyFeature,
                },
            });

            forecast_map.addLayer({
                id: "alert-areas-layer",
                type: "fill",
                source: "alert-areas",
                paint: {
                    "fill-color": "#088",
                    "fill-color": [
                        "case",
                        ["==", ["get", "severity"], "Extreme"],
                        "#d72f2a",
                        ["==", ["get", "severity"], "Severe"],
                        "#f89904",
                        ["==", ["get", "severity"], "Moderate"],
                        "#e4e616",
                        ["==", ["get", "severity"], "Minor"],
                        "#53ffff",
                        ["==", ["get", "severity"], "Unknown"],
                        "#3366ff",
                        "black",
                    ],
                    "fill-opacity": 0.7,
                },
            });

            // When a click event occurs on a feature in the places layer, open a popup at the
            // location of the feature, with description HTML from its properties.
            forecast_map.on("click", "alert-areas-layer", (e) => {
                // Copy coordinates array.
                const description = e.features[0].properties.areaDesc;
                const severity = e.features[0].properties.severityInfo;
                const event = e.features[0].properties.event;

                new maplibregl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`<div class="block" style="margin:10px"><h2 class="title" style="font-size:18px;">${description}</h2> <h2 class="subtitle" style="font-size:14px;">${event}</h2> <hr> <p>${severity}</p></div>`)
                    .addTo(forecast_map);
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            forecast_map.on("mouseenter", "alert-areas-layer", () => {
                forecast_map.getCanvas().style.cursor = "pointer";
            });

            // Change it back to a pointer when it leaves.
            forecast_map.on("mouseleave", "alert-areas-layer", () => {
                forecast_map.getCanvas().style.cursor = "";
            });
        }

        var cityForecasts = JSON.parse(daily_forecasts.replace(/'/g, '"'))
        if (cityForecasts) {
            // load svg icons as symbols
            cityForecasts.map(forecast => {
                return forecast.forecast_features.features.map(city => {


                    let img = new Image()

                    img.onload = () => {
                        if (!forecast_map.hasImage(city.properties.condition_icon)) {
                            return forecast_map.addImage(`${city.properties.condition_icon}`, img)
                        }

                    }
                    img.src = `${media_url}${city.properties.condition_icon}`
                    return img.src

                })
            })
            // initial loading of forecasts
            forecast_map.addSource("city-forecasts", {
                type: "geojson",
                data: cityForecasts[0].forecast_features
            })

            forecast_map.addLayer({
                id: "city-forecasts",
                source: "city-forecasts",
                type: "symbol",
                'layout': {
                    'icon-image': ['get', 'condition_icon'],
                    'icon-size': 0.3,
                    'icon-allow-overlap': true,
                    'text-allow-overlap': true,

                },
                'paint': {
                    // 'icon-halo-color': 'red',
                    // 'icon-halo-width': 100,
                    // 'icon-color': '#fff',
                    // 'icon-halo-blur': 100,
                }
            })
            forecast_map.addLayer({
                id: "city-forecasts-max_temp",
                source: "city-forecasts",
                type: "symbol",
                'layout': {
                    'text-offset': [2, -0.5],
                    'text-field': ['concat', ['get', 'max_temp'], '°C'],
                    'text-allow-overlap': true,
                    'icon-allow-overlap': true

                },
                'paint': {
                    'text-halo-color': '#fff',
                    'text-halo-width': 2,


                }

            })
            forecast_map.addLayer({
                id: "city-forecasts-min_temp",
                source: "city-forecasts",
                type: "symbol",
                'layout': {
                    'text-offset': [2.5, 0.5],
                    'text-field': ['concat', ['get', 'min_temp'], '°C'],
                    'text-size': 12,
                    'text-allow-overlap': true,
                    'icon-allow-overlap': true


                },
                'paint': {
                    'text-halo-color': '#fff',
                    'text-halo-width': 2,

                }

            })

            // toggle forecasts by selected date 
            $('#daily_forecast').on('change', function (e) {
                var optionSelected = $("option:selected", this);
                var valueSelected = this.value;
                var selectedForecast = cityForecasts.find(forecast => forecast.forecast_date === valueSelected)

                if (forecast_map.getLayer("city-forecasts")) {
                    forecast_map.removeLayer("city-forecasts");
                }
                if (forecast_map.getLayer("city-forecasts-max_temp")) {
                    forecast_map.removeLayer("city-forecasts-max_temp");
                }

                if (forecast_map.getLayer("city-forecasts-min_temp")) {
                    forecast_map.removeLayer("city-forecasts-min_temp");
                }
                if (forecast_map.getSource("city-forecasts")) {
                    forecast_map.removeSource("city-forecasts");
                }



                forecast_map.addSource("city-forecasts", {
                    type: "geojson",
                    data: selectedForecast.forecast_features
                })

                forecast_map.addLayer({
                    id: "city-forecasts",
                    source: "city-forecasts",
                    type: "symbol",
                    'layout': {
                        'icon-image': ['get', 'condition_icon'],
                        'icon-size': 0.3,
                        'icon-allow-overlap': true,
                        'text-allow-overlap': true,


                    },
                    // 'paint': {
                    //     'icon-halo-color': 'red',
                    //     'icon-halo-width': 10,
                    //     'icon-color': '#fff',
                    //     'icon-halo-blur': 10
                    // }
                })
                // map.addLayer({
                //   id: "city-forecasts-shadow",
                //   source: "city-forecasts",
                //   type: "circle",
                //   'layout': {
                //     // 'icon-image': ['get', 'condition_icon'],
                //     // 'icon-size': 0.25,
                //     // 'icon-allow-overlap': true

                //   },
                //   'paint': {
                //     // 'icon-halo-color': 'red',
                //     // 'icon-halo-width': 10,
                //     // 'icon-color': '#fff',
                //     // 'icon-halo-blur': 10
                //   }
                // })

                forecast_map.addLayer({
                    id: "city-forecasts-max_temp",
                    source: "city-forecasts",
                    type: "symbol",
                    'layout': {
                        'text-offset': [2, -0.5],
                        'text-field': ['concat', ['get', 'max_temp'], '°C'],
                        'text-allow-overlap': true,
                        'icon-allow-overlap': true,

                    },
                    'paint': {
                        'text-halo-color': '#fff',
                        'text-halo-width': 2,

                    }

                })
                forecast_map.addLayer({
                    id: "city-forecasts-min_temp",
                    source: "city-forecasts",
                    type: "symbol",
                    'layout': {
                        'text-offset': [2.5, 0.5],
                        'text-field': ['concat', ['get', 'min_temp'], '°C'],
                        'text-size': 12,
                        'text-allow-overlap': true,
                        'icon-allow-overlap': true,


                    },
                    'paint': {
                        'text-halo-color': '#fff',
                        'text-halo-width': 2,

                    }

                })
            });

            // Create a popup object
            var popup = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false
            });
  

            // When a click event occurs on a feature in the places layer, open a popup at the
            // location of the feature, with description HTML from its properties.
            forecast_map.on("mouseenter", "city-forecasts", (e) => {
                // Get the feature that was hovered over
                var feature = e.features[0];
                forecast_map.getCanvas().style.cursor = "pointer";

                // Copy coordinates array.
                const city_name = feature.properties.city_name;
                const condition_desc = feature.properties.condition_desc;
                const min_temp = feature.properties.min_temp;
                const max_temp = feature.properties.max_temp;
                const wind_direction = feature.properties.wind_direction;
                const wind_speed = feature.properties.wind_speed;

                
                popup.setLngLat(feature.geometry.coordinates)
                    .setHTML(`
                <div class="block" style="margin:10px; width:200px">
                    <h2 class="title" style="font-size:18px;">${city_name}</h2> 
                    <h2 class="subtitle" style="font-size:14px;">${condition_desc}</h2> 
                    <hr> 
                    <p><b>Min Temperature: </b>${min_temp} °C</p> 
                    <p><b>Max Temperature: </b>${max_temp} °C</p> 
                    <p><b>Wind Direction: </b>${wind_direction} °</p> 
                    <p><b>Wind Speed: </b>${wind_speed} km/hr</p>
                </div>`)
                    .addTo(forecast_map);
            });

            // // Change the cursor to a pointer when the mouse is over the places layer.
            // forecast_map.on("mouseenter", "city-forecasts", () => {
            //     forecast_map.getCanvas().style.cursor = "pointer";
            // });

            // Change it back to a pointer when it leaves.
            forecast_map.on("mouseleave", "city-forecasts", () => {
                popup.remove()
                forecast_map.getCanvas().style.cursor = "";
            });

        }

    })
// }

});