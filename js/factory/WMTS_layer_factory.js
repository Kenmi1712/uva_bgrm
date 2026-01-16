export const createWMTSLayerObj = (layerConfig) => {
  let obj = getURLAndParams(layerConfig);

  let layer = new ol.layer.Tile({
    source: new ol.source.WMTS({
      url: obj.url,
      layer: obj.params.LAYERS,
      matrixSet: projection,
      format: obj.params.format,
      projection: new ol.proj.Projection({
        code: projection,
        units: obj.params.units,
        axisOrientation: obj.params.axisOrientation,
      }),
      tileGrid: new ol.tilegrid.WMTS({
        tileSize: obj.params.tileSize,
        extent: obj.params.extent,
        origin: obj.params.origin,
        resolutions: obj.params.resolutions,
        matrixIds: obj.params.matrixIds,
      }),
    }),
    opacity: obj.params.opacity ? obj.params.opacity : 1,
  });
  return layer;
};
