import {
  layers,
  getLayerConfig,
  getLegendUrlForFireEvent,
} from "./layers_config.js";
// import { layerThemes } from "./themes_config.js";
import { layerThemes_arctic } from "./themes_config_arctic.js";
// console.log("arctic is:",layerThemes_arctic);
import { layerThemes_antarctic } from "./themes_config_antarctic.js";
import { layerThemes } from "./themes_config.js";
import { createWMTSLayerObj } from "./factory/WMTS_layer_factory.js";
import { createTileWMSLayerObj } from "./factory/tileWMS_layer_factory.js";
import { createImageWMSLayerObj } from "./factory/imageWMS_layer_factory.js";
import { createXYZLayerObj } from "./factory/xyz_layer_factory.js";
import { createOSMLayerObj } from "./factory/osm_layer_factory.js";
var map = "";
let olc_vectorSource = null;
let olc_vectorLayer = null;

const queryString = window.location.search; // get query string, e.g. "?lat=...&lon=..."
const params = new URLSearchParams(queryString);
var current_projection = params.get("current_projection");
if (!current_projection) {
  current_projection = "EPSG:4326";
}

export function clipLayerIfRequired(layerToClip, clippingLyr) {
  if (!clippingLyr) {
    return;
  }

  const style = new ol.style.Style({
    fill: new ol.style.Fill({
      color: "black",
    }),
  });

  console.log("Attaching post render function for clipping");
  layerToClip.on("postrender", function (e) {
    console.log("Post render called for clipping");
    //var ctx = e.context;
    //ctx.restore();
    const vectorContext = ol.render.getVectorContext(e);
    e.context.globalCompositeOperation = "destination-in";
    clippingLyr.getSource().forEachFeature(function (feature) {
      console.log("Clipping feature ");

      vectorContext.drawFeature(feature, style);
    });
    e.context.globalCompositeOperation = "source-over";
  });
}

let clippingLayer = null;
let app = null;
let swipeAttachedLayer = null;
let storyURL = "https://vedas.sac.gov.in/vone_t0/story/";
let initialExtent = [
  67.1766451354, 2.96553477623, 97.4025614766, 39.4940095078,
];
let extent = initialExtent;
let swipePrerenderFuntion = function (event) {
  const swipe = document.getElementById("swipeInput");

  if (!swipe) {
    return;
  }
  const ctx = event.context;
  const mapSize = map.getSize();
  const width = mapSize[0] * (swipe.value / 100);
  const tl = ol.render.getRenderPixel(event, [width, 0]);
  const tr = ol.render.getRenderPixel(event, [mapSize[0], 0]);
  const bl = ol.render.getRenderPixel(event, [width, mapSize[1]]);
  const br = ol.render.getRenderPixel(event, mapSize);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(tl[0], tl[1]);
  ctx.lineTo(bl[0], bl[1]);
  ctx.lineTo(br[0], br[1]);
  ctx.lineTo(tr[0], tr[1]);
  ctx.closePath();
  ctx.clip();
};

let swipePostrenderFunction = function (event) {
  const ctx = event.context;
  ctx.restore();
};

function customStringify(obj, blacklist) {
  return JSON.stringify(obj, function (key, value) {
    if (blacklist.includes(key)) {
      return undefined; // Exclude blacklisted properties
    }
    if (typeof value === "object" && value !== null) {
      // Recursively apply customStringify for nested objects
      const filteredObj = {};
      for (const prop in value) {
        if (!blacklist.includes(prop)) {
          filteredObj[prop] = value[prop];
        }
      }
      return filteredObj;
    }
    return value;
  });
}

function mergeParameters(obj1, obj2) {
  // Loop through all properties of obj2
  for (let prop in obj2) {
    // Check if the property exists in obj1 and is an object (recursively merge)
    if (
      obj1.hasOwnProperty(prop) &&
      typeof obj1[prop] === "object" &&
      obj2[prop] !== null
    ) {
      obj1[prop] = mergeParameters(obj1[prop], obj2[prop]);
    } else {
      // Otherwise, simply assign the property from obj2 to obj1
      obj1[prop] = obj2[prop];
    }
  }
  return obj1;
}

function initMap() {
  // Corrected proj4 definition
  proj4.defs(
    "EPSG:3413",
    "+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"
  );

  ol.proj.proj4.register(proj4);

  console.log("this is current projection -- ", current_projection);
  if (current_projection === "EPSG:3413") {
    initialExtent = [-3850000.0, -5350000.0, 3750000.0, 5850000.0];
  } else {
    initialExtent = [
      67.1766451354, 2.96553477623, 97.4025614766, 39.4940095078,
    ];
  }

  console.log("Current projection in init map", current_projection);

  map = new ol.Map({
    target: "map",
    controls: ol.control
      .defaults({
        attributionOptions: {
          collapsible: false,
        },
      })
      .extend([
        new ol.control.MousePosition({
          coordinateFormat: ol.coordinate.createStringXY(4),
          projection: current_projection,
          target: document.getElementById("mouse-position"),
        }),
      ]),
    layers: [
      // Add your layers here, for example:
      // new ol.layer.Tile({
      //   source: new ol.source.XYZ({ url: '...' })
      // })
    ],
    view: new ol.View({
      projection: current_projection,
      // center: [0, 0], // center at North Pole in EPSG:3413
      // zoom: 2,
    }),
  });

  //console.log("Map object initialized in init map",map);

  map.addControl(new ol.control.ScaleLine());

  if (typeof initialExtent !== "undefined") {
    console.log("Loading initial extent", initialExtent);
    map.getView().fit(initialExtent, { size: map.getSize() });
  }
  //map.getView().fit(initialExtent);

  // map.on("click", async function (evt) {

  //  if(app.selectedTool){
  //   app.isShowToolOutput = true;
  //   app.loadChartMsg = "Loading chart data...";
  //     let lon = evt.coordinate[0];
  //     let lat = evt.coordinate[1];

  //     app.loadChartMsg = await app.selectedTool.runTool(app.toolLayerConfig,app.selectedTool,lon,lat);

  //  }

  //   // if (app.toolLayerConfig) {
  //   //   app.isShowToolOutput = true;
  //   //   app.loadChartMsg = "Loading chart data...";
  //   //   let lon = evt.coordinate[0];
  //   //   let lat = evt.coordinate[1];

  //   //   app.showChart(app.toolLayerConfig, lon, lat);
  //   // }
  // });
}

var addVectorLayer;
let vectorLayer;

