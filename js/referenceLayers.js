export let referenceLayers = {
  cities_town: {
    id: "cities_town",
    displayName: "Cities/Towns",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      layerParams: {
        LAYERS: "vedas:INDIA_CITYTOWN",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  village_boundary: {
    id: "village_boundary",
    displayName: "Village Boundary",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas81/wms",
      layerParams: {
        LAYERS: "vedas81:gujarat_village_boundary",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  taluka_boundary: {
    id: "taluka_boundary",
    displayName: "Taluka Boundary",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      layerParams: {
        LAYERS: "vedas:INDIA_TALUK_BOUNDARY",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  district_boundary: {
    displayName: "District Boundary",
    id: "district_boundary",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      layerParams: {
        LAYERS: "vedas:INDIA_DISTRICT_BOUNDARY",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  up_dist_boundary: {
    displayName: "Uttarpradesh 28 Districts",
    id: "up_dist_boundary",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas_gis/wms",
      layerParams: {
        LAYERS: "vedas_gis:up_28_district_boundary_groundnut",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  
  indian_state_boundary: {
    displayName: "India State Boundary",
    id: "indian_state_boundary",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/drought_monitoring_wms/wms",
      layerParams: {
        LAYERS: "cite:india_state",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  base_map_map_my_india_hybrid: {
    displayName: "Base Map (MapMyIndia)",
    id: "base_map_map_my_india_hybrid",
    isShow: true,
    type: "osm",
    layerFactoryParams: {
      urlTemplate:
        "https://mt{0-5}.mapmyindia.com/advancedmaps/v1/nwsgvbqbbw5ejwj112vvisgoggiq4ov3/base_hybrid/{z}/{x}/{y}.png",

      transiotion: 0,
      layerParams: {
        LAYERS: "",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },

  base_map_map_my_india_hybrid_label: {
    displayName: "Base Map (MapMyIndia-Label)",
    id: "base_map_map_my_india_hybrid_label",
    isShow: true,
    type: "osm",
    layerFactoryParams: {
      urlTemplate:
        "https://mt{0-5}.mapmyindia.com/advancedmaps/v1/nwsgvbqbbw5ejwj112vvisgoggiq4ov3/hybrid_label/{z}/{x}/{y}.png",

      transiotion: 0,
      layerParams: {
        LAYERS: "",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },

  countries: {
    displayName: "Countries",
    id: "countries",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      layerParams: {
        LAYERS: "vedas:country",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  national_highway: {
    displayName: "National Highway",
    id: "national_highway",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      layerParams: {
        LAYERS: "vedas:INDIA_NHROADS",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  railway_tracks: {
    displayName: "Railway Tracks",
    id: "railway_tracks",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      layerParams: {
        LAYERS: "vedas:INDIA_RLWY_TRACKS",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  railway_stations: {
    displayName: "Railway Stations",
    id: "railway_stations",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      layerParams: {
        LAYERS: "vedas:INDIA_RLWY_STATIONS",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  Gujarat_cadastral: {
    displayName: "Gujarat Cadastral Boundary",
    id: "Gujarat_cadastral",
    isShow: true,
    type: "TileWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas_forecast/wms",
      layerParams: {
        LAYERS: "vedas_forecast:guj_cadastral_combined",
        VERSION:  "1.1.0",
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  GlacierSnout: {
    displayName: "Glacier Snout (1:50K) [(Jun-Sep)(2004-07)]",
    id: "GlacierSnout",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      layerParams: {
        LAYERS: "vedas:INDIA_50KGLACIERSNOUT2004_07",
        VERSION:  "1.1.1",
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  GlacierOutline: {
    displayName: "Glacier Outline (1:50K) [(Jun-Sep)(2004-07)]",
    id: "GlacierOutline",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      layerParams: {
        LAYERS: "vedas:INDIA_50KGLACIEROUTLINE2004_07",
        VERSION:  "1.1.1",
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  GlacierSubbasins: {
    displayName: "Glacier Subbasins (1:50K) [2004-07]",
    id: "GlacierSubbasins",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      layerParams: {
        LAYERS: "vedas:INDIA_50KGLACIERSUBBASIN2004_07",
        VERSION:  "1.1.1",
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  GlacierChange15_18: {
    displayName: "Glacier Change (2015-2018)",
    id: "GlacierChange15_18",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver2/vedas/wms",
      layerParams: {
        LAYERS: "vedas:Glacier_2015-18",
        VERSION:  "1.1.1",
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  GlacierChange00_03: {
    displayName: "Glacier Change (2000-2003)",
    id: "GlacierChange00_03",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver2/vedas/wms",
      layerParams: {
        LAYERS: "vedas:Glacier_2000-03",
        VERSION:  "1.1.1",
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  GlacierMorphology: {
    displayName: "Glacier Morphology (1:50K) [(Jun-Sep)(2004-07)]",
    id: "GlacierMorphology",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      layerParams: {
        LAYERS: "vedas:INDIA_50KGLACIERMORPHOLOGY2004_07",
        VERSION:  "1.1.1",
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  GlacierLakes: {
    displayName: "Glacier Lakes (1:50K) [(Jun-Sep)(2004-07)]",
    id: "GlacierLakes",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      layerParams: {
        LAYERS: "vedas:INDIA_50KGLACIERLAKES2004_07",
        VERSION:  "1.1.1",
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  // modis_fire: {
  //   displayName: "MODIS / Aqua and Terra (D & N)",
  //   id: "modis_fire",
  //   isShow: true,
  //   type: "imageWMS",
  //   layerFactoryParams: {
  //     urlTemplate: "https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/b915bf08d9f04da99cfdd8b3db5f4754/?symbols=circle&colors=255+50+0&size=6",
  //     layerParams: {
  //       LAYERS: "fires_modis",
  //       VERSION:  "1.1.1",
  //     },
  //     format: "png",
  //   },
  //   layer: "",
  //   zIndex: 0,
  //   baseIndex: 0,
  // },
  // npp_fire: {
  //   displayName: "	Suomi NPP / VIIRS (D & N)  ",
  //   id: "npp_fire",
  //   isShow: true,
  //   type: "imageWMS",
  //   layerFactoryParams: {
  //     urlTemplate: "https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/b915bf08d9f04da99cfdd8b3db5f4754/?symbols=circle&colors=255+50+0&size=6",
  //     layerParams: {
  //       LAYERS: "fires_viirs_snpp",
  //       VERSION:  "1.1.1",
  //     },
  //     format: "png",
  //   },
  //   layer: "",
  //   zIndex: 0,
  //   baseIndex: 0,
  // },
  /* 
     ladakh_layer:new ol.layer.Image({
        source: new ol.source.ImageWMS({
            projection: prjString,
            url: "https://vedas.sac.gov.in/lama_wms/wms?",
            params: { LAYERS: 'lama:bihar_boundary', VERSION: "1.1.1" },
            serverType: "geoserver",
            crossOrigin: null,
        }),
        visible: true
    }),
    */
  bodhi_bihar_admin: {
      displayName: "Bihar Admin Boundary",
      id: "bodhi_bihar_admin",
      isShow: true,
      type: "imageWMS",
      layerFactoryParams: {
        urlTemplate: "https://vedas.sac.gov.in/lama_wms/wms",
        layerParams: {
          LAYERS: "lama:bihar_boundary",
          VERSION: "1.1.1",
        }
      },
      layer: "",
      zIndex: 0,
      baseIndex: 0,
  },
  airports: {
    displayName: "Airports",
    id: "airports",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      layerParams: {
        LAYERS: "vedas:INDIA_AIRPORTS",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  administrative_boundary_bhuvan: {
    displayName: "Administrative Boundary from Bhuvan",
    id: "administrative_boundary_bhuvan",
    isShow: true,
    type: "tile",
    layerFactoryParams: {
      urlTemplate: "https://bhuvan-vec1.nrsc.gov.in/bhuvan/gwc/service/wms",
      layerParams: {
        LAYERS: "basemap:admin_group",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
  administrative_boundary_soi: {
    displayName: "Administrative Boundary (SOI: March 2025)",
    id: "administrative_boundary_soi",
    isShow: true,
    type: "WMTS",
    layerFactoryParams: {
      urlTemplate: 'https://vedas.sac.gov.in/geoserver/admin_gwc/service/wmts',
      layerParams: {
        LAYERS: "vedas_gis:india_admin_boundary_grp_07032025",
        VERSION: version,
        tileSize: [256, 256],
        extent: [-180.0, -90.0, 180.0, 90.0],
        origin: [-180.0, 90.0],
        resolutions: resolutions,
        matrixIds: matrixIds,
        format: "image/png",
        units: "degrees",
        axisOrientation: "neu",
      },
    },
    layer: "",
    zIndex: 0,
    baseIndex: 99,
    is_admin_boundary: true,
  },

  indian_admin_boudary_niti: {
    displayName: "India Administrative boundary Group [NITI Aayog]",
    id: "indian_admin_boudary_niti",
    isShow: true,
    type: "WMTS",
    layerFactoryParams: {
      urlTemplate: 'https://vedas.sac.gov.in/geoserver/admin_gwc/service/wmts',
      layerParams: {
        LAYERS: "vedas_gis:india_admin_boundary_grp_07032025_niti",
        VERSION: version,
        tileSize: [256, 256],
        extent: [-180.0, -90.0, 180.0, 90.0],
        origin: [-180.0, 90.0],
        resolutions: resolutions,
        matrixIds: matrixIds,
        format: "image/png",
        units: "degrees",
        axisOrientation: "neu",
      },
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
    is_admin_boundary: true,
  },

  greenland: {
    displayName: "Greenland Boundary",
    id: "greenland",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/gserver/arctic/wms",
      layerParams: {
        LAYERS: "arctic_boundary:GRL_adm0_3413",
        VERSION:  "1.1.1",
        STYLES:"antarctic_boundary"
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },

  high_resolution_imagery_bhuvan: {
    displayName: "High Resolution Imagery (Bhuvan)",
    id: "high_resolution_imagery_bhuvan",
    isShow: true,
    type: "tile",
    layerFactoryParams: {
      urlTemplate: "https://tile1.nrsc.gov.in/tilecache/tilecache.py?",
      layerParams: {
        LAYERS: "bhuvan_imagery",
        VERSION: version,
      },
      format: "jpeg",
    },
    layer: "",
    zIndex: 0,
  },

  cold_storage: {
    id: "cold_storage",
    displayName: "Cold Storage",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/ipcm/wms",
      layerParams: {
        LAYERS: "ipcm:cold_storage",
        VERSION: version,
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },

  dem: {
    id: "dem",
    displayName: "Digital Elevation Model (DEM)",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      layerParams: {
        LAYERS: "vedas:VEDAS_GTOPO_DEM",
        VERSION: "1.1.1",
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },

  Wetland_boundary: {
    id: "Wetland_boundary",
    displayName: "Wetland Boundary",
    isShow: true,
    type: "imageWMS",
    layerFactoryParams: {
      urlTemplate: "https://vedas.sac.gov.in/wetland_wms/wms",
      layerParams: {
        LAYERS: "wetlandinfo:Wetland",
        VERSION: "1.1.1",
      },
      format: "png",
    },
    layer: "",
    zIndex: 0,
    baseIndex: 0,
  },
};
