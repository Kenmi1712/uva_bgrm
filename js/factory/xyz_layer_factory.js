export const createXYZLayerObj = (layerConfig) => {
  //Local variables declaration

  let obj = getURLAndParams(layerConfig);

  //Layer object instance
  let layer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: obj.url,
      // crossOrigin: crossOrigin,
    }),
    opacity: obj.params.opacity ? obj.params.opacity : 1,
  });
  return layer;
};