function findLocation(location = null, zoom = 12, animation_duration = 200) {
  console.log("findlocation", location);
  let coords = location ? location.split(",") : this.lonLat?.split(",");

  if (!coords || coords.length !== 2) {
    alert("Please enter a valid location.");
    return;
  }

  // Parse latitude first, then longitude
  let latitude = parseFloat(coords[0].trim());
  let longitude = parseFloat(coords[1].trim());

  if (isNaN(longitude) || isNaN(latitude)) {
    alert("Invalid coordinates. Please try again.");
    return;
  }

  let view = map.getView();
  view.animate({
    center: [parseFloat(longitude), parseFloat(latitude)], // OpenLayers expects [lon, lat]
    zoom: zoom,
    duration: animation_duration,
  });

  if (!vectorLayer) {
    const pointsource = new ol.source.Vector({
      features: [
        new ol.Feature(
          new ol.geom.Point([parseFloat(longitude), parseFloat(latitude)]) // lon, lat
        ),
      ],
      featureProjection: current_projection,
    });

    vectorLayer = new ol.layer.Vector({
      source: pointsource,
      style: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({ color: "red" }),
          stroke: new ol.style.Stroke({ color: "white" }),
        }),
      }),
      zIndex: 4000,
    });

    map.addLayer(vectorLayer);
  } else {
    const feature = vectorLayer.getSource().getFeatures()[0];
    feature.setGeometry(new ol.geom.Point([longitude, latitude]));
    map.getView().animate({
      center: [longitude, latitude],
      zoom: zoom,
      duration: animation_duration,
    });
  }

  // breakpoint here
  if (app.selectedTool && app.selectedTool.onFindLocation) {
    app.selectedTool.onFindLocation(
      { coordinate: [longitude, latitude] },
      app.toolLayerConfig,
      app.selectedTool,
      map,
      app
    );
  }
}

var selected_layer_theme = layerThemes;
console.log("projection is :", current_projection);
if (current_projection === "EPSG:3413") {
  selected_layer_theme = layerThemes_arctic;
} else if (current_projection === "EPSG:3031") {
  selected_layer_theme = layerThemes_antarctic;
}
console.log("selected layer theme:", selected_layer_theme);

// filter themes here

