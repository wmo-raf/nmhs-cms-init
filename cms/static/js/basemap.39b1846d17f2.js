var basemap = {
    "version": 8,
    "glyphs": "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    // "sprite":"https://raw.githubusercontent.com/wmo-raf/nmhs-cms/main/media/weather",
    sources: {
        "openmaptiles": {
            "type": "vector",
            "url": "http://20.56.94.119/tileserver-gl/data/v3.json"
        },
        "basemap": {
            "type": "vector",
            "tiles": [
                "http://20.56.94.119/pg4w/tileserv/pgadapter.africa_gadm36_political_boundaries/{z}/{x}/{y}.pbf",
            ],
        }
    },
    "layers": [
        {
            "id": "background-light",
            "paint": {
                "background-color": "hsl(0, 0%, 100%)"
            },
            "type": "background",
            "metadata": {
                "mapbox:group": "basemap_light"
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Polygon"
                ],
                [
                    "!=",
                    "intermittent",
                    1
                ]
            ],
            "id": "water",
            "paint": {
                "fill-color": "hsl(203, 95%, 84%)"
            },
            "source": "openmaptiles",
            "source-layer": "water",
            "type": "fill",
            "metadata": {
                "mapbox:group": "basemap_light"
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Polygon"
                ],
                [
                    "==",
                    "intermittent",
                    1
                ]
            ],
            "id": "water_intermittent",
            "paint": {
                "fill-color": "hsl(203, 95%, 84%)",
                "fill-opacity": 0.7
            },
            "source": "openmaptiles",
            "source-layer": "water",
            "type": "fill",
            "metadata": {
                "mapbox:group": "basemap_light"
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "LineString"
                ],
                [
                    "==",
                    "brunnel",
                    "tunnel"
                ]
            ],
            "id": "waterway-tunnel",
            "paint": {
                "line-color": "hsl(203, 95%, 84%)",
                "line-dasharray": [
                    3,
                    3
                ],
                "line-gap-width": {
                    "stops": [
                        [
                            12,
                            0
                        ],
                        [
                            20,
                            6
                        ]
                    ]
                },
                "line-opacity": 1,
                "line-width": {
                    "base": 1.4,
                    "stops": [
                        [
                            8,
                            1
                        ],
                        [
                            20,
                            2
                        ]
                    ]
                }
            },
            "source": "openmaptiles",
            "source-layer": "waterway",
            "type": "line",
            "metadata": {
                "mapbox:group": "basemap_light"
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "LineString"
                ],
                [
                    "!in",
                    "brunnel",
                    "tunnel",
                    "bridge"
                ],
                [
                    "!=",
                    "intermittent",
                    1
                ]
            ],
            "id": "waterway",
            "paint": {
                "line-color": "hsl(203, 95%, 84%)",
                "line-opacity": 1,
                "line-width": {
                    "base": 1.4,
                    "stops": [
                        [
                            8,
                            1
                        ],
                        [
                            20,
                            8
                        ]
                    ]
                }
            },
            "source": "openmaptiles",
            "source-layer": "waterway",
            "type": "line",
            "metadata": {
                "mapbox:group": "basemap_light"
            },
            "layout": {
                "visibility": "none"
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "LineString"
                ],
                [
                    "!in",
                    "brunnel",
                    "tunnel",
                    "bridge"
                ],
                [
                    "==",
                    "intermittent",
                    1
                ]
            ],
            "id": "waterway_intermittent",
            "paint": {
                "line-color": "hsl(203, 95%, 84%)",
                "line-opacity": 1,
                "line-width": {
                    "base": 1.4,
                    "stops": [
                        [
                            8,
                            1
                        ],
                        [
                            20,
                            8
                        ]
                    ]
                },
                "line-dasharray": [
                    2,
                    1
                ]
            },
            "source": "openmaptiles",
            "source-layer": "waterway",
            "type": "line",
            "layout": {
                "visibility": "none"
            }
        },
        {
            "id": "road_pier",
            "type": "line",
            "metadata": {
                "mapbox:group": "roads"
            },
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "LineString"
                ],
                [
                    "in",
                    "class",
                    "pier"
                ]
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round",
                "visibility": "none"
            },
            "paint": {
                "line-color": "#fffca2",
                "line-width": {
                    "base": 1.2,
                    "stops": [
                        [
                            15,
                            1
                        ],
                        [
                            17,
                            4
                        ]
                    ]
                }
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "LineString"
                ],
                [
                    "in",
                    "class",
                    "path",
                    "track"
                ]
            ],
            "id": "road_path",
            "paint": {
                "line-color": "#fffca2",
                "line-dasharray": [
                    1,
                    1
                ],
                "line-width": {
                    "base": 1.55,
                    "stops": [
                        [
                            4,
                            0.25
                        ],
                        [
                            20,
                            10
                        ]
                    ]
                }
            },
            "layout": {
                "line-cap": "square",
                "line-join": "bevel",
                "visibility": "none"
            },
            "source": "openmaptiles",
            "source-layer": "transportation",
            "type": "line",
            "metadata": {
                "mapbox:group": "roads"
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "LineString"
                ],
                [
                    "in",
                    "class",
                    "minor",
                    "service"
                ]
            ],
            "id": "road_minor",
            "paint": {
                "line-color": "#fffca2",
                "line-width": {
                    "base": 1.55,
                    "stops": [
                        [
                            4,
                            0.25
                        ],
                        [
                            20,
                            30
                        ]
                    ]
                }
            },
            "layout": {
                "line-cap": "round",
                "line-join": "round",
                "visibility": "none"
            },
            "source": "openmaptiles",
            "source-layer": "transportation",
            "type": "line",
            "minzoom": 13,
            "metadata": {
                "mapbox:group": "roads"
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "LineString"
                ],
                [
                    "in",
                    "class",
                    "trunk",
                    "primary"
                ]
            ],
            "id": "road_trunk_primary",
            "paint": {
                "line-color": "#fffca2",
                "line-width": {
                    "base": 1.4,
                    "stops": [
                        [
                            6,
                            0.5
                        ],
                        [
                            20,
                            30
                        ]
                    ]
                }
            },
            "layout": {
                "line-cap": "round",
                "line-join": "round",
                "visibility": "none"
            },
            "source": "openmaptiles",
            "source-layer": "transportation",
            "type": "line",
            "metadata": {
                "mapbox:group": "roads"
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "LineString"
                ],
                [
                    "in",
                    "class",
                    "secondary",
                    "tertiary"
                ]
            ],
            "id": "road_secondary_tertiary",
            "paint": {
                "line-color": "#fffca2",
                "line-width": {
                    "base": 1.4,
                    "stops": [
                        [
                            6,
                            0.5
                        ],
                        [
                            20,
                            20
                        ]
                    ]
                }
            },
            "layout": {
                "line-cap": "round",
                "line-join": "round",
                "visibility": "none"
            },
            "source": "openmaptiles",
            "source-layer": "transportation",
            "type": "line",
            "metadata": {
                "mapbox:group": "roads"
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "LineString"
                ],
                [
                    "==",
                    "class",
                    "motorway"
                ]
            ],
            "id": "road_major_motorway",
            "layout": {
                "line-cap": "round",
                "line-join": "round",
                "visibility": "none"
            },
            "paint": {
                "line-color": "#fffca2",
                "line-offset": 0,
                "line-width": {
                    "base": 1.4,
                    "stops": [
                        [
                            8,
                            1
                        ],
                        [
                            16,
                            10
                        ]
                    ]
                }
            },
            "source": "openmaptiles",
            "source-layer": "transportation",
            "type": "line",
            "metadata": {
                "mapbox:group": "roads"
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "rank",
                    1
                ]
            ],
            "id": "poi_label",
            "layout": {
                "icon-size": 1,
                "text-anchor": "top",
                "text-field": "{name}",
                "text-font": [
                    "Noto Sans Regular"
                ],
                "text-max-width": 8,
                "text-offset": [
                    0,
                    0.5
                ],
                "text-size": 11
            },
            "minzoom": 14,
            "paint": {
                "text-color": "#666",
                "text-halo-blur": 1,
                "text-halo-color": "rgba(255,255,255,0.75)",
                "text-halo-width": 1,
                "text-opacity": 0.7
            },
            "source": "openmaptiles",
            "source-layer": "poi",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "labels_light"
            }
        },
        {
            "filter": [
                "all",
                [
                    "has",
                    "iata"
                ]
            ],
            "id": "airport-label",
            "layout": {
                "icon-size": 1,
                "text-anchor": "top",
                "text-field": "{name}",
                "text-font": [
                    "Noto Sans Regular"
                ],
                "text-max-width": 8,
                "text-offset": [
                    0,
                    0.5
                ],
                "text-size": 11
            },
            "minzoom": 10,
            "paint": {
                "text-color": "#666",
                "text-halo-blur": 1,
                "text-halo-color": "rgba(255,255,255,0.75)",
                "text-halo-width": 1,
                "text-opacity": 0.7
            },
            "source": "openmaptiles",
            "source-layer": "aerodrome_label",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "labels_light"
            }
        },
        {
            "filter": [
                "==",
                "$type",
                "LineString"
            ],
            "id": "road_major_label",
            "layout": {
                "symbol-placement": "line",
                "text-field": "{name}",
                "text-font": [
                    "Noto Sans Regular"
                ],
                "text-letter-spacing": 0.1,
                "text-rotation-alignment": "map",
                "text-size": {
                    "base": 1.4,
                    "stops": [
                        [
                            10,
                            8
                        ],
                        [
                            20,
                            14
                        ]
                    ]
                },
                "text-transform": "uppercase",
                "visibility": "none"
            },
            "paint": {
                "text-color": "#000",
                "text-halo-color": "hsl(0, 0%, 100%)",
                "text-halo-width": 2,
                "text-opacity": 0.7
            },
            "source": "openmaptiles",
            "source-layer": "transportation_name",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "labels_light"
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "!in",
                    "class",
                    "city",
                    "state",
                    "country",
                    "continent"
                ]
            ],
            "id": "place_label_other",
            "layout": {
                "text-anchor": "center",
                "text-field": "{name}",
                "text-font": [
                    "Noto Sans Regular"
                ],
                "text-max-width": 6,
                "text-size": {
                    "stops": [
                        [
                            6,
                            10
                        ],
                        [
                            12,
                            14
                        ]
                    ]
                }
            },
            "minzoom": 8,
            "paint": {
                "text-color": "hsl(0, 0%, 25%)",
                "text-halo-blur": 0,
                "text-halo-color": "hsl(0, 0%, 100%)",
                "text-halo-width": 2,
                "text-opacity": 0.7
            },
            "source": "openmaptiles",
            "source-layer": "place",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "labels_light"
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "city"
                ]
            ],
            "id": "place_label_city",
            "layout": {
                "text-field": "{name_en}",
                "text-font": [
                    "Noto Sans Regular"
                ],
                "text-max-width": 10,
                "text-size": {
                    "stops": [
                        [
                            3,
                            12
                        ],
                        [
                            8,
                            16
                        ]
                    ]
                }
            },
            "maxzoom": 16,
            "paint": {
                "text-color": "hsl(0, 0%, 0%)",
                "text-halo-blur": 0,
                "text-halo-color": "hsla(0, 0%, 100%, 0.75)",
                "text-halo-width": 2,
                "text-opacity": 0.7
            },
            "source": "openmaptiles",
            "source-layer": "place",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "labels_light"
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "country"
                ],
                [
                    "!has",
                    "iso_a2"
                ]
            ],
            "id": "country_label-other",
            "layout": {
                "text-field": "{name_en}",
                "text-font": [
                    "Noto Sans Regular"
                ],
                "text-max-width": 10,
                "text-size": {
                    "stops": [
                        [
                            3,
                            12
                        ],
                        [
                            8,
                            22
                        ]
                    ]
                }
            },
            "maxzoom": 12,
            "paint": {
                "text-color": "hsl(0, 0%, 13%)",
                "text-halo-blur": 0,
                "text-halo-color": "rgba(255,255,255,0.75)",
                "text-halo-width": 2,
                "text-opacity": 0.7
            },
            "source": "openmaptiles",
            "source-layer": "place",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "labels_light"
            }
        },
        {
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "country"
                ],
                [
                    "has",
                    "iso_a2"
                ]
            ],
            "id": "country_label",
            "layout": {
                "text-field": "{name_en}",
                "text-font": [
                    "Noto Sans Regular"
                ],
                "text-max-width": 10,
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            1,
                            10
                        ],
                        [
                            6,
                            24
                        ]
                    ]
                }
            },
            "maxzoom": 12,
            "paint": {
                "text-halo-width": 1.25,
                "text-halo-color": {
                    "base": 1,
                    "stops": [
                        [
                            2,
                            "rgba(255,255,255,0.75)"
                        ],
                        [
                            3,
                            "#fff"
                        ]
                    ]
                },
                "text-color": "hsl(0, 0%, 0%)",
                "text-opacity": 0.7
            },
            "source": "openmaptiles",
            "source-layer": "place",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "labels_light"
            }
        },

        {
            id: '1-fill',
            filter: ["==", "level", 0],
            maxzoom: 3,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            source: "basemap",
            type: "fill",
        },
        {
            id: '2-fill',
            filter: ["all", ["==", "size", "huge"], ["==", "level", 0]],
            maxzoom: 3,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            source: "basemap",
            type: "fill",
        },
        {
            id: '3-fill',
            filter: ["all", ["==", "size", "very big"], ["==", "level", 0]],
            maxzoom: 4,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            source: "basemap",
            type: "fill",
        },
        {
            id: '4-fill',
            source: "basemap",
            filter: ["all", ["==", "size", "big"], ["==", "level", 0]],
            maxzoom: 5,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '5-fill',
            source: "basemap",
            filter: ["all", ["==", "size", "medium"], ["==", "level", 0]],
            maxzoom: 6,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '6-fill',
            source: "basemap",
            filter: ["all", ["==", "size", "small"], ["==", "level", 0]],
            maxzoom: 7,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '7-fill',
            source: "basemap",
            filter: [
                "all",
                ["==", "size", "very small"],
                ["==", "level", 0],
            ],
            maxzoom: 8,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '8-fill',
            source: "basemap",
            filter: ["all", ["==", "size", "huge"], ["==", "level", 1]],
            maxzoom: 5,
            minzoom: 3,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '9-fill',
            source: "basemap",
            filter: ["all", ["==", "size", "very big"], ["==", "level", 1]],
            maxzoom: 6,
            minzoom: 4,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '10-fill',
            source: "basemap",
            filter: ["all", ["==", "size", "big"], ["==", "level", 1]],
            maxzoom: 7,
            minzoom: 5,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '11-fill',
            source: "basemap",
            filter: ["all", ["==", "size", "medium"], ["==", "level", 1]],
            maxzoom: 8,
            minzoom: 6,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '12-fill',
            source: "basemap",
            filter: ["all", ["==", "size", "small"], ["==", "level", 1]],
            maxzoom: 8,
            minzoom: 7,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '13-fill',
            source: "basemap",
            filter: [
                "all",
                ["==", "size", "very small"],
                ["==", "level", 1],
            ],
            maxzoom: 9,
            minzoom: 8,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '14-fill',
            source: "basemap",
            filter: ["all", ["==", "size", "huge"], ["==", "level", 2]],
            minzoom: 5,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '15-fill',
            source: "basemap",
            filter: ["all", ["==", "size", "very big"], ["==", "level", 2]],
            minzoom: 6,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '16-fill',
            source: "basemap",
            filter: ["all", ["==", "size", "big"], ["==", "level", 2]],
            minzoom: 7,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '17-fill',
            source: "basemap",
            filter: ["all", ["==", "size", "medium"], ["==", "level", 2]],
            minzoom: 8,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '18-fill',
            source: "basemap",
            filter: ["all", ["==", "size", "small"], ["==", "level", 2]],
            minzoom: 8,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },
        {
            id: '19-fill',
            source: "basemap",
            filter: [
                "all",
                ["==", "size", "very small"],
                ["==", "level", 2],
            ],
            minzoom: 9,
            paint: {
                "fill-color": "#ffffff",
                "fill-opacity": 0,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "fill",
        },


        {
            id: "1",
            source: "basemap",
            filter: ["==", "level", 0],
            maxzoom: 4,
            paint: {
                "line-color": "#7f7f7f",
                "line-width": 0.7,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "2",
            source: "basemap",
            filter: ["all", ["==", "size", "huge"], ["==", "level", 0]],
            maxzoom: 3,
            paint: {
                "line-color": "#7f7f7f",
                "line-width": 0.7,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "3",
            source: "basemap",

            filter: ["all", ["==", "size", "very big"], ["==", "level", 0]],
            maxzoom: 4,
            paint: {
                "line-color": "#7f7f7f",
                "line-width": 0.7,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "4",
            source: "basemap",

            filter: ["all", ["==", "size", "big"], ["==", "level", 0]],
            maxzoom: 5,
            paint: {
                "line-color": "#7f7f7f",
                "line-width": 0.7,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "5",
            source: "basemap",

            filter: ["all", ["==", "size", "medium"], ["==", "level", 0]],
            maxzoom: 6,
            paint: {
                "line-color": "#7f7f7f",
                "line-width": 0.7,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "6",
            source: "basemap",

            filter: ["all", ["==", "size", "small"], ["==", "level", 0]],
            maxzoom: 7,
            paint: {
                "line-color": "#7f7f7f",
                "line-width": 0.7,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "7",
            source: "basemap",

            filter: [
                "all",
                ["==", "size", "very small"],
                ["==", "level", 0],
            ],
            maxzoom: 8,
            paint: {
                "line-color": "#7f7f7f",
                "line-width": 0.7,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "8",
            source: "basemap",

            filter: ["all", ["==", "size", "huge"], ["==", "level", 1]],
            maxzoom: 5,
            minzoom: 3,
            paint: {
                "line-color": "#8b8b8b",
                "line-width": 0.3,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "9",
            source: "basemap",

            filter: ["all", ["==", "size", "very big"], ["==", "level", 1]],
            maxzoom: 6,
            minzoom: 4,
            paint: {
                "line-color": "#8b8b8b",
                "line-width": 0.3,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "10",
            source: "basemap",

            filter: ["all", ["==", "size", "big"], ["==", "level", 1]],
            maxzoom: 7,
            minzoom: 5,
            paint: {
                "line-color": "#8b8b8b",
                "line-width": 0.3,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "11",
            source: "basemap",

            filter: ["all", ["==", "size", "medium"], ["==", "level", 1]],
            maxzoom: 8,
            minzoom: 6,
            paint: {
                "line-color": "#8b8b8b",
                "line-width": 0.3,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "12",
            source: "basemap",

            filter: ["all", ["==", "size", "small"], ["==", "level", 1]],
            maxzoom: 8,
            minzoom: 7,
            paint: {
                "line-color": "#8b8b8b",
                "line-width": 0.3,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "13",
            source: "basemap",

            filter: [
                "all",
                ["==", "size", "very small"],
                ["==", "level", 1],
            ],
            maxzoom: 9,
            minzoom: 8,
            paint: {
                "line-color": "#8b8b8b",
                "line-width": 0.3,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "14",
            source: "basemap",
            filter: ["all", ["==", "size", "huge"], ["==", "level", 2]],
            minzoom: 5,
            paint: {
                "line-color": "#444444",
                "line-dasharray": [2, 4],
                "line-width": 0.5,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "15",
            source: "basemap",
            filter: ["all", ["==", "size", "very big"], ["==", "level", 2]],
            minzoom: 6,
            paint: {
                "line-color": "#444444",
                "line-dasharray": [2, 4],
                "line-width": 0.5,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "16",
            source: "basemap",
            filter: ["all", ["==", "size", "big"], ["==", "level", 2]],
            minzoom: 7,
            paint: {
                "line-color": "#444444",
                "line-dasharray": [2, 4],
                "line-width": 0.5,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "17",
            source: "basemap",
            filter: ["all", ["==", "size", "medium"], ["==", "level", 2]],
            minzoom: 8,
            paint: {
                "line-color": "#444444",
                "line-dasharray": [2, 4],
                "line-width": 0.5,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "18",
            source: "basemap",
            filter: ["all", ["==", "size", "small"], ["==", "level", 2]],
            minzoom: 8,
            paint: {
                "line-color": "#444444",
                "line-dasharray": [2, 4],
                "line-width": 0.5,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },
        {
            id: "19",
            source: "basemap",
            filter: [
                "all",
                ["==", "size", "very small"],
                ["==", "level", 2],
            ],
            minzoom: 9,
            paint: {
                "line-color": "#444444",
                "line-dasharray": [2, 4],
                "line-width": 0.5,
            },
            "source-layer": "pgadapter.africa_gadm36_political_boundaries",
            type: "line",
        },

    ]
}