let layer = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    projection: "EPSG:4326",
    url: "https://vedas.sac.gov.in/ridam_server/wms", //If not given url in layerConfig take default one.
    params: {
      name: "RIDAM_RGB",
      layers: "T0S0M1",
      PROJECTION: "EPSG:4326",
      ARGS: "r_dataset_id:T0S1P0;g_dataset_id:T0S1P0;b_dataset_id:T0S1P0;r_from_time:20240507;r_to_time:20240507;g_from_time:20240507;g_to_time:20240507;b_from_time:20240507;b_to_time:20240507;r_index:8;g_index:4;b_index:3;r_max:6000;g_max:4000;b_max:4000",
      
      
    },
  }),
  opacity: 1,
  zIndex: 1,
  serverType: "geoserver",
  crossOrigin: "anonymous",
});