app = new Vue({
  el: "#app",
  data: {
    showToolModal: false,
    selectedTool: "",
    selectedToolOption: "",
    lonLat: "",
    address: "",
    hideBanner: false,
    hideFooter: false,
    searchQuery: "",
    suggestions: [],
    currentFocus: -1,
    layers: layers,
    showSwipePanel: false,
    layerThemes: selected_layer_theme,
    layerThemes_arctic: selected_layer_theme,
    layerThemes_antarctic: selected_layer_theme,
    showThemeCatalogue: false,
    searchContent: "",
    leftLayerConfig: null,
    swipeLayerConfig: null,
    swipeLayerConfigId: null,
    isShowThemes: true,
    filteredLayers: "",
    selectedMode: "date",
    selectedSubTheme: selected_layer_theme.visualization.subtheme.optical,
    current_projection: current_projection,
    selectedLayerConfigToShow: {},
    refreshCounter: 0,
    isShowStoryModal: false,
    storyLink: "",
    isShowLayersPanel: true,
    appTitle: "",
    shortTitle: "",
    isMobile: window.innerWidth < 600,
    toolLayerConfig: "",
    selectedHelpText: "",
    isShowToolOutput: false,
    loadChartMsg: "",
    isPopupVisible: false,
    popupMessage: "",
    isMenuOpen: false,
    loading: false,
    isShowLayersPanel: true,
    isLocationSearchVisible: false,
    lonLat: "",
    myLat: null,
    myLon: null,
    showShpFileInput: false,

    isMyLocationVisible: false,
    zoom: 12.0,
    gridVisible: true,
    gridRows: 40,
    gridCols: 40,
    cellSizeLon: 0,
    cellSizeLat: 0,
    codeLength: 2,
    updateTimeout: null,
    generatedCodes: [],
    searchCode: '',
  },
  created() {
    window.addEventListener("resize", this.checkWindowSize);
  },

  destroyed() {
    window.removeEventListener("resize", this.checkWindowSize);
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    if (map) {
      map.un("moveend", () => this.handleMoveEnd());
      if (olc_vectorLayer) {
        map.removeLayer(olc_vectorLayer);
      }
      map.setTarget(null);
    }
  },

  async mounted() {
    this.current_projection = current_projection;
    initMap();
    this.initGridLayer();

    // --- HERE: parse lat/lon from URL hash and update map view ---
    {
      const queryString = window.location.search; // get query string, e.g. "?lat=...&lon=..."
      const params = new URLSearchParams(queryString);

      const lat = parseFloat(params.get("lat"));
      const lon = parseFloat(params.get("lon"));
      const zoom = parseFloat(params.get("zoom")); //zoom=1-28
      const animation_duration = parseFloat(params.get("animation_duration"));

      console.log("latlon", lat, lon);

      if (
        !isNaN(lat) &&
        !isNaN(lon) &&
        !isNaN(zoom) &&
        !isNaN(animation_duration)
      ) {
        findLocation(`${lon},${lat}`, zoom, animation_duration);
      } else if (isNaN(zoom) && !isNaN(animation_duration)) {
        findLocation(`${lon},${lat}`, 12, animation_duration);
      } else if (isNaN(animation_duration) && !isNaN(zoom)) {
        findLocation(`${lon},${lat}`, zoom);
      } else if (!isNaN(animation_duration) && !isNaN(zoom)) {
        findLocation(`${lon},${lat}`);
      } else {
        null;
      }

      /*
      if (!isNaN(lat) && !isNaN(lon)) {
        console.log("Centering map at:", lat, lon);
        const center = ol.proj.fromLonLat([lon, lat]);
        console.log("Projected center:", center);
        map.getView().setCenter(center);
        map.getView().setZoom(13);
      } else {
        console.log("No valid lat/lon in URL hash");
      }*/
    }
    // -------------------------------------------------------------

    console.log(
      "projection",
      current_projection,
      "\nselectedLayerTheme",
      selected_layer_theme
    );
    for (let [key, layerConfig] of Object.entries(
      this.selectedLayerConfigToShow
    )) {
      await this.updateLayerHelper(layerConfig.id);
      //Adding this code for chart bydefault selection
    }
    //on window width less than 570px, default layer panel set to off for mobile view. Sir's requirement
    this.isShowLayersPanel =
      window.innerWidth <= 570 ? false : this.isShowLayersPanel;

    // function getQueryParam(name) {
    //   const urlParams = new URLSearchParams(window.location.search);
    //   return urlParams.get(name);
    // }

    function getQueryParam(name) {
      // First, check if the parameter exists in the query string (URL search parameters)
      const urlParams = new URLSearchParams(window.location.search);
      let value = urlParams.get(name);

      // If not found in the query string, check in the hash fragment (after '#')
      if (!value) {
        const hashParams = new URLSearchParams(window.location.hash.substr(1)); // Remove the '#' symbol
        value = hashParams.get(name);
      }

      return value;
    }

    let appId = getQueryParam("appId");
    if (!appId) {
      appId = getQueryParam("appId");
    }

    let storyId = getQueryParam("storyId");

    let response = "";
    let configFile = appId ? appId : "uva";

    response = await (
      await fetch("app_configs/" + configFile + ".json")
    ).json();
    this.appTitle = response.appTitle;
    this.shortTitle = response.shortTitle ? response.shortTitle : "";

    function filterLayerThemes(layerThemes, layerIds) {
      const filteredThemes = {};

      Object.entries(layerThemes).forEach(([themeKey, theme]) => {
        const filteredSubthemes = {};
        Object.entries(theme.subtheme).forEach(([subthemeKey, subtheme]) => {
          const filteredLayers = Object.keys(subtheme.layers)
            .filter((layerId) => layerIds.includes(layerId))
            .reduce((acc, layerId) => {
              acc[layerId] = subtheme.layers[layerId];
              if (
                response.catalogueLayersConfig &&
                response.catalogueLayersConfig[layerId] !== undefined &&
                response.catalogueLayersConfig[layerId] !== null
              ) {
                // // It exists and is truthy (not null, undefined, 0, false, "", etc.)
                // console.log("catalogueLayersConfig is available");
                if (response.catalogueLayersConfig[layerId].STYLES) {
                  // console.log("Layer is : ", layerId)
                  // console.log("Old style is : ", acc[layerId].layerFactoryParams.layerParams.STYLES)
                  acc[layerId].layerFactoryParams.layerParams.STYLES =
                    response.catalogueLayersConfig[layerId].STYLES;
                  let legend = acc[layerId].legendUrl;
                  let newstyle =
                    response.catalogueLayersConfig[layerId].STYLES.match(
                      /\[[^\]]*\]/
                    );
                  let extractedStyles = newstyle ? newstyle[0] : null;
                  if (extractedStyles) {
                    // 2. Replace old STYLES=[...] in the URL with new one
                    acc[layerId].legendUrl = legend.replace(
                      /STYLES=\[[^\]]*\]/,
                      `STYLES=${extractedStyles}`
                    );
                  }
                  // console.log("New style is : ", response.catalogueLayersConfig[layerId].STYLES)
                  // console.log("New legendURL is : ", acc[layerId].legendUrl)
                }
              }
              return acc;
            }, {});

          if (Object.keys(filteredLayers).length > 0) {
            filteredSubthemes[subthemeKey] = {
              ...subtheme,
              layers: filteredLayers,
            };
          }
        });

        if (Object.keys(filteredSubthemes).length > 0) {
          filteredThemes[themeKey] = { ...theme, subtheme: filteredSubthemes };
        }
      });

      return filteredThemes;
    }

    if (response.catalogueLayerIds) {
      this.layerThemes = filterLayerThemes(
        selected_layer_theme,
        response.catalogueLayerIds
      );
    }

    this.hideBanner = response.hideBanner;
    this.hideFooter = response.hideFooter;

    if (response.initialExtent) {
      map
        .getView()
        .fit(
          [
            response.initialExtent[0],
            response.initialExtent[1],
            response.initialExtent[2],
            response.initialExtent[3],
          ],
          { duration: 1000 }
        );
    }

    if (response.clippingBoundary) {
      clippingLayer = new ol.layer.Vector({
        style: null,
        source: new ol.source.Vector({
          url: response.clippingBoundary,
          format: new ol.format.GeoJSON(),
        }),
      });

      map.addLayer(clippingLayer);
    }

    //if story id present then fetch layers of share story
    if (storyId) {
      let urlToFetchData = storyURL + storyId;

      let jsonData = await fetch(urlToFetchData).then((response) =>
        response.json()
      );

      let kvarray = Object.entries(jsonData.layersConfigs);
      let kvArrayLength = kvarray.length;
      for (let kvi = 0; kvi < kvArrayLength; kvi++) {
        let key = kvarray[kvi][0];
        let value = kvarray[kvi][1];

        await this.pushLayer(value.id, value.parameters, key, value.isShow);
      }

      map
        .getView()
        .fit(
          [
            jsonData.extent[0],
            jsonData.extent[1],
            jsonData.extent[2],
            jsonData.extent[3],
          ],
          { duration: 1000 }
        );

      // Now you can access the parsed JSON data
      if (jsonData.swipe) {
        this.showSwipePanel = true;
        this.swipeLayerConfigId = jsonData.swipe;
        this.swipeLayerConfig = this.selectedLayerConfigToShow[jsonData.swipe];
        this.openSwipe();
      }
    } else {
      // for (let i = 0; i < response.initialLayerIds.length; i++) {

      //   await this.pushLayer(value.id, value.parameters, key, value.isShow);
      // }

      // await response.initialLayerIds.forEach(async function (item) {
      //   console.log(`Current item is`,item);
      //   await app.pushLayer(item);
      //   console.log(`SElectedlayerconfig to show`,app.selectedLayerConfigToShow);
      // });

      for (const item of response.initialLayerIds) {
        console.log(`Current item is`, item);
        await app.pushLayer(item); // Ensures one item is processed before moving to the next
        console.log(
          `Selected layer config to show`,
          app.selectedLayerConfigToShow
        );
      }

      // for (
      //   var initialLayerIndex = 0;
      //   initialLayerIndex < response.initialLayerIds.length;
      //   initialLayerIndex++
      // ) {
      //   await app.pushLayer(response.initialLayerIds[initialLayerIndex]);
      // }

      if (response.extent) {
        map
          .getView()
          .fit(
            [
              response.extent[0],
              response.extent[1],
              response.extent[2],
              response.extent[3],
            ],
            { duration: 1000 }
          );
      }
    }

    for (let [key, layerConfig] of Object.entries(
      this.selectedLayerConfigToShow
    )) {
      //
      // if(layerConfig.tools.length>1 &&  layerConfig.isShow && layerConfig.baseIndex<150){
      //
      //   this.toolLayerConfig = layerConfig;
      // }
    }

    //Set the selected Tool options

    if (this.toolLayerConfig) {
      this.setToollayer(this.toolLayerConfig);
    }
  },
  methods: {
    async fetchSuggestions() {
      if (!this.searchQuery.trim()) {
        this.suggestions = [];
        return;
      }
      try {
        const response = await fetch(
          `https://vedas.sac.gov.in/mmi/suggest?address=${this.searchQuery}`
        );
        const data = await response.json();
        this.suggestions = data.suggestedLocations || [];
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    },

    checkWindowSize() {
      this.isMobile = window.innerWidth < 600;
    },
    handleKeydown(event) {
      if (!this.suggestions.length) return;
      if (event.key === "ArrowDown") {
        this.currentFocus = (this.currentFocus + 1) % this.suggestions.length;
      } else if (event.key === "ArrowUp") {
        this.currentFocus =
          (this.currentFocus - 1 + this.suggestions.length) %
          this.suggestions.length;
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (this.currentFocus > -1) {
          this.selectAddress(this.suggestions[this.currentFocus]);
        } else {
          this.findAddress();
        }
      }
    },
    async selectAddress(item) {
      this.searchQuery = item.placeAddress;
      this.suggestions = [];
      try {
        const response = await fetch(
          `https://vedas.sac.gov.in/mmi/eloc?eloc=${item.eLoc}`
        );
        const data = await response.json();

        this.addMarker(data.longitude, data.latitude);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    },
    async findAddress() {
      if (!this.searchQuery.trim()) return;
      try {
        const response = await fetch(
          `https://vedas.sac.gov.in/mmi/geocode?address=${this.searchQuery}`
        );
        const data = await response.json();

        this.addMarker(data.longitude, data.latitude);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    },
    addMarker(longitude, latitude) {
      if (!longitude || !latitude) return;
      if (!map) {
        console.error("Map is not initialized!");
        return;
      }

      if (!map.addVectorLayer) {
        map.addVectorLayer = new ol.layer.Vector({
          source: new ol.source.Vector({
            features: [
              new ol.Feature(
                new ol.geom.Point(
                  ol.proj.fromLonLat(
                    [parseFloat(longitude), parseFloat(latitude)],
                    projection
                  )
                )
              ),
            ],
          }),
          style: new ol.style.Style({
            image: new ol.style.Icon({
              anchor: [0.5, 46],
              anchorXUnits: "fraction",
              anchorYUnits: "pixels",
              src: "img/download.png",
            }),
          }),
        });
        map.addVectorLayer.setZIndex(99999);
        clipLayerIfRequired(map.addVectorLayer, clippingLayer);
        map.addLayer(map.addVectorLayer);
      }

      map
        .getView()
        .setCenter(
          ol.proj.transform(
            [parseFloat(longitude), parseFloat(latitude)],
            current_projection,
            projection
          )
        );
      map.getView().setZoom(12);
    },
    highlightMatch(text) {
      if (!this.searchQuery) return text;
      const regex = new RegExp(`(${this.searchQuery})`, "gi");
      return text.replace(regex, "<strong>$1</strong>");
    },

    findLocation: findLocation,
    async runToolAnalysis() {
      //set the toollayerconfig selectedTool
      if (
        this.selectedTool &&
        this.selectedTool.displayName === "Polygon-Inspect"
      ) {
        this.showShpFileInput = true;
      } else {
        this.showShpFileInput = false;
      }

      let configToolKeys = Object.keys(this.toolLayerConfig.tools);
      console.log(`27Feb in Run tool`, this.toolLayerConfig);
      for (let tool of configToolKeys) {
        if (this.toolLayerConfig.tools[tool]["id"] === this.selectedTool.id) {
          this.toolLayerConfig.tools[tool] = this.selectedTool;
        }
      }
      this.$forceUpdate();

      this.selectedTool.runTool(
        this.toolLayerConfig,
        this.selectedTool,
        map,
        this
      );
    },

    removeAllInteractions() {
      map.getInteractions().clear();
      map.addInteraction(new ol.interaction.MouseWheelZoom());
      map.addInteraction(new ol.interaction.DragPan());
    },
    async toggle_gear_bg(object) {
      console.log("aquisition started");
      layers = this.select_quaeryAll(
        ".layer-row .layer .material-symbols-outlined-arrow fab-action-arrow span-arrow"
      );
      console.log("this is toggled gear", layers);
    },

    toggleGrid() {
      this.gridVisible = !this.gridVisible;
      console.log("Grid visibility:", this.gridVisible);

      if (olc_vectorLayer) {
        olc_vectorLayer.setVisible(this.gridVisible);
        if (this.gridVisible) {
          this.updateGrid();
        }
      }
    },
    initGridLayer() {
      if (!map) {
        console.error("Map not initialized yet");
        return;
      }

      olc_vectorSource = new ol.source.Vector();

      this.cellStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(255,0,0,1)',
          width:2,
        }),
        fill :new ol.style.Fill({
          color:'rgba(255,0,0,0.5)'
        })  
      })

      // Create style function for label
      const createLabelStyle = (feature) => {
        let code = feature.get("code");
        // Remove trailing zeros and '+'
        // code = code.replace(/0+\++*$/, "");
        code = code.replace(/[0\+]+$/, "");


        if (code.length>3){
          code = code.slice(2);
        }

        // code = code.slice(2);

        let mainPart = "";
        let lastTwo = "";

        if (code.length > 2) {
          mainPart = code.slice(0, -2);
          lastTwo = code.slice(-2);
        } else {
          mainPart = code;
        }

        let formattedText = mainPart + (lastTwo ? "\n" + lastTwo : "");

        
        // if (formattedText.length%2===0 && formattedText.length>3){
        //   let gap = Math.round(formattedText.length/2)
        //   mainPart = code.slice(0,gap)
        //   let secondPart= code.slice(gap,formattedText.length)
        //   formattedText = mainPart + "\n" + secondPart ;
        // }else if (formattedText.length%2===1 && formattedText.length>3){
        //   let gap = formattedText.length/2
        //   mainPart = code.slice(0,Math.ceil(gap))
        //   let secondPart= code.slice(Math.floor(gap),formattedText.length)
        //   formattedText = mainPart + "\n" + secondPart ;
        // }
        let fontSize = 8;
        let constan = 0.8
        if (formattedText.length > 9){
          fontSize =formattedText.length * constan;
        }

        return new ol.style.Style({
          text: new ol.style.Text({
            text: formattedText,
            font: `bold ${fontSize}px monospace`,
            fill: new ol.style.Fill({ color: "red" }),
            stroke: new ol.style.Stroke({ color: "#fff", width: 3 }),
            overflow: true,
            maxWidth: 200,
          }),
          zIndex:9999
        });
      };

      olc_vectorLayer = new ol.layer.Vector({
        source: olc_vectorSource,
        zIndex: 999,
        renderBuffer: 50,
        visible: this.gridVisible,
        style: (feature) => {
          const type = feature.get("type");
          console.log("type issss", type, this.cellStyle);
          
          if (type === "cell") {
            console.log("got the cell stylke");
            
            return this.cellStyle;
          } else if (type === "label") {
            return createLabelStyle(feature);
          }
        },
      });
      

      // Add vector layer to existing map
      map.addLayer(olc_vectorLayer);

      // Register map events
      map.on("moveend", () => this.handleMoveEnd());
      // map.once("rendercomplete", () => {
      //   this.updateGrid();
      // });
    },

    updateGrid() {

      console.log("UPDATEGRID enter");

      if (!map || !olc_vectorSource || !this.gridVisible) return;

      const mapSize = map.getSize();
      if (!mapSize || mapSize[0] === 0 || mapSize[1] === 0) return;

      const proj = map.getView().getProjection();
      console.log("map projection isssss", proj);
      

      const view = map.getView();
      const currentZoom = view.getZoom();
      this.zoom = currentZoom.toFixed(1);

      // Get visible extent in geographic coordinates
      const extent = view.calculateExtent(mapSize);
      // const bottomLeft = ol.proj.transform(
      //   [extent[0], extent[1]],
      //   "EPSG:3857",
      //   "EPSG:4326"
      // );
      // const topRight = ol.proj.transform(
      //   [extent[2], extent[3]],
      //   "EPSG:3857",
      //   "EPSG:4326"
      // );

      // let minLon = bottomLeft[0];
      // let minLat = bottomLeft[1];
      // let maxLon = topRight[0];
      // let maxLat = topRight[1];
      let minLon = extent[0];
      let minLat = extent[1];
      let maxLon = extent[2];
      let maxLat = extent[3];

      // Calculate cell size to fill entire screen with fixed grid (9x9)
      const rows = this.gridRows;
      const cols = this.gridCols;
      const cellWidthDeg = (maxLon - minLon) / cols;
      const cellHeightDeg = (maxLat - minLat) / rows;

      minLon = minLon - cellWidthDeg;
      maxLon = maxLon + cellWidthDeg;
      minLat = minLat - cellHeightDeg;
      maxLat = maxLat + cellHeightDeg;

      this.cellSizeLon = cellWidthDeg;
      this.cellSizeLat = cellHeightDeg;

      this.generatedCodes = [];
      const newSource = new ol.source.Vector();
      const features = [];

      // Generate exactly rows x cols grid cells
      for (let row = -1; row < 2  * rows + 1; row++) {
        for (let col = -1; col < 2 * cols + 1; col++) {
          // Calculate cell bounds
          const lat1 = minLat + (row * cellHeightDeg) / 2;
          const lat2 = minLat + ((row + 1) * cellHeightDeg) / 2;
          const lon1 = minLon + (col * cellWidthDeg) / 2;
          const lon2 = minLon + ((col + 1) * cellWidthDeg) / 2;

          // Cell center
          const centerLat = (lat1 + lat2) / 2;
          const centerLon = (lon1 + lon2) / 2;

          // Validate coordinates
          if (
            centerLat < -90 ||
            centerLat > 90 ||
            centerLon < -180 ||
            centerLon > 180
          ) {
            continue;
          }

          try {
            // Determine code length based on cell width
            let maxCodeLength = 2;

            if (cellWidthDeg < 20) {
              maxCodeLength = 2;
            }
            if (cellWidthDeg < 1) {
              maxCodeLength = 4;
            }
            if (cellWidthDeg < 0.05) {
              maxCodeLength = 6;
            }
            if (cellWidthDeg < 0.0025) {
              maxCodeLength = 8;
            }
            if (cellWidthDeg < 0.000125) {
              maxCodeLength = 10;
            }
            if (cellWidthDeg < 0.000025) {
              maxCodeLength = 11;
            }

            this.codeLength = maxCodeLength;
            const code = OpenLocationCode.encode(
              centerLat,
              centerLon,
              maxCodeLength
            );

            // Skip if code already generated
            if (this.generatedCodes.includes(code)) {
              // console.log("UPDATEGRID cell already exists; row: "+row+" col: "+col);
              continue;
            }

            const area = OpenLocationCode.decode(code);

            // Create cell polygon
            const coords = [
              [area.longitudeLo, area.latitudeLo],
              [area.longitudeHi, area.latitudeLo],
              [area.longitudeHi, area.latitudeHi],
              [area.longitudeLo, area.latitudeHi],
              [area.longitudeLo, area.latitudeLo],
            ]

            const cellFeature = new ol.Feature({
              geometry: new ol.geom.Polygon([coords]),
              type: "cell",
            });

            // Create label feature
            const labelFeature = new ol.Feature({
              geometry: new ol.geom.Point([area.longitudeCenter, area.latitudeCenter]),
              type: "label",
              code: code,
              codeLength: maxCodeLength,
            });


            if (this.generatedCodes.includes(code)) {
              // console.log("UPDATEGRID cell added: "+code);
              continue;
            }




            features.push(cellFeature, labelFeature);
            
            
            this.generatedCodes.push(code);
          } catch (error) {
            console.warn("Error at row", row, "col", col, ":", error);
          }
        }
      }

      // Add all features
      if (features.length > 0) {
        newSource.addFeatures(features);
        olc_vectorLayer.setSource(newSource);
        olc_vectorSource = newSource;
      }
    },
    handleMoveEnd() {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(() => {
        this.updateGrid();
      }, 100);
    },

    searchPlusCode(){
      if (!this.searchCode) return;
      try{
        const area = OpenLocationCode.decode(this.searchCode.trim());
        const center = ol.proj.fromLonLat([area.longitudeCenter, area.latitudeCenter]);
        if (map && map.getView()){
          map.getView().setCenter(center);
          const codeLen = this.searchCode.trim().replace(/0+\+*$/, '').length;
          if (codeLen >-10){
            map.getView().setZoom(15);
          }
          else if(codeLen <-8){
            map.getView().setZoom(12);
          }
          else{
            map.getView().setZoom(6);
          }
          this.updateGrid();
        }
      }catch (e){
        alert('Invalid Plus Code')
      }
    },

    getPrevAndNextYear(param, op) {
      let selectedDate = param.selectedOption;
      let dateval = selectedDate.val;
      console.log(`Called prev year`, param, op, selectedDate, dateval);
      let [year, month, date] = getYearMonthDate(dateval);

      let nextYear = op == "+" ? parseInt(year) + 1 : parseInt(year) - 1;

      let newDateVal = nextYear + month + date;
      var newDate = {
        lbl: nextYear + "-" + month + "-" + date,
        val: newDateVal,
      };

      for (var i = 0; i < param.options.length; i++) {
        if (newDateVal == param.options[i].val) {
          param.selectedOption = newDate;
          break;
        }
      }
    },
    nextParamDate(param, layerParams) {
      let si = 0;
      let dates = param.options;
      let datesLength = dates.length;

      for (; si < datesLength; si++) {
        var cur_date = dates[si];
        if (cur_date.val == param.selectedOption.val) {
          break;
        }
      }

      if (si > 0) {
        si--;
        param.selectedOption = dates[si];
      }

      this.$forceUpdate();
    },
    prevParamDate(param, layerParams) {
      let si = 0;
      let dates = param.options;
      let datesLength = dates.length;
      for (; si < datesLength; si++) {
        var cur_date = dates[si];

        if (cur_date.val == param.selectedOption.val) {
          break;
        }
      }

      if (si < dates.length - 1) {
        si++;
        param.selectedOption = dates[si];
      }
      this.$forceUpdate();
    },
    nextYearParamDate(param) {
      this.getPrevAndNextYear(param, "+");
      this.$forceUpdate();
    },

    prevYearParamDate(param) {
      console.log(`Previous year called`);
      this.getPrevAndNextYear(param, "-");

      this.$forceUpdate();
    },
    changeDate(param, op) {
      let time = new Date(param.selectedOption.val).getTime();

      let newDate =
        op == "next" ? new Date(time + 86400000) : new Date(time - 86400000);
      newDate = newDate.toISOString().slice(0, 10);
      param.selectedOption = {
        lbl: newDate,
        val: newDate,
      };
      this.$forceUpdate();
    },

    swapLayers(val, id) {
      let arrayOfKeys = Object.keys(this.selectedLayerConfigToShow).map((x) =>
        parseInt(x)
      );
      let index = 0;
      if (val == "increase") {
        index = arrayOfKeys.findIndex((cur) => cur > id);
      } else if (val == "decrease") {
        index = arrayOfKeys.findIndex((cur) => cur == id) - 1;
      }

      if (index >= 0) {
        let swap_key = arrayOfKeys[index];
        let cur_key = id;
        let curLayerConfig = this.selectedLayerConfigToShow[cur_key];
        let swapLayerConfig = this.selectedLayerConfigToShow[swap_key];

        //set the z-index first
        curLayerConfig.zIndex = swap_key;
        swapLayerConfig.zIndex = cur_key;
        //set map z-index
        curLayerConfig.layer.setZIndex(swap_key);
        swapLayerConfig.layer.setZIndex(cur_key);
        this.selectedLayerConfigToShow[cur_key] = swapLayerConfig;
        this.selectedLayerConfigToShow[swap_key] = curLayerConfig;
      }

      this.$forceUpdate();
    },
    matches(obj) {
      const term = this.searchContent.toLowerCase();
      return obj.displayName.toLowerCase().includes(term);
    },
    renderMap() {
      map.render();
    },
    openSwipe() {
      let numberOfLayers = Object.keys(this.selectedLayerConfigToShow);

      if (window.innerWidth < 600) {
        this.isShowLayersPanel = false;
      }

      if (numberOfLayers.length < 1) {
        alert(
          "There should be atleast 1 layer for swipe. Please add more layers. If you want to compare the same dataset, please add 1 layers of same dataset."
        );
        return;
      }

      if (!this.swipeLayerConfigId) {
        let layerArr = Object.entries(this.selectedLayerConfigToShow);
        this.swipeLayerConfig = layerArr[1][1];
        this.swipeLayerConfigId = layerArr[1][0];
      } else {
        this.swipeLayerConfig =
          this.selectedLayerConfigToShow[this.swipeLayerConfigId];
      }

      if (swipeAttachedLayer) {
        swipeAttachedLayer.un("prerender", swipePrerenderFuntion);
        swipeAttachedLayer.un("postrender", swipePostrenderFunction);
        swipeAttachedLayer = null;
        map.render();
      }
      if (this.swipeLayerConfig.type != "imageWMS") {
        this.swipeLayerConfig = this.swapRasterLayers(this.swipeLayerConfig);
        this.swipeLayerConfigId = this.swipeLayerConfig.zIndex;
      }

      let layer = this.swipeLayerConfig.layer;

      layer.on("prerender", swipePrerenderFuntion);
      layer.on("postrender", swipePostrenderFunction);

      swipeAttachedLayer = layer;

      map.render();
      this.showSwipePanel = true;
    },
    swapRasterLayers(curLayerConfig) {
      let highestZIndex = this.findRasterHighestZIndex();
      let curZIndex = curLayerConfig.zIndex;

      let layerConfigToSwap = this.selectedLayerConfigToShow[highestZIndex];
      layerConfigToSwap.zIndex = curZIndex;

      curLayerConfig.zIndex = highestZIndex;

      this.selectedLayerConfigToShow[curZIndex] = layerConfigToSwap;
      this.selectedLayerConfigToShow[highestZIndex] = curLayerConfig;
      this.selectedLayerConfigToShow[curZIndex].layer.setZIndex(curZIndex);
      this.selectedLayerConfigToShow[highestZIndex].layer.setZIndex(
        highestZIndex
      );

      return this.selectedLayerConfigToShow[highestZIndex];
    },

    findRasterHighestZIndex() {
      let highestZIndex = 0;
      let keys = Object.keys(this.selectedLayerConfigToShow);
      highestZIndex = Math.max(...keys);
      return highestZIndex;
    },
    closeSwipe() {
      swipeAttachedLayer.un("prerender", swipePrerenderFuntion);
      swipeAttachedLayer.un("postrender", swipePostrenderFunction);
      swipeAttachedLayer = null;
      map.render();
      this.showSwipePanel = false;
    },
    toggleLocationSearch() {
      this.isLocationSearchVisible = !this.isLocationSearchVisible;
      if (this.isLocationSearchVisible) {
        this.isMyLocationVisible = false;
      }
    },

    // toggleToolbox(layer) {
    //   const isSameLayer = this.toolLayerConfig.displayName === layer.displayName;

    //   if (isSameLayer && this.showToolModal) {
    //     this.toolLayerConfig = {};
    //     this.showToolModal = false;
    //     this.isShowToolOutput = false;
    //   } else {
    //     this.toolLayerConfig = layer;
    //     this.showToolModal = true;
    //   }

    //   this.$nextTick(() => {
    //     this.updateGearButtonStyles();
    //   });
    // },
    toggleToolbox(layer) {
      if (this.toolLayerConfig.id != layer.id) {
        this.toolLayerConfig = layer;
        this.showToolModal = true;
        this.selectedTool =
          this.toolLayerConfig.tools[
            Object.keys(this.toolLayerConfig.tools)[0]
          ];
      } else {
        this.showToolModal = !this.showToolModal;
      }

      this.isShowToolOutput = this.isShowToolOutput && this.showToolModal;
    },

    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;

      setTimeout(() => {
        this.isPopupVisible = false;
      }, 2000);
    },
    clearSearch() {
      this.searchContent = "";
      this.filteredList = [];
    },

    toggleLayer(id) {
      let curObj = this.selectedLayerConfigToShow[id];

      //If removing layer id is same as toolConfigId then remove it to not display chart.
      if (this.toolLayerConfig.id == curObj.id && this.showToolModal) {
        this.showToolModal = false;
        this.loadChartMsg = "";
        this.toolLayerConfig =
          this.toolLayerConfig.id == curObj.id ? "" : this.toolLayerConfig;
        this.removeAllInteractions();
      }

      let layer = curObj.layer;
      if (curObj.isShow && layer) {
        clipLayerIfRequired(layer, clippingLayer);
        map.addLayer(layer);
      } else if (layer) {
        map.removeLayer(layer);
        //set swipe layer config if selected is not visible
        if (this.showSwipePanel) {
          let keys = Object.keys(this.selectedLayerConfigToShow);
          let keysLength = keys.length;
          for (let i = 0; i < keysLength; i++) {
            if (this.selectedLayerConfigToShow[keys[i]].isShow) {
              this.swipeLayerConfig = this.selectedLayerConfigToShow[keys[i]];
              this.swipeLayerConfigId = keys[i];
              this.openSwipe();
              break;
            }
          }
        }
      }

      this.$forceUpdate();
    },
    prepareStoryId() {
      //Generating story id
      let storyId = Math.round(new Date() / 1000);
      //Preapring custome string to share
      let customStringObj = this.prepareShareLink();
      let urlToPost = storyURL + storyId;

      fetch(urlToPost, {
        method: "POST",
        body: customStringObj,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }).then((response) => {
        this.isShowStoryModal = response.status == 200 ? true : false;
        let appId = getHashValue("appId");
        let curURL = window.location.href.split("#")[0];
        this.storyLink = `${curURL}#appId=${
          appId ? appId : ""
        }&storyId=${storyId}`;
      });
    },
    prepareShareLink() {
      let currentExtent = map.getView().calculateExtent(map.getSize());
      let customString = customStringify(
        {
          extent: currentExtent,
          layersConfigs: this.selectedLayerConfigToShow,
        },
        ["options", "layer", "styles", "STYLES"]
      );

      let customStringObj = "";
      if (this.showSwipePanel) {
        //Convert string to object
        customStringObj = JSON.parse(customString);

        customStringObj["swipe"] = this.swipeLayerConfigId;
        customString = JSON.stringify(customStringObj);
      }

      return customString;
    },
    setToollayer(newToolLayerConfig) {
      this.toolLayerConfig = newToolLayerConfig;
      console.log("Tool layer config in set tool layer", this.toolLayerConfig);
      this.selectedTool =
        this.toolLayerConfig.tools[Object.keys(this.toolLayerConfig.tools)[0]];
      setTimeout(() => {
        app.showToolModal = app.toolLayerConfig.autoActivateTool
          ? app.toolLayerConfig.autoActivateTool
          : false;
        if (app.showToolModal) {
          app.runToolAnalysis();
        }
      }, 2500);
    },
    async removeLayer(id) {
      let curLayerConfig = this.selectedLayerConfigToShow[id];
      let layerConfig = this.selectedLayerConfigToShow[id];
      let layerName = layerConfig ? layerConfig.displayName : "Unknown Layer";

      if (curLayerConfig.id == this.toolLayerConfig.id && this.showToolModal) {
        this.removeAllInteractions();
        this.showToolModal = false;
        // this.isShowToolOutput = false;
        // this.isShowToolOutput = false;
        this.loadChartMsg = "";
        this.removeAllInteractions();
      }
      let layerToRemove = this.selectedLayerConfigToShow[id].layer;
      map.removeLayer(layerToRemove);
      delete this.selectedLayerConfigToShow[id];
      let keys = Object.keys(this.selectedLayerConfigToShow)
        .map(Number) // Convert string keys to numbers
        .filter((k) => k < 99) // Ignore key 99 (99 is for Administrative Boundary (SOI: March 2025))
        .sort((a, b) => b - a); // Sort in descending order
      if (keys.length > 0) {
        let maxId = keys[0];
        // this.toolLayerConfig = this.selectedLayerConfigToShow[maxId.toString()];
        this.setToollayer(this.selectedLayerConfigToShow[maxId.toString()]);
      }
      this.$forceUpdate();
      this.showPopup(`Layer '${layerName}' is removed`);
    },

    async pushLayer(id, initialParameters, key, initialShow) {
      this.loading = true;
      this.showThemeCatalogue = false;
      //New id for each layer
      // console.log("Id is :",getLayerConfig(id))
      console.log("Id is :", id);
      let newId = "";
      let curLayerConfigObj = await getLayerConfig(id);

      let noOfLayers = Object.keys(this.selectedLayerConfigToShow).length;

      let highestZIndex = 0;
      let layerConfigArray = Object.entries(this.selectedLayerConfigToShow);

      if (key) {
        //when share a story
        newId = key;
      } else {
        if (noOfLayers == 0) {
          newId = curLayerConfigObj.baseIndex || 0;
        } else {
          if (curLayerConfigObj.baseIndex) {
            for (let [key, layerConfig] of layerConfigArray) {
              if (layerConfig.baseIndex == curLayerConfigObj.baseIndex) {
                if (layerConfig.zIndex > highestZIndex) {
                  highestZIndex = layerConfig.zIndex;
                }
              }
            }
          } else {
            for (let [key, layerConfig] of layerConfigArray) {
              if (
                !layerConfig.baseIndex &&
                layerConfig.zIndex > highestZIndex
              ) {
                highestZIndex = layerConfig.zIndex;
              }
            }
          }
          newId = ++highestZIndex;
        }
      }

      extent = initialExtent;
      if (curLayerConfigObj.layerFactoryParams.extent) {
        extent = curLayerConfigObj.layerFactoryParams.extent;
      }

      let newLayerConfig = this.updateDisplayName(curLayerConfigObj);

      this.selectedLayerConfigToShow[newId] = newLayerConfig;

      if (
        newLayerConfig.tools &&
        newLayerConfig.isShow &&
        !newLayerConfig.baseIndex
      ) {
        this.toolLayerConfig = newLayerConfig;
        this.setToollayer(newLayerConfig);
        this.showToolModal = true;

        this.$nextTick(() => {
          // this.updateGearButtonStyles();
        });
      }

      const sortable = Object.fromEntries(
        Object.entries(this.selectedLayerConfigToShow).sort(
          ([, a], [, b]) => b - a
        )
      );
      if (initialParameters) {
        newLayerConfig.parameters = mergeParameters(
          newLayerConfig.parameters,
          initialParameters
        );
        newLayerConfig.isShow = initialShow;
      }

      await this.updateLayerHelper(newId);
      // map.getView().fit(extent, map.getSize());
      this.$forceUpdate();
      let layerConfig = this.selectedLayerConfigToShow[newId];
      let layerName = layerConfig ? layerConfig.displayName : "Unknown layer";
      this.showPopup(`Layer '${layerName}' is added`);
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    closeModal() {
      if (!this.loading) {
        this.showThemeCatalogue = false;
      }
    },
    updateDisplayName(curLayerConfig) {
      let objValues = Object.values(this.selectedLayerConfigToShow);
      let nameCounter = 1;
      let mainString = curLayerConfig.displayName;
      let j = 0;
      let objValuesLength = objValues.length;
      for (let i = 0; i < objValuesLength; i++) {
        if (objValues[i].displayName == mainString) {
          objValues[i].displayName = mainString + "[" + nameCounter + "]";
          nameCounter++;
        }
      }
      if (nameCounter != 1)
        curLayerConfig.displayName = mainString + "[" + nameCounter + "]";
      return curLayerConfig;
    },
    async updateLayerHelper(id, param_key) {
      let curLayerConfig = this.selectedLayerConfigToShow[id];

      let parameters = curLayerConfig.parameters
        ? curLayerConfig.parameters
        : "";
      let curParam = parameters[param_key];

      //Get dependent val key

      if (curParam && curParam.dependentKey) {
        curParam.dependentKey.forEach((key) => {
          parameters[key].selectedOption = curParam.selectedOption.saturation;
        });
      }

      if (curLayerConfig.layer) {
        map.removeLayer(curLayerConfig.layer);
      }
      let layerInstance = "";

      switch (curLayerConfig.type) {
        case "WMTS":
          layerInstance = createWMTSLayerObj(curLayerConfig);
          break;
        case "XYZ":
          layerInstance = createXYZLayerObj(curLayerConfig);
          break;
        case "imageWMS":
          layerInstance = createImageWMSLayerObj(curLayerConfig);
          break;
        case "osm":
          layerInstance = createOSMLayerObj(curLayerConfig);
          break;
        default:
          console.log(
            "this is current selected layer default",
            curLayerConfig.replaceDictionary
          );
          layerInstance = createTileWMSLayerObj(curLayerConfig, map);

          if (curLayerConfig.id.includes("fire")) {
            curLayerConfig.legendUrl = getLegendUrlForFireEvent(
              curLayerConfig?.replaceDictionary?.operation
            );
          }

          break;
        // break;
      }
      if (layerInstance) {
        curLayerConfig.zIndex = id;

        layerInstance.setZIndex(id);
        curLayerConfig.layer = layerInstance;
        if (curLayerConfig.isShow) {
          const container = this.$refs.container;

          // Get current scroll offset from bottom
          const scrollFromBottom =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight;
          console.log(
            "scrollTop",
            container.scrollHeight,
            container.scrollTop,
            container.clientHeight
          );
          await map.addLayer(layerInstance);
          setTimeout(() => {
            console.log("Before scrollTop=0", container.scrollTop);
            container.scrollTop = -100000;
            console.log("After scrollTop=0", container.scrollTop);
          }, 50);
          clipLayerIfRequired(layerInstance, clippingLayer);
        }
      }

      if (this.showSwipePanel) {
        this.openSwipe();
      }

      //Show chart code
      // this.showChart(curLayerConfig)
      this.$forceUpdate();
    },

    getLocationSearch() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

            console.log("User Location:", latitude, longitude);

            this.myLat = latitude;
            this.myLon = longitude;
            this.isMyLocationVisible = true;
            this.isLocationSearchVisible = false;
            this.findLocation(`${latitude},${longitude}`);
          },

          this.$nextTick(() => {
            document.querySelector(".location-box")?.classList.add("visible");
          }),
          (error) => {
            console.error("Error getting location:", error);
            alert("Unable to fetch location. Please enable GPS and try again.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    },
    closeLocationBox() {
      this.isMyLocationVisible = false;
    },
    closeChart() {
      this.loadChartMsg = "";
      this.isShowToolOutput = false;
    },
  },
  watch: {
    showThemeCatalogue(newVal) {
      if (newVal) {
        this.searchContent = "";
        this.filteredList = [];
        this.isShowThemes = true;
      }
    },
  },

  computed: {
    listValues() {
      return Object.values(this.layers);
    },
    cellStyle() {
      return new ol.style.Style({
        stroke: new ol.style.Stroke({ color: "rgba(255, 0, 0, 1)", width: 0.5 }),
        fill: new ol.style.Fill({ color: "rgba(0, 0, 0, 0.0)" }),
      });
    },
    filteredList() {
      if (!this.searchContent) {
        return "";
      }
      return this.listValues
        .map((v) => {
          if (this.matches(v)) {
            return v;
          }
        })
        .filter((v) => v);
    },
  },
});

setInterval(function () {
  let element = document.getElementById("auto_resize");
  if (element) {
    element.style.height = "18px";
    element.style.height = element.scrollHeight + "px";
  }
}, 1000);

function getHashValue(paramName) {
  // Get the URL hash
  let hash = window.location.hash.substring(1);

  // Split the hash into an array of key-value pairs
  let params = hash.split("&");
  let paramsLength = params.length;
  // Iterate through the key-value pairs to find the parameter value
  for (let i = 0; i < paramsLength; i++) {
    let pair = params[i].split("=");
    if (pair[0] === paramName) {
      // Return the value if the parameter name matches
      return pair[1];
    }
  }

  // Return null if the parameter name is not found
  return null;
}

// 14 Jul 2025 : draggable toolbox

dragElement(document.getElementById("toolModal"));

function dragElement(elmnt) {
  const header = document.getElementById(elmnt.id + "Header");
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  // element.onmousedown = dragMouseDown;
  if (header) {
    // If present, the header is where you move the DIV from
    header.onmousedown = dragMouseDown;
  } else {
    // Otherwise, move the DIV from anywhere inside it
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // Get mouse cursor position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // Calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Set the element's new position
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // Stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// 14 Jul 2025 : draggable toolbox
