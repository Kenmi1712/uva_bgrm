import { clipLayerIfRequired } from "../app.js";

export const createTileWMSLayerObj = (layerConfig, map) => {
  let obj = getURLAndParams(layerConfig);

  let layer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      projection: layerConfig.layerFactoryParams.projection
        ? layerConfig.layerFactoryParams.projection
        : projection,
      url: obj.url ? obj.url : legacyUrl,
      params: obj.params,
    }),
    opacity: obj.params.opacity ? obj.params.opacity : 1,
    format: layerConfig.layerFactoryParams.format
      ? layerConfig.layerFactoryParams.format
      : "",
    zIndex: layerConfig.zIndex,
  });

  if (layerConfig.geojsonPath && map) {
    console.log("Fetching GeoJSON from:", layerConfig.geojsonPath);

    fetch(layerConfig.geojsonPath)
      .then((res) => res.json())
      .then((geojson) => {
        const format = new ol.format.GeoJSON();
        const features = format.readFeatures(geojson, {
          dataProjection: "EPSG:4326",
          featureProjection: map.getView().getProjection(),
        });


        if (features && features.length > 0) {
          let extent = ol.extent.createEmpty();
          features.forEach((f) =>
            ol.extent.extend(extent, f.getGeometry().getExtent())
          );

          console.log("features from geojson", extent);
          map.getView().fit(extent, {
            size: map.getSize(),
            padding: [50, 50, 50, 50],
            duration: 1000,
          });

          let localClippingLayer = new ol.layer.Vector({
            source: new ol.source.Vector({ features }),
            style: null,
          });

          map.addLayer(localClippingLayer);


          clipLayerIfRequired(layer, localClippingLayer);
        } else {
          console.warn(
            " No features found in GeoJSON",
            layerConfig.geojsonPath
          );
        }
      })
      .catch((err) => {
        console.error("GeoJSON fetch error for", layerConfig.geojsonPath, err);
      });
  } else {
    console.warn("No geojsonPath for layer:", layerConfig.id, "not clipped");
  }

  return layer;
};
