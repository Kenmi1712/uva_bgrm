import { layers } from "./layers_config.js";
export let layerThemes_arctic = {
    visualization: {
        icon: "",
        // name: "Visualization",
        name: "Satellite Data Visualization",
        description: "",
        backgroundImg: "./assets/img/background/visualization.jpg",
        subtheme: {
          optical: {
            id: "optical",
            displayName: "Polar Science",
            icon: "",
            isShowSubtheme: false,
            layers: {
              
              sea_ice_concentrate: layers["sea_ice_concentrate"],
              arctic_land: layers["arctic_land"],
              arctic_ice: layers["arctic_ice"],
              greenland: layers["greenland"],
              greenland_ice: layers["greenland_ice"],

              

              
                
            },}}},
          //   referenceLayers: {
          //     icon: "",
          //     name: "Reference Layers",
          //     description: "",
          //     backgroundImg: "./assets/img/background/reference.jpg",
          
          //     subtheme: {
          //       administrative: {
          //         id: "administrative",
          //         displayName: "Administrative",
          //         icon: "",
          //         isShowSubtheme: false,
          //         layers: {
          //           greenland: layers["greenland"],
               
          //       }}
          //   },
          // }
        }