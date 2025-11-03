import { layers } from "./layers_config.js";
export let layerThemes = {
  visualization: {
    icon: "",
    // name: "Visualization",
    name: "Satellite Data Visualization",
    description: "",
    backgroundImg: "./assets/img/background/visualization.jpg",
    subtheme: {
      optical: {
        id: "optical",
        displayName: "Optical Data",
        icon: "",
        isShowSubtheme: false,
        layers: {
          // awifs_fcc: layers["awifs_fcc"],
          awifs_ncc: layers["awifs_ncc"],
          awifs_fcc_ridam: layers["awifs_fcc_ridam"],
          LISS4_fcc_ridam: layers["LISS4_fcc_ridam"],
          insat_visible_1km: layers["insat_visible_1km"],
          insat_thermal_4km: layers["insat_thermal_4km"],
          // sentinel_2_fcc_10m: layers["sentinel_2_fcc_10m"],
          modis_tcc_250m: layers["modis_tcc_250m"],
          // sentinel: layers["sentinel"],
          // sentinel_rgb: layers["sentinel_rgb"],
          sentinel_2_ncc_ridam: layers["sentinel_2_ncc_ridam"],
          sentinel_2_fcc_ridam: layers["sentinel_2_fcc_ridam"],
          sentinel_2_tcc_ridam: layers["sentinel_2_tcc_ridam"],
          s2_TCC_Cloud_Free:layers["s2_TCC_Cloud_Free"],
          insat_visible_ridam:layers["insat_visible_ridam"]
        },
      },
      microwave: {
        id: "microwave",
        isShowSubtheme: false,
        displayName: "Microwave (Radar) Data",
        icon: "",
        layers: {
          sentinel_1_10m: layers["sentinel_1_10m"],
          sentinel_1_10m_ridam:layers["sentinel_1_10m_ridam"]
        },
      },
      Cloud_masked: {
        id: "Cloud_masked",
        displayName: "Cloud Mask",
        icon: "",
        isShowSubtheme: false,
        layers: {
          // ndvi: layers["ndvi"],
          Cloud_masked: layers["Cloud_masked"],
          


        },
      },
    },
  },
  vegetation: {
    icon: "",
    name: "Vegetation Monitoring",
    description: "",
    backgroundImg: "./assets/img/background/visualization.jpg",

    subtheme: {
      vegetation_indices: {
        id: "vegetation_indices",
        displayName: "Vegetation Indices",
        icon: "",
        isShowSubtheme: false,
        layers: {
          
          ndvi_5d: layers["ndvi_5d"],
          ndvi_cropmask: layers["ndvi_cropmask"],

          
          ndvi_5d_village_level: layers["ndvi_5d_village_level"],
          // modis_ndvi_village_level: layers["modis_ndvi_village_level"],
          // modis_ndvi_tehsil_level: layers["modis_ndvi_tehsil_level"],
          modis_ndvi_district_level: layers["modis_ndvi_district_level"],
          ndvi_scene_classification:layers["ndvi_scene_classification"],
          sentinel2_construction_activity_index:layers["sentinel2_construction_activity_index"],
          sentinel2_ndvi_season_composite:
            layers["sentinel2_ndvi_season_composite"],
          MODIS_NDVI_II4: layers["MODIS_NDVI_II4"],
          MODIS_NDVI: layers["MODIS_NDVI"],
          MODIS_NDVI_IF1: layers["MODIS_NDVI_IF1"],
          MODIS_NDVI_FORCASTED:layers["MODIS_NDVI_FORCASTED"],
          ndmi: layers["ndmi"],
          ndmi_cmask:layers["ndmi_cmask"],
          ndsi_cmask: layers["ndsi_cmask"],
          Awifs_ndvi: layers["Awifs_ndvi"],
        },
      
      },
      evapo_transpiration: {
        id: "evapo_transpiration",
        displayName: "Evapo Transpiration",
        icon: "",
        isShowSubtheme: false,
        layers: {
          
          pet_insat: layers["pet_insat"],
          pet_insat_normal: layers["pet_insat_normal"],

        },
      },

      Crop_Mask: {
        id: "Crop_Mask",
        displayName: "Crop Mask",
        icon: "",
        isShowSubtheme: false,
        layers: {
          // ndvi: layers["ndvi"],
          Potato_mask: layers["Potato_mask"],
          onion_mask: layers["onion_mask"],
        },
      },
      
      spire_soil_moisture: {
        id: "spire_soil_moisture",
        displayName: "Soil Moisture",
        icon: "",
        isShowSubtheme: false,
        layers: {
          // ndvi: layers["ndvi"],
          spire_sm_1d: layers["spire_sm_1d"],
          soil_moisture_eos4: layers["soil_moisture_eos4"]


        },
      },


      
      analysis_tools: {
        id: "analysis_tools",
        displayName: "Analysis Tools",
        icon: "",
        isShowSubtheme: false,
        layers: {
          sentinel2_ndvi_rgb: layers["sentinel2_ndvi_rgb"],
          sentinel2_ndvi_difference: layers["sentinel2_ndvi_difference"],

          sentinel2_ndvi_season_composite_difference: layers["sentinel2_ndvi_season_composite_difference"],
          
          Range_analysis: layers["Range_analysis"],
          spire_sm_1d_difference: layers["spire_sm_1d_difference"]

        },
      },
    },
  },

  
  Environment: {
    icon: "",
    name: "Environment",
    description: "",
    backgroundImg: "./assets/img/background/visualization.jpg",

    subtheme: {
      
      Burn: {
        id: "Burn_indices",
        displayName: "Burnt Area Indices",
        icon: "",
        isShowSubtheme: false,
        layers: {
          bais_2: layers["bais_2"],
          nbr: layers["nbr"],
        },
      },
      Airqulity: {
        id: "Airqulity",
        displayName: "Air Quality",
        icon: "",
        isShowSubtheme: false,
        layers: {
          AOD_OCM: layers["AOD_OCM"],
          AOD_insat: layers["AOD_insat"],
          AOD_MODIS_pm: layers["AOD_MODIS_pm"],
          Aerosol_Index: layers["Aerosol_Index"],
          Tropospheric_CO: layers["Tropospheric_CO"],
          Tropospheric_HCHO: layers["Tropospheric_HCHO"],
          Tropospheric_NO2: layers["Tropospheric_NO2"],
          Tropospheric_O3: layers["Tropospheric_O3"],
          Tropospheric_SO2: layers["Tropospheric_SO2"],
          rh_forecast: layers["rh_forecast"],
          


          
        },
        getLayerInfoUrl(layerId) {
          const infoUrls = {
            Tropospheric_CO: "https://vedas.sac.gov.in/uva/assets/pdf/params/Total_Column_CO.pdf",
            Tropospheric_HCHO: "https://vedas.sac.gov.in/uva/assets/pdf/params/Tropospheric_HCHO.pdf",
            Tropospheric_NO2: "https://vedas.sac.gov.in/uva/assets/pdf/params/Tropospheric_NO2.pdf",
            Tropospheric_O3: "https://vedas.sac.gov.in/uva/assets/pdf/params/Total_Column_O3.pdf",
            Tropospheric_SO2: "https://vedas.sac.gov.in/uva/assets/pdf/params/Total_Column_SO2.pdf",
            Aerosol_Index: "https://vedas.sac.gov.in/uva/assets/pdf/params/Aerosol_Index.pdf"
          };
          return infoUrls[layerId] || null;
        }
      },

      snow_glacier : {
        id: "snow_glacier",
        displayName: "Snow Glacier ",
        icon: "",
        isShowSubtheme: false,
        layers: {
          snow_ai: layers["snow_ai"],
          snow_ai_water_mask: layers["snow_ai_water_mask"],
          GlacierChange15_18: layers["GlacierChange15_18"],
          GlacierChange00_03: layers["GlacierChange00_03"],
          GlacierMorphology: layers["GlacierMorphology"],
          GlacierLakes: layers["GlacierLakes"],
          GlacierSnout: layers["GlacierSnout"],
          GlacierOutline: layers["GlacierOutline"],
          GlacierSubbasins: layers["GlacierSubbasins"],

          


      
          // max_temp_imd: layers["max_temp_imd"],
        },
      },
      environment: {
        id: "environment",
        displayName: "Floating Debris Index (FDI)",
        icon: "",
        isShowSubtheme: false,
        layers: {
          s2_fdi: layers["s2_fdi"],
          
          

        },
      },

      fire_event: {
        id: "fire_event",
        displayName: "Active Fire Indices",
        icon: "",
        isShowSubtheme: false,
        layers: {
          fire_tehsil_level: layers["fire_tehsil_level"],
          fire_district_level: layers["fire_district_level"],
          fire_state_level: layers["fire_state_level"]

          

    
    
        },
        getLayerInfoUrl(layerId) {
          const infoUrls = {
            fire_tehsil_level: "https://vedas.sac.gov.in/uva/assets/pdf/params/VEDAS_VIIRS_ACTIVE_FIRE_INFO.pdf",
            fire_district_level: "https://vedas.sac.gov.in/uva/assets/pdf/params/VEDAS_VIIRS_ACTIVE_FIRE_INFO.pdf",
            fire_state_level: "https://vedas.sac.gov.in/uva/assets/pdf/params/VEDAS_VIIRS_ACTIVE_FIRE_INFO.pdf",
          };
          return infoUrls[layerId] || null;
        }
      },
    },
  },


  // Burn_indices: {
  //   icon: "",
  //   name: "Burn",
  //   description: "",
  //   backgroundImg: "./assets/img/background/visualization.jpg",

  //   subtheme: {
  //     Burn: {
  //       id: "Burn_indices",
  //       displayName: "Burn Indices",
  //       icon: "",
  //       isShowSubtheme: false,
  //       layers: {
        
  //         bais_2: layers["bais_2"],
  //         nbr: layers["nbr"],
    
    
  //       },
  //     },
  //   },
  // },

  cryosphere: {
    icon: "",
    name: "Cryosphere",
    description: "",
    backgroundImg: "./assets/img/background/visualization.jpg",

    subtheme: {
      ndsi: {
        id: "ndsi",
        displayName: "Normalised Difference Snow Index (NDSI)",
        icon: "",
        isShowSubtheme: false,
        layers: {
          awifs_ndsi: layers["awifs_ndsi"],
          sentinel_2_ndsi: layers["sentinel_2_ndsi"],
        },
      },
    },
  },

  general_indices: {
    icon: "",
    name: "General Indices",
    description: "",
    backgroundImg: "./assets/img/background/visualization.jpg",

    subtheme: {
      nd: {
        id: "",
        displayName: "Normalized Difference",
        icon: "",
        isShowSubtheme: false,
        layers: {
          awifs_normalized_difference: layers["awifs_normalized_difference"],
          sentinel_2_normalized_difference:
          layers["sentinel_2_normalized_difference"],
        },
      },
    },
  },

  Hydrology: {
    icon: "",
    name: "Hydrology",
    description: "",
    backgroundImg: "./assets/img/background/visualization.jpg",

    subtheme: {
      swot_surface_water_elevation: {
        id: "swot_surface_water_elevation",
        displayName: "SWOT Surface Water Elevation",
        icon: "",
        isShowSubtheme: false,
        layers: {
          // ndvi: layers["ndvi"],
          swot_surface_water_elevation: layers["swot_surface_water_elevation"],
          // swot_surface_water_elevation_umask: layers["swot_surface_water_elevation_umask"],
        }
      },
      sar_water_mask: {
        id: "sar_water_mask",
        displayName: "Water Mask",
        icon: "",
        isShowSubtheme: false,
        layers: {
       
          sar_water_mask: layers["sar_water_mask"],
       
        }
      },

    }
  
  },

    // lighting_Probability_panel: {
    //   icon: "",
    //   name: "Lighting",
    //   description: "",
    //   backgroundImg: "./assets/img/background/visualization.jpg",
  
    //   subtheme: {
   
    //   },
    // },

    meteorology: {
      icon: "",
      name: "Meteorology",
      description: "",
      backgroundImg: "./assets/img/background/visualization.jpg",
      subtheme: {
        temperature: {
          id: "temperature",
          displayName: "Air Temperature",
          icon: "",
          isShowSubtheme: false,
          layers: {
            min_temp_imd: layers["min_temp_imd"],
            max_temp_imd: layers["max_temp_imd"],
          },
        },
        environment: {
          id: "environment",
          displayName: "Thunderstorms Probability",
          icon: "",
          isShowSubtheme: false,
          layers: {
            lighting_Probability_panel: layers["lighting_Probability_panel"],
            lighting_Probability_tehsil_level: layers["lighting_Probability_tehsil_level"],
            lighting_Probability_district_level: layers["lighting_Probability_district_level"],


            
            
  
          },
        },
        solar_forecast: {
          id: "solar_forecast",
          displayName: "Solar Forecast",
          icon: "",
          isShowSubtheme: false,
          layers: {
            insolation_forecast: layers["insolation_forecast"],
            
            
  
          },
        },
   
      },
    },

    // oceanography: {
    //   icon: "",
    //   name: "Oceanography",
    //   description: "",
    //   backgroundImg: "./assets/img/background/visualization.jpg",
  
    //   subtheme: {
    //     environment: {
    //       id: "environment",
    //       displayName: "Environment",
    //       icon: "",
    //       isShowSubtheme: false,
    //       layers: {
    //         s2_fdi: layers["s2_fdi"],
            
            
  
    //       },
    //     },
    //   },
    // },

    referenceLayers: {
      icon: "",
      name: "Reference Layers",
      description: "",
      backgroundImg: "./assets/img/background/reference.jpg",
  
      subtheme: {
        administrative: {
          id: "administrative",
          displayName: "Administrative",
          icon: "",
          isShowSubtheme: false,
          layers: {
            cities_town: layers["cities_town"],
            village_boundary: layers["village_boundary"],
            taluka_boundary: layers["taluka_boundary"],
            district_boundary: layers["district_boundary"],
            up_dist_boundary: layers["up_dist_boundary"],
            indian_state_boundary: layers["indian_state_boundary"],
            base_map_map_my_india_hybrid: layers["base_map_map_my_india_hybrid"],
            base_map_map_my_india_hybrid_label:
            layers["base_map_map_my_india_hybrid_label"],
            administrative_boundary_bhuvan:
            layers["administrative_boundary_bhuvan"],
            indian_admin_boudary_niti:layers["indian_admin_boudary_niti"],
            administrative_boundary_soi: layers["administrative_boundary_soi"],
            countries: layers["countries"],
            Gujarat_cadastral: layers["Gujarat_cadastral"],
             himachal_anganwadi: layers["himachal_anganwadi"],
              chhatti_police_station: layers["chhatti_police_station"],
            

          },
        },
        infrastructure: {
          id: "infrastructure",
          displayName: "Infrastructure",
          icon: "",
          isShowSubtheme: false,
          layers: {
            national_highway: layers["national_highway"],
            railway_tracks: layers["railway_tracks"],
            railway_stations: layers["railway_stations"],
            airports: layers["airports"],
          },
        },
        imagery: {
          id: "imagery",
          displayName: "Imagery",
          icon: "",
          isShowSubtheme: false,
          layers: {
            high_resolution_imagery_bhuvan:
            layers["high_resolution_imagery_bhuvan"],
          },
        },
        lulc: {
          id: "lulc",
          displayName: "Land Use / Land Cover",
          icon: "",
          isShowSubtheme: false,
          layers: {
            sisdp_10k_lulc_2016_19: layers["sisdp_10k_lulc_2016_19"],
            sisdp_10k_lulc_2016_19l2:layers["sisdp_10k_lulc_2016_19l2"],
            sisdp_10k_lulc_2016_19l1:layers["sisdp_10k_lulc_2016_19l1"]
           
          },
        },
  
        Others: {
          id: "Others",
          displayName: "Others",
          icon: "",
          isShowSubtheme: false,
          layers: {
            cold_storage: layers["cold_storage"],
            dem: layers["dem"],
            Wetland_boundary: layers["Wetland_boundary"],
            
           
          },
        },
      },
    },

    

  

 
};
