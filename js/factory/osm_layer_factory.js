export const createOSMLayerObj = (layerConfig) => {
  //Local variables declaration

  let obj = getURLAndParams(layerConfig);

  //Layer object instance
  let layer = new ol.layer.Tile({
    source: new ol.source.OSM({
      url: obj.url,
      crossOrigin: crossOrigin,
      transition: obj.transition,
    }),
    opacity: obj.params.opacity ? obj.params.opacity : 1,
  });
  return layer;
};

// var layermmi = new ol.layer.Tile({
//     preload: 1 / 0,
//     // visible:!1,

//     source: new ol.source.OSM({
//       // url:"https://mt{0-5}.mapmyindia.com/advancedmaps/v1/fxzaixycf9xwq31yukwgtoa1iws8szyj/base_hybrid/{z}/{x}/{y}.png",
//       url: "https://mt{0-5}.mapmyindia.com/advancedmaps/v1/nwsgvbqbbw5ejwj112vvisgoggiq4ov3/base_hybrid/{z}/{x}/{y}.png",
//       transition: 0,
//     }),
//     visible: false,
//     opacity: 1,
//   });
