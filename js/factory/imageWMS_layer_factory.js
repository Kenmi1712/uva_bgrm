export const createImageWMSLayerObj = (layerConfig) => {
  let obj = getURLAndParams(layerConfig);

  let layer = new ol.layer.Image({
    source: new ol.source.ImageWMS({
      url: obj.url,
      params: obj.params,
      serverType: serverType,
    }),
    zIndex: layerConfig.zIndex,
    opacity: obj.params.opacity ? obj.params.opacity : 1,
  });
  return layer;
};
