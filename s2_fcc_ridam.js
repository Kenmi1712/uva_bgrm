let layer = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    projection: "EPSG:4326",
    url: "https://vedas.sac.gov.in/ridam_server3/wms", //If not given url in layerConfig take default one.
    params: {
      name: "RDSGrdient",
      layers: "T0S0M0",
      PROJECTION: "EPSG:4326",
      ARGS: "merge_method:max;dataset_id:T3S1P1;from_time:{{{fromDate}}};to_time:{{{toDate}}};indexes:1",
      STYLES:
        "[0:FFFFFF00:1:f0ebecFF:25:d8c4b6FF:50:ab8a75FF:75:917732FF:100:70ab06FF:125:459200FF:150:267b01FF:175:0a6701FF:200:004800FF:251:001901FF;nodata:FFFFFF00]",
      LEGEND_OPTIONS: "columnHeight:400;height:100",
    },
  }),
  opacity: 1,
  zIndex: 1,
});
